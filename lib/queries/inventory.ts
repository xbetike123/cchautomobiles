import "server-only";

import { MOCK_INVENTORY } from "@/lib/admin/mocks/inventory";
import type { Inventory, InventoryStatus } from "@/lib/admin/types";
import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type InventoryRow = Database["public"]["Tables"]["inventory"]["Row"];

export type InventorySort =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "battery-desc";

export type InventoryFilters = {
  condition?: "new" | "used";
  brand?: string;
  body?: string;
  sort?: InventorySort;
  page?: number;
  perPage?: number;
};

const PLACEHOLDER_IMAGE = "/placeholders/inventory-card.svg";

function row(
  partial: Pick<
    InventoryRow,
    | "slug"
    | "brand"
    | "model"
    | "year"
    | "condition"
    | "price_usd_fob"
    | "body_type"
    | "week_added"
  > &
    Partial<InventoryRow>,
): InventoryRow {
  const id = `fixture-${partial.slug}`;
  const isUsed = partial.condition === "used";
  return {
    id,
    slug: partial.slug,
    brand: partial.brand,
    model: partial.model,
    year: partial.year,
    condition: partial.condition,
    price_usd_fob: partial.price_usd_fob,
    mileage_km: partial.mileage_km ?? (isUsed ? 25000 : null),
    battery_health_pct: partial.battery_health_pct ?? (isUsed ? 92 : null),
    range_km: partial.range_km ?? null,
    body_type: partial.body_type,
    owner_count: partial.owner_count ?? (isUsed ? 1 : 0),
    hero_image_url: partial.hero_image_url ?? PLACEHOLDER_IMAGE,
    gallery_image_urls: partial.gallery_image_urls ?? [],
    walkaround_video_url: partial.walkaround_video_url ?? null,
    status: partial.status ?? "available",
    week_added: partial.week_added,
    sold_date: partial.sold_date ?? null,
    spec_sheet_pdf_url: partial.spec_sheet_pdf_url ?? null,
    factory_warranty_months:
      partial.factory_warranty_months ?? (isUsed ? null : 96),
    included_paperwork:
      partial.included_paperwork ??
      (isUsed
        ? ["First-owner registration", "Battery health report", "Service history"]
        : ["Factory invoice", "Export compliance certificate", "Battery passport"]),
    car_code: partial.car_code ?? null,
    internal_notes: partial.internal_notes ?? null,
    internal_status: partial.internal_status ?? "on_the_lot",
    created_at: `${partial.week_added}T00:00:00Z`,
    updated_at: `${partial.week_added}T00:00:00Z`,
  };
}

// Public-facing status mapping. Admin tracks more granular states than
// the lot page exposes; collapse them to the three public statuses used
// by the inventory query (`available`, `reserved`, `sold`). Archived
// rows do not surface publicly.
const ADMIN_STATUS_TO_PUBLIC: Partial<Record<InventoryStatus, string>> = {
  on_the_lot: "available",
  coming_soon: "available",
  reserved: "reserved",
  in_shipping: "reserved",
  sold: "sold",
  delivered: "sold",
};

