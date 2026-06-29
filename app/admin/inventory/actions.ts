"use server";

import "server-only";

import { revalidatePath } from "next/cache";

import {
  scrapeCarnewschina,
  type ScrapeResult,
} from "@/lib/scrapers/carnewschina";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/lib/supabase/types";

/**
 * Fetch + parse a carnewschina.com /params URL. Used by the Add/Edit Car
 * form to optionally attach a full manufacturer spec set to a listing.
 */
export async function previewScrape(url: string): Promise<ScrapeResult> {
  return scrapeCarnewschina(url);
}

// -- saveCar: the admin inventory write layer -------------------------------

const INVENTORY_IMAGES_BUCKET = "inventory-images";

/**
 * Scalar (non-file) half of the Add/Edit Car form payload. Sent as a single
 * JSON string field on the FormData; the File uploads ride alongside it under
 * the "newImages" key. Mirrors the `payload` object in AddCarForm.handleSubmit.
 */
type SaveCarFields = {
  id: string | null;
  brand: string;
  model: string;
  year: number;
  condition: "new" | "used";
  bodyType: string | null;
  priceUsdFob: number;
  rangeKm: number | null;
  mileageKm: number | null;
  batteryHealthPct: number | null;
  ownerCount: number | null;
  factoryWarrantyMonths: number | null;
  carCode: string | null;
  slug: string;
  status: string;
  weekAdded: string;
  heroImageUrl: string | null;
  keptGalleryImageUrls: string[];
  walkaroundVideoUrl: string | null;
  internalNotes: string | null;
  sourceUrl: string | null;
  sourceData: Json | null;
};

export type SaveCarResult =
  | { ok: true; slug: string; carCode: string | null }
  | { ok: false; error: string };

type InventoryInsert = Database["public"]["Tables"]["inventory"]["Insert"];

function sanitizeSegment(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Persist a car listing to public.inventory and its photos to the public
 * `inventory-images` storage bucket. Inserts when `fields.id` is null,
 * updates otherwise. Images are uploaded first so a storage failure aborts
 * before the row is written (never a row pointing at images that don't exist).
 *
 * The form's `status` uses admin vocabulary (coming_soon / on_the_lot / …) and
 * lands in the `internal_status` column. A DB trigger derives the public
 * `status` column from it, so we never set `status` directly here.
 */
export async function saveCar(formData: FormData): Promise<SaveCarResult> {
  const rawFields = formData.get("fields");
  if (typeof rawFields !== "string") {
    return { ok: false, error: "Missing car details." };
  }

  let fields: SaveCarFields;
  try {
    fields = JSON.parse(rawFields) as SaveCarFields;
  } catch {
    return { ok: false, error: "Car details were malformed." };
  }

  if (!fields.brand || !fields.model || !fields.slug) {
    return { ok: false, error: "Brand, model, and slug are required." };
  }

  const supabase = createSupabaseServiceClient();

  // 1. Upload any new images first. Order is preserved by index so the
  //    combined gallery keeps the order the admin arranged in the form.
  const newImages = formData
    .getAll("newImages")
    .filter((entry): entry is File => entry instanceof File);

  const uploadedUrls: string[] = [];
  for (let i = 0; i < newImages.length; i += 1) {
    const file = newImages[i];
    const ext = file.name.includes(".")
      ? file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase()
      : "jpg";
    const safeSlug = sanitizeSegment(fields.slug) || "car";
    const path = `${safeSlug}/${Date.now()}-${i}-${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(INVENTORY_IMAGES_BUCKET)
      .upload(path, file, {
        contentType: file.type || undefined,
        upsert: false,
      });

    if (uploadError) {
      console.error("[admin/inventory] image upload failed", uploadError);
      return {
        ok: false,
        error: `Image upload failed (${file.name}). No changes were saved — try again.`,
      };
    }

    const { data: publicUrl } = supabase.storage
      .from(INVENTORY_IMAGES_BUCKET)
      .getPublicUrl(path);
    uploadedUrls.push(publicUrl.publicUrl);
  }

  // 2. Combine kept + freshly uploaded URLs. The form already split the
  //    on-file images into hero (first) + kept gallery; new uploads append.
  const allImageUrls = [
    ...(fields.heroImageUrl ? [fields.heroImageUrl] : []),
    ...fields.keptGalleryImageUrls,
    ...uploadedUrls,
  ];
  const heroImageUrl = allImageUrls[0] ?? null;
  const galleryImageUrls = allImageUrls.slice(1);

  // 3. Build the row. `internal_status` carries the admin lifecycle value;
  //    the sync_inventory_status trigger derives the public `status`.
  const row: InventoryInsert = {
    brand: fields.brand,
    model: fields.model,
    year: fields.year,
    condition: fields.condition,
    body_type: fields.bodyType,
    price_usd_fob: fields.priceUsdFob,
    range_km: fields.rangeKm,
    mileage_km: fields.mileageKm,
    battery_health_pct: fields.batteryHealthPct,
    owner_count: fields.ownerCount,
    factory_warranty_months: fields.factoryWarrantyMonths,
    car_code: fields.carCode,
    slug: fields.slug,
    internal_status: fields.status,
    week_added: fields.weekAdded,
    hero_image_url: heroImageUrl,
    gallery_image_urls: galleryImageUrls,
    walkaround_video_url: fields.walkaroundVideoUrl,
    internal_notes: fields.internalNotes,
    source_url: fields.sourceUrl,
    source_data: fields.sourceData,
  };

  let savedSlug = fields.slug;
  let savedCarCode = fields.carCode;

  if (fields.id) {
    const { data, error } = await supabase
      .from("inventory")
      .update({ ...row, updated_at: new Date().toISOString() })
      .eq("id", fields.id)
      .select("slug, car_code")
      .single();

    if (error || !data) {
      console.error("[admin/inventory] update failed", error);
      return { ok: false, error: describeWriteError(error?.message) };
    }
    savedSlug = data.slug;
    savedCarCode = data.car_code;
  } else {
    const { data, error } = await supabase
      .from("inventory")
      .insert(row)
      .select("slug, car_code")
      .single();

    if (error || !data) {
      console.error("[admin/inventory] insert failed", error);
      return { ok: false, error: describeWriteError(error?.message) };
    }
    savedSlug = data.slug;
    savedCarCode = data.car_code;
  }

  // 4. Refresh the admin list/detail views and the public lot pages.
  revalidatePath("/admin/inventory");
  if (savedCarCode) {
    revalidatePath(`/admin/inventory/${savedCarCode}`);
    revalidatePath(`/admin/inventory/${savedCarCode}/edit`);
  }
  revalidatePath("/lot");
  revalidatePath(`/lot/${savedSlug}`);

  return { ok: true, slug: savedSlug, carCode: savedCarCode };
}

function describeWriteError(message: string | undefined): string {
  if (message && /duplicate key|unique/i.test(message)) {
    if (/slug/i.test(message)) {
      return "A car with this slug already exists. Change the year, brand, model, or car code.";
    }
    if (/car_code/i.test(message)) {
      return "A car with this car code already exists.";
    }
    return "A car with these details already exists.";
  }
  return "We couldn't save this car. Try again in a moment.";
}
