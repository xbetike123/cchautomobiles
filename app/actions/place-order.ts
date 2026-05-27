"use server";

import "server-only";

import { z } from "zod";

const trimmedRequired = (max: number, message: string) =>
  z
    .string({ message })
    .trim()
    .min(1, message)
    .max(max);

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
  name: trimmedRequired(120, "Name is required"),
  phone: z
    .string()
    .trim()
    .min(6, "Enter your phone number with country code")
    .max(32)
    .regex(/^[+\d][\d\s()-]+$/, "Use digits, spaces, +, () and - only"),
  whatsapp: trimmedNullable(32),
  email: z.email("Enter a valid email").max(254),
  car_code: trimmedNullable(40),
  preferred_brand: trimmedNullable(80),
  preferred_model: trimmedNullable(120),
  condition: z.enum(["new", "used", "either"]).optional(),
  budget_min: trimmedNullable(16),
  budget_max: trimmedNullable(16),
  timeline: z.enum(["asap", "this_week", "this_month", "flexible"]).optional(),
  destination_port: trimmedNullable(64),
  notes: trimmedNullable(1000),
});

export type PlaceOrderResult =
  | { ok: true; orderId: string }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<keyof z.infer<typeof schema>, string>>;
    };

function pickFieldErrors(error: z.ZodError<z.infer<typeof schema>>) {
  const out: Partial<Record<keyof z.infer<typeof schema>, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof z.infer<typeof schema> | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

export async function submitPlaceOrder(
  formData: FormData,
): Promise<PlaceOrderResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: pickFieldErrors(parsed.error),
    };
  }

  // Wire to Supabase + WhatsApp + invoice trigger when the order pipeline
  // is built. For now, log a structured payload so the front-end flow is
  // testable end-to-end without backend dependencies.
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
  console.log("[actions/place-order] new order", { orderId, ...parsed.data });

  return { ok: true, orderId };
}
