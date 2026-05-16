import "server-only";

import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type TeamMemberRow =
  Database["public"]["Tables"]["team_members"]["Row"];

const PLACEHOLDER_PORTRAIT = "/placeholders/team-portrait.svg";

const FIXTURE_TEAM: TeamMemberRow[] = [
  {
    id: "f-team-1",
    name: "Placeholder team member one",
    role: "Operations lead, Guangzhou",
    bio_short: "Placeholder short bio one.",
    bio_long: "Placeholder long bio one.",
    photo_url: PLACEHOLDER_PORTRAIT,
    displayed_on_homepage: true,
    order_index: 1,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "f-team-2",
    name: "Placeholder team member two",
    role: "Head of sourcing",
    bio_short: "Placeholder short bio two.",
    bio_long: "Placeholder long bio two.",
    photo_url: PLACEHOLDER_PORTRAIT,
    displayed_on_homepage: true,
    order_index: 2,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "f-team-3",
    name: "Placeholder team member three",
    role: "Inspection lead",
    bio_short: "Placeholder short bio three.",
    bio_long: "Placeholder long bio three.",
    photo_url: PLACEHOLDER_PORTRAIT,
    displayed_on_homepage: true,
    order_index: 3,
    created_at: "2026-01-01T00:00:00Z",
  },
];

export async function getHomeTeam(): Promise<TeamMemberRow[]> {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return FIXTURE_TEAM;
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("displayed_on_homepage", true)
    .order("order_index", { ascending: true });
  if (error) {
    console.error("[queries/team] getHomeTeam failed:", error.message);
    return FIXTURE_TEAM;
  }
  return data ?? [];
}
