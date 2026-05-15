import "server-only";

import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type InventoryRow = Database["public"]["Tables"]["inventory"]["Row"];

/**
 * Cars to show on the home page "On the lot" grid and as the local-dev
 * fallback when Supabase env vars are not yet configured. Mirrors the
 * shape and values from supabase/seed.sql so the rendered output is
 * identical between fixture and live data during scaffolding.
 */
const FIXTURE_ON_THE_LOT: InventoryRow[] = [
  {
    id: "fixture-1",
    slug: "placeholder-byd-seal-2026",
    brand: "BYD",
    model: "Seal",
    year: 2026,
    condition: "new",
    price_usd_fob: 28500,
    mileage_km: null,
    battery_health_pct: null,
    range_km: 650,
    body_type: "Sedan",
    owner_count: 0,
    hero_image_url: "/placeholders/inventory-card.svg",
    gallery_image_urls: [],
    walkaround_video_url: null,
    status: "available",
    week_added: "2026-05-12",
    sold_date: null,
    spec_sheet_pdf_url: null,
    factory_warranty_months: 96,
    included_paperwork: [
      "Factory invoice",
      "Export compliance certificate",
      "Battery passport",
    ],
    created_at: "2026-05-12T00:00:00Z",
    updated_at: "2026-05-12T00:00:00Z",
  },
  {
    id: "fixture-2",
    slug: "placeholder-xpeng-g6-2026",
    brand: "Xpeng",
    model: "G6",
    year: 2026,
    condition: "new",
    price_usd_fob: 34200,
    mileage_km: null,
    battery_health_pct: null,
    range_km: 580,
    body_type: "SUV",
    owner_count: 0,
    hero_image_url: "/placeholders/inventory-card.svg",
    gallery_image_urls: [],
    walkaround_video_url: null,
    status: "available",
    week_added: "2026-05-10",
    sold_date: null,
    spec_sheet_pdf_url: null,
    factory_warranty_months: 96,
    included_paperwork: [
      "Factory invoice",
      "Export compliance certificate",
      "Battery passport",
    ],
    created_at: "2026-05-10T00:00:00Z",
    updated_at: "2026-05-10T00:00:00Z",
  },
  {
    id: "fixture-3",
    slug: "placeholder-zeekr-001-2026",
    brand: "Zeekr",
    model: "001",
    year: 2026,
    condition: "new",
    price_usd_fob: 41800,
    mileage_km: null,
    battery_health_pct: null,
    range_km: 712,
    body_type: "Shooting brake",
    owner_count: 0,
    hero_image_url: "/placeholders/inventory-card.svg",
    gallery_image_urls: [],
    walkaround_video_url: null,
    status: "available",
    week_added: "2026-05-14",
    sold_date: null,
    spec_sheet_pdf_url: null,
    factory_warranty_months: 96,
    included_paperwork: [
      "Factory invoice",
      "Export compliance certificate",
      "Battery passport",
    ],
    created_at: "2026-05-14T00:00:00Z",
    updated_at: "2026-05-14T00:00:00Z",
  },
  {
    id: "fixture-4",
    slug: "placeholder-byd-atto-3-2023",
    brand: "BYD",
    model: "Atto 3",
    year: 2023,
    condition: "used",
    price_usd_fob: 14800,
    mileage_km: 28400,
    battery_health_pct: 94,
    range_km: 420,
    body_type: "SUV",
    owner_count: 1,
    hero_image_url: "/placeholders/inventory-card.svg",
    gallery_image_urls: [],
    walkaround_video_url: null,
    status: "available",
    week_added: "2026-05-11",
    sold_date: null,
    spec_sheet_pdf_url: null,
    factory_warranty_months: null,
    included_paperwork: [
      "First-owner registration",
      "Battery health report",
      "Service history",
    ],
    created_at: "2026-05-11T00:00:00Z",
    updated_at: "2026-05-11T00:00:00Z",
  },
  {
    id: "fixture-5",
    slug: "placeholder-geely-geometry-c-2022",
    brand: "Geely",
    model: "Geometry C",
    year: 2022,
    condition: "used",
    price_usd_fob: 11200,
    mileage_km: 41200,
    battery_health_pct: 89,
    range_km: 401,
    body_type: "Hatchback",
    owner_count: 1,
    hero_image_url: "/placeholders/inventory-card.svg",
    gallery_image_urls: [],
    walkaround_video_url: null,
    status: "available",
    week_added: "2026-05-09",
    sold_date: null,
    spec_sheet_pdf_url: null,
    factory_warranty_months: null,
    included_paperwork: [
      "First-owner registration",
      "Battery health report",
      "Service history",
    ],
    created_at: "2026-05-09T00:00:00Z",
    updated_at: "2026-05-09T00:00:00Z",
  },
  {
    id: "fixture-6",
    slug: "placeholder-leapmotor-c11-2023",
    brand: "Leapmotor",
    model: "C11",
    year: 2023,
    condition: "used",
    price_usd_fob: 17400,
    mileage_km: 19800,
    battery_health_pct: 96,
    range_km: 502,
    body_type: "SUV",
    owner_count: 1,
    hero_image_url: "/placeholders/inventory-card.svg",
    gallery_image_urls: [],
    walkaround_video_url: null,
    status: "available",
    week_added: "2026-05-13",
    sold_date: null,
    spec_sheet_pdf_url: null,
    factory_warranty_months: null,
    included_paperwork: [
      "First-owner registration",
      "Battery health report",
      "Service history",
    ],
    created_at: "2026-05-13T00:00:00Z",
    updated_at: "2026-05-13T00:00:00Z",
  },
];

/**
 * Returns up to 6 available cars for the home page grid, ordered newest
 * first. Reads from Supabase under RLS when env vars are configured;
 * otherwise returns an inline fixture so the home page still renders
 * during local development before Supabase is wired in.
 */
export async function getOnTheLot(): Promise<InventoryRow[]> {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return FIXTURE_ON_THE_LOT;
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("status", "available")
    .order("week_added", { ascending: false, nullsFirst: false })
    .limit(6);
  if (error) {
    console.error("[queries/inventory] getOnTheLot failed:", error.message);
    return FIXTURE_ON_THE_LOT;
  }
  return data ?? [];
}
