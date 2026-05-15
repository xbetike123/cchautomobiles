import "server-only";

import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type BrandRow = Database["public"]["Tables"]["brands_sourced"]["Row"];

const FIXTURE_BRANDS: BrandRow[] = [
  { id: "f-byd",       name: "BYD",       logo_url: null, country: "China", order_index: 1,  active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: "f-geely",     name: "Geely",     logo_url: null, country: "China", order_index: 2,  active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: "f-xpeng",     name: "Xpeng",     logo_url: null, country: "China", order_index: 3,  active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: "f-zeekr",     name: "Zeekr",     logo_url: null, country: "China", order_index: 4,  active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: "f-wuling",    name: "Wuling",    logo_url: null, country: "China", order_index: 5,  active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: "f-leapmotor", name: "Leapmotor", logo_url: null, country: "China", order_index: 6,  active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: "f-nio",       name: "Nio",       logo_url: null, country: "China", order_index: 7,  active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: "f-liauto",    name: "Li Auto",   logo_url: null, country: "China", order_index: 8,  active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: "f-hongqi",    name: "Hongqi",    logo_url: null, country: "China", order_index: 9,  active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: "f-aion",      name: "Aion",      logo_url: null, country: "China", order_index: 10, active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: "f-neta",      name: "Neta",      logo_url: null, country: "China", order_index: 11, active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: "f-avatr",     name: "Avatr",     logo_url: null, country: "China", order_index: 12, active: true, created_at: "2026-01-01T00:00:00Z" },
];

export async function getBrands(): Promise<BrandRow[]> {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return FIXTURE_BRANDS;
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("brands_sourced")
    .select("*")
    .eq("active", true)
    .order("order_index", { ascending: true });
  if (error) {
    console.error("[queries/brands] getBrands failed:", error.message);
    return FIXTURE_BRANDS;
  }
  return data ?? [];
}