function adminInventoryToRow(item: Inventory): InventoryRow | null {
  const status = ADMIN_STATUS_TO_PUBLIC[item.status];
  if (!status) return null;
  const isUsed = item.condition === "used";
  return {
    id: item.id,
    slug: item.slug,
    brand: item.brand,
    model: item.model,
    year: item.year,
    condition: item.condition,
    price_usd_fob: item.priceUsdFob,
    mileage_km: item.mileageKm,
    battery_health_pct: item.batteryHealthPct,
    range_km: item.rangeKm,
    body_type: item.bodyType,
    owner_count: item.ownerCount,
    hero_image_url: item.heroImageUrl,
    gallery_image_urls: item.galleryImageUrls ?? [],
    walkaround_video_url: item.walkaroundVideoUrl,
    status,
    week_added: item.weekAdded,
    sold_date: item.soldDate,
    spec_sheet_pdf_url: null,
    factory_warranty_months: item.factoryWarrantyMonths,
    included_paperwork: isUsed
      ? ["First-owner registration", "Battery health report", "Service history"]
      : ["Factory invoice", "Export compliance certificate", "Battery passport"],
    car_code: item.carCode || null,
    internal_notes: item.internalNotes,
    internal_status: item.status,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

/**
 * In-code inventory fixture. Mirrors the seed shape so the lot page
 * renders during local development before Supabase env is configured.
 */
const FIXTURE_INVENTORY: InventoryRow[] = [
  row({ slug: "byd-seal-2026", brand: "BYD", model: "Seal", year: 2026, condition: "new", price_usd_fob: 28500, range_km: 650, body_type: "Sedan", week_added: "2026-05-12" }),
  row({ slug: "xpeng-g6-2026", brand: "XPeng", model: "G6", year: 2026, condition: "new", price_usd_fob: 34200, range_km: 580, body_type: "SUV", week_added: "2026-05-10" }),
  row({ slug: "zeekr-001-2026", brand: "Zeekr", model: "001", year: 2026, condition: "new", price_usd_fob: 41800, range_km: 712, body_type: "Shooting brake", week_added: "2026-05-14" }),
  row({ slug: "byd-atto-3-2023", brand: "BYD", model: "Atto 3", year: 2023, condition: "used", price_usd_fob: 14800, mileage_km: 28400, battery_health_pct: 94, range_km: 420, body_type: "SUV", week_added: "2026-05-11" }),
  row({ slug: "geely-geometry-c-2022", brand: "Geely Galaxy", model: "Geometry C", year: 2022, condition: "used", price_usd_fob: 11200, mileage_km: 41200, battery_health_pct: 89, range_km: 401, body_type: "Hatchback", week_added: "2026-05-09" }),
  row({ slug: "leapmotor-c11-2023", brand: "Leapmotor", model: "C11", year: 2023, condition: "used", price_usd_fob: 17400, mileage_km: 19800, battery_health_pct: 96, range_km: 502, body_type: "SUV", week_added: "2026-05-13" }),
  row({ slug: "byd-han-2026", brand: "BYD", model: "Han", year: 2026, condition: "new", price_usd_fob: 36800, range_km: 715, body_type: "Sedan", week_added: "2026-05-08" }),
  row({ slug: "nio-et5-2024", brand: "NIO", model: "ET5", year: 2024, condition: "used", price_usd_fob: 26500, mileage_km: 18200, battery_health_pct: 95, range_km: 560, body_type: "Sedan", week_added: "2026-05-07" }),
  row({ slug: "li-l7-2025", brand: "Li Auto", model: "L7", year: 2025, condition: "used", price_usd_fob: 39800, mileage_km: 11400, battery_health_pct: 97, range_km: 1100, body_type: "SUV", week_added: "2026-05-06" }),
  row({ slug: "hongqi-eh7-2026", brand: "Hongqi", model: "EH7", year: 2026, condition: "new", price_usd_fob: 48500, range_km: 690, body_type: "Sedan", week_added: "2026-05-05" }),
  row({ slug: "aion-y-plus-2024", brand: "Aion", model: "Y Plus", year: 2024, condition: "used", price_usd_fob: 13900, mileage_km: 22800, battery_health_pct: 93, range_km: 430, body_type: "Hatchback", week_added: "2026-05-04" }),
  row({ slug: "xpeng-p7-2025", brand: "XPeng", model: "P7", year: 2025, condition: "used", price_usd_fob: 24800, mileage_km: 9800, battery_health_pct: 98, range_km: 620, body_type: "Sedan", week_added: "2026-05-03" }),
  row({ slug: "wuling-bingo-2026", brand: "Wuling", model: "Bingo", year: 2026, condition: "new", price_usd_fob: 9800, range_km: 333, body_type: "Hatchback", week_added: "2026-05-02" }),
  row({ slug: "voyah-free-2025", brand: "Voyah", model: "Free", year: 2025, condition: "new", price_usd_fob: 44200, range_km: 605, body_type: "SUV", week_added: "2026-05-01" }),
  row({ slug: "zeekr-7x-2026", brand: "Zeekr", model: "7X", year: 2026, condition: "new", price_usd_fob: 38500, range_km: 605, body_type: "SUV", week_added: "2026-04-29" }),
  row({ slug: "deepal-s07-2024", brand: "Deepal", model: "S07", year: 2024, condition: "used", price_usd_fob: 19400, mileage_km: 15600, battery_health_pct: 95, range_km: 525, body_type: "SUV", week_added: "2026-04-28" }),
  row({ slug: "geely-l7-2025", brand: "Geely Galaxy", model: "L7", year: 2025, condition: "used", price_usd_fob: 21200, mileage_km: 12400, battery_health_pct: 96, range_km: 600, body_type: "SUV", week_added: "2026-04-26" }),
  row({ slug: "neta-u-2024", brand: "NETA", model: "NETA U", year: 2024, condition: "used", price_usd_fob: 12400, mileage_km: 26900, battery_health_pct: 91, range_km: 401, body_type: "SUV", week_added: "2026-04-24" }),
];

// Public-visible dataset = static fixture + admin mocks (mapped). Used
// by every fallback path below so admin-created cars surface on the
// lot index and the public detail page.
const ADMIN_DERIVED_ROWS: InventoryRow[] = MOCK_INVENTORY
  .map(adminInventoryToRow)
  .filter((row): row is InventoryRow => row !== null);

const COMBINED_FIXTURE: InventoryRow[] = [
  ...FIXTURE_INVENTORY,
  ...ADMIN_DERIVED_ROWS,
];

const AVAILABLE_FIXTURE: InventoryRow[] = COMBINED_FIXTURE.filter(
  (car) => car.status === "available",
);

const SORT_COMPARATORS: Record<
  InventorySort,
  (a: InventoryRow, b: InventoryRow) => number
> = {
  newest: (a, b) =>
    (b.week_added ?? "").localeCompare(a.week_added ?? ""),
  "price-asc": (a, b) => a.price_usd_fob - b.price_usd_fob,
  "price-desc": (a, b) => b.price_usd_fob - a.price_usd_fob,
  "battery-desc": (a, b) =>
    (b.battery_health_pct ?? 0) - (a.battery_health_pct ?? 0),
};

function applyFixtureFilters(
  filters: InventoryFilters,
): { rows: InventoryRow[]; total: number } {
  const filtered = AVAILABLE_FIXTURE.filter((car) => {
    if (filters.condition && car.condition !== filters.condition) return false;
    if (filters.brand && car.brand !== filters.brand) return false;
    if (filters.body && car.body_type !== filters.body) return false;
    return true;
  });
  const sorted = [...filtered].sort(SORT_COMPARATORS[filters.sort ?? "newest"]);
  const perPage = filters.perPage ?? 12;
  const page = Math.max(1, filters.page ?? 1);
  const start = (page - 1) * perPage;
  return {
    rows: sorted.slice(start, start + perPage),
    total: sorted.length,
  };
}

/**
 * Returns up to 6 available cars for the home page grid, ordered newest
 * first. Falls back to the inline fixture when Supabase env is missing.
 */
export async function getOnTheLot(): Promise<InventoryRow[]> {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [...AVAILABLE_FIXTURE]
      .sort((a, b) =>
        (b.week_added ?? "").localeCompare(a.week_added ?? ""),
      )
      .slice(0, 6);
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
    return [...AVAILABLE_FIXTURE]
      .sort((a, b) =>
        (b.week_added ?? "").localeCompare(a.week_added ?? ""),
      )
      .slice(0, 6);
  }
  return data ?? [];
}

/**
 * Lot index query. Returns a page of available cars matching the
 * filters, plus the total count for pagination. Falls back to the
 * in-code fixture when Supabase env is missing.
 */
export async function getInventory(
  filters: InventoryFilters,
): Promise<{ rows: InventoryRow[]; total: number }> {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return applyFixtureFilters(filters);
  }
  const supabase = await createSupabaseServerClient();
  const perPage = filters.perPage ?? 12;
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("inventory")
    .select("*", { count: "exact" })
    .eq("status", "available");

  if (filters.condition) query = query.eq("condition", filters.condition);
  if (filters.brand) query = query.eq("brand", filters.brand);
  if (filters.body) query = query.eq("body_type", filters.body);

  const sort = filters.sort ?? "newest";
  if (sort === "price-asc") {
    query = query.order("price_usd_fob", { ascending: true });
  } else if (sort === "price-desc") {
    query = query.order("price_usd_fob", { ascending: false });
  } else if (sort === "battery-desc") {
    query = query.order("battery_health_pct", {
      ascending: false,
      nullsFirst: false,
    });
  } else {
    query = query.order("week_added", { ascending: false, nullsFirst: false });
  }

  const { data, count, error } = await query.range(from, to);
  if (error) {
    console.error("[queries/inventory] getInventory failed:", error.message);
    return applyFixtureFilters(filters);
  }
  return { rows: data ?? [], total: count ?? 0 };
}

