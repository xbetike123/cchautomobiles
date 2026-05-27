"use server";

import "server-only";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { sendRequestConfirmation } from "@/lib/email/send-request-confirmation";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

const REQUEST_IMAGES_BUCKET = "request-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const trimmedNullable = (max: number) =>
  z.preprocess(
    (v) => {
      if (typeof v !== "string") return undefined;
      const trimmed = v.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    },
    z.string().max(max).optional(),
  );

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.email("Enter a valid email").max(254),
  whatsapp: z
    .string()
    .trim()
    .min(6, "Enter your WhatsApp number with country code")
    .max(32)
    .regex(/^[+\d][\d\s()-]+$/, "Use digits, spaces, +, () and - only"),
  preferred_brand: trimmedNullable(80),
  preferred_model: trimmedNullable(120),
  cch_car_code: trimmedNullable(40),
});

type ParsedFields = z.infer<typeof schema>;
type FieldKey = keyof ParsedFields | "reference_image";

export type RequestCarResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<FieldKey, string>>;
    };

export async function submitRequestCar(
  formData: FormData,
): Promise<RequestCarResult> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    preferred_brand: formData.get("preferred_brand"),
    preferred_model: formData.get("preferred_model"),
    cch_car_code: formData.get("cch_car_code"),
  });

  if (!parsed.success) {
    const fieldErrors: Partial<Record<FieldKey, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in fieldErrors)) {
        fieldErrors[key as FieldKey] = issue.message;
      }
    }
    return { ok: false, error: "Check the highlighted fields.", fieldErrors };
  }

  const file = formData.get("reference_image");
  const hasFile = file instanceof File && file.size > 0;

  if (hasFile) {
    if (!ALLOWED_IMAGE_MIME.has(file.type)) {
      return {
        ok: false,
        error: "Image must be JPEG, PNG, WEBP, or HEIC.",
        fieldErrors: { reference_image: "Unsupported image type." },
      };
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return {
        ok: false,
        error: "Image must be 5MB or smaller.",
        fieldErrors: { reference_image: "Image is too large (max 5MB)." },
      };
    }
  }

  const supabase = createSupabaseServiceClient();

  let referenceImagePath: string | null = null;
  if (hasFile) {
    const extension = guessExtension(file.type, file.name);
    referenceImagePath = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(REQUEST_IMAGES_BUCKET)
      .upload(referenceImagePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });
    if (uploadError) {
      console.error("[request-car] storage upload failed", uploadError);
      return {
        ok: false,
        error: "We couldn't upload your image. Try again or skip the image.",
        fieldErrors: { reference_image: "Upload failed. Try again." },
      };
    }
  }

  const requestHeaders = await headers();
  const ipAddress = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

  const { error: insertError } = await supabase.from("quote_requests").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    whatsapp: parsed.data.whatsapp,
    preferred_brand: parsed.data.preferred_brand ?? null,
    preferred_model: parsed.data.preferred_model ?? null,
    cch_car_code: parsed.data.cch_car_code ?? null,
    reference_image_path: referenceImagePath,
    ip_address: ipAddress,
  });

  if (insertError) {
    console.error("[request-car] insert failed", insertError);
    if (referenceImagePath) {
      // Best-effort cleanup so we don't leave an orphaned upload.
      await supabase.storage
        .from(REQUEST_IMAGES_BUCKET)
        .remove([referenceImagePath]);
    }
    return {
      ok: false,
      error: "We couldn't save your request. Try again in a moment.",
    };
  }

  // Fire-and-forget so a slow Resend response never blocks the user.
  void sendRequestConfirmation({
    toEmail: parsed.data.email,
    name: parsed.data.name,
    preferredBrand: parsed.data.preferred_brand ?? null,
    preferredModel: parsed.data.preferred_model ?? null,
    cchCarCode: parsed.data.cch_car_code ?? null,
  });

  return { ok: true };
}

function guessExtension(mime: string, fileName: string): string {
  const fromName = fileName.match(/\.[a-z0-9]+$/i)?.[0]?.toLowerCase();
  if (fromName) return fromName;
  switch (mime) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/heic":
      return ".heic";
    case "image/heif":
      return ".heif";
    default:
      return "";
  }
}
