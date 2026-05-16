import "server-only";

import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type MarketIntelRow =
  Database["public"]["Tables"]["market_intel_posts"]["Row"];

const FIXTURE_POSTS: MarketIntelRow[] = [
  {
    id: "f-intel-1",
    slug: "placeholder-intel-byd-export-pricing",
    title: "Placeholder: BYD export pricing snapshot",
    preview: "Placeholder preview line for the BYD export pricing post.",
    body_markdown:
      "# Placeholder post body one\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.",
    published_at: "2026-05-13T00:00:00Z",
    read_time_minutes: 6,
    cover_image_url: null,
    author: "Placeholder author",
    category: "Pricing",
    created_at: "2026-05-13T00:00:00Z",
    updated_at: "2026-05-13T00:00:00Z",
  },
  {
    id: "f-intel-2",
    slug: "placeholder-intel-shipping-rates",
    title: "Placeholder: Ocean shipping rates to Lagos",
    preview: "Placeholder preview line for the shipping rates post.",
    body_markdown:
      "# Placeholder post body two\n\nSed do eiusmod tempor incididunt.",
    published_at: "2026-05-06T00:00:00Z",
    read_time_minutes: 8,
    cover_image_url: null,
    author: "Placeholder author",
    category: "Shipping",
    created_at: "2026-05-06T00:00:00Z",
    updated_at: "2026-05-06T00:00:00Z",
  },
  {
    id: "f-intel-3",
    slug: "placeholder-intel-battery-health",
    title: "Placeholder: Battery health on used Chinese EVs",
    preview: "Placeholder preview line for the battery health post.",
    body_markdown:
      "# Placeholder post body three\n\nUt enim ad minim veniam.",
    published_at: "2026-04-25T00:00:00Z",
    read_time_minutes: 7,
    cover_image_url: null,
    author: "Placeholder author",
    category: "Inspection",
    created_at: "2026-04-25T00:00:00Z",
    updated_at: "2026-04-25T00:00:00Z",
  },
];

export async function getHomeMarketIntel(): Promise<MarketIntelRow[]> {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return FIXTURE_POSTS.slice(0, 3);
  }
  const supabase = await createSupabaseServerClient();
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("market_intel_posts")
    .select("*")
    .lte("published_at", nowIso)
    .order("published_at", { ascending: false })
    .limit(3);
  if (error) {
    console.error(
      "[queries/marketIntel] getHomeMarketIntel failed:",
      error.message,
    );
    return FIXTURE_POSTS.slice(0, 3);
  }
  return data ?? [];
}
