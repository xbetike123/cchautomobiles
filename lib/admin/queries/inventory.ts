import "server-only";

import { getAdminClient } from "@/lib/admin/supabase";
import { inventoryFromRow } from "@/lib/admin/mappers";
import { MOCK_INVENTORY } from "@/lib/admin/mocks/inventory";
import type { Inventory, InventoryStatus } from "@/lib/admin/types";

const STATUS_VALUES: readonly InventoryStatus[] = [
  "coming_soon",
  "on_the_lot",
  "reserved",
  "in_shipping",
  "delivered",
  "sold",
  "archived",
];

export function isInventoryStatus(value: string): value is InventoryStatus {
  return STATUS_VALUES.includes(value as InventoryStatus);
}

export type InventoryFilters = {
  status?: InventoryStatus;
  condition?: "new" | "used";
  q?: string;
};

function filterMocks(items: Inventory[], filters: InventoryFilters): Inventory[] {
  const q = filters.q?.trim().toLowerCase();
  return items.filter((item) => {
    if (filters.status && item.status !== filters.status) return false;
    if (filters.condition && item.condition !== filters.condition) return false;
    if (q) {
      const haystack = [
        item.brand,
        item.model,
        item.carCode,
        item.bodyType ?? "",
        String(item.year),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function sortByRecency(rows: Inventory[]): Inventory[] {
  return [...rows].sort((a, b) =>
    (b.weekAdded ?? b.createdAt).localeCompare(a.weekAdded ?? a.createdAt),
  );
}

export async function getInventoryByCarCode(
  carCode: string,
): Promise<Inventory | null> {
  const supabase = getAdminClient();
  if (!supabase) {
    return MOCK_INVENTORY.find((item) => item.carCode === carCode) ?? null;
  }
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("car_code", carCode)
    .maybeSingle();
  if (error) {
    console.error("[admin/inventory] getInventoryByCarCode failed:", error.message);
    return null;
  }
  return data ? inventoryFromRow(data) : null;
}

export async function getInventory(
  filters: InventoryFilters = {},
): Promise<Inventory[]> {
  const supabase = getAdminClient();
  if (!supabase) {
    return sortByRecency(filterMocks(MOCK_INVENTORY, filters));
  }

  let query = supabase.from("inventory").select("*");

  if (filters.status) {
    query = query.eq("internal_status", filters.status);
  }
  if (filters.condition) {
    query = query.eq("condition", filters.condition);
  }
  if (filters.q) {
    const term = filters.q.trim();
    if (term) {
      const escaped = term.replace(/[%_]/g, (m) => `\\${m}`);
      const like = `%${escaped}%`;
      query = query.or(
        [
          `brand.ilike.${like}`,
          `model.ilike.${like}`,
          `car_code.ilike.${like}`,
          `body_type.ilike.${like}`,
        ].join(","),
      );
    }
  }

  const { data, error } = await query;
  if (error) {
    console.error("[admin/inventory] getInventory failed:", error.message);
    return [];
  }
  return sortByRecency((data ?? []).map(inventoryFromRow));
}

export async function getInventoryStatusCounts(): Promise<
  Record<InventoryStatus | "all", number>
> {
  const counts = {
    all: 0,
    coming_soon: 0,
    on_the_lot: 0,
    reserved: 0,
    in_shipping: 0,
    delivered: 0,
    sold: 0,
    archived: 0,
  } as Record<InventoryStatus | "all", number>;

  const supabase = getAdminClient();
  if (!supabase) {
    counts.all = MOCK_INVENTORY.length;
    for (const item of MOCK_INVENTORY) counts[item.status]++;
    return counts;
  }

  const { data, error } = await supabase
    .from("inventory")
    .select("internal_status");
  if (error) {
    console.error(
      "[admin/inventory] getInventoryStatusCounts failed:",
      error.message,
    );
    return counts;
  }
  for (const row of data ?? []) {
    counts.all++;
    if (isInventoryStatus(row.internal_status)) {
      counts[row.internal_status]++;
    }
  }
  return counts;
}