/**
 * Look up a single car by its public slug. Returns `null` so callers
 * can call `notFound()` on a miss. Falls back to the fixture when
 * Supabase env is missing.
 */
export async function getCarBySlug(slug: string): Promise<InventoryRow | null> {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      COMBINED_FIXTURE.find(
        (c) => c.slug === slug && c.status === "available",
      ) ?? null
    );
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("slug", slug)
    .eq("status", "available")
    .maybeSingle();
  if (error) {
    console.error("[queries/inventory] getCarBySlug failed:", error.message);
    return null;
  }
  return data ?? null;
}

/**
 * Distinct brand and body type lists for filter dropdowns. Reads from
 * the fixture when Supabase env is missing.
 */
export async function getInventoryFacets(): Promise<{
  brands: string[];
  bodyTypes: string[];
}> {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return facetsFromRows(AVAILABLE_FIXTURE);
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("inventory")
    .select("brand,body_type")
    .eq("status", "available");
  if (error) {
    console.error(
      "[queries/inventory] getInventoryFacets failed:",
      error.message,
    );
    return facetsFromRows(AVAILABLE_FIXTURE);
  }
  return facetsFromRows(
    (data ?? []) as Pick<InventoryRow, "brand" | "body_type">[],
  );
}

function facetsFromRows(rows: Pick<InventoryRow, "brand" | "body_type">[]) {
  const brands = new Set<string>();
  const bodyTypes = new Set<string>();
  for (const r of rows) {
    if (r.brand) brands.add(r.brand);
    if (r.body_type) bodyTypes.add(r.body_type);
  }
  return {
    brands: Array.from(brands).sort((a, b) => a.localeCompare(b)),
    bodyTypes: Array.from(bodyTypes).sort((a, b) => a.localeCompare(b)),
  };
}
