"use server";

import "server-only";

import { revalidatePath } from "next/cache";

import { getCurrentAdmin } from "@/lib/admin/auth";
import { getAdminClient } from "@/lib/admin/supabase";
import type { LeadRoute } from "@/lib/admin/types";

export type DeleteLeadsResult =
  | { ok: true; deleted: number }
  | { ok: false; error: string };

export type LeadRef = { id: string; route: LeadRoute };

const TABLE_BY_ROUTE: Record<LeadRoute, "quote_requests" | "guide_downloads"> = {
  car_request: "quote_requests",
  lead_magnet: "guide_downloads",
};

/**
 * Permanently remove contacts. Rows are grouped by route so each table is hit
 * once rather than per-row.
 */
export async function deleteLeads(
  refs: LeadRef[],
): Promise<DeleteLeadsResult> {
  await getCurrentAdmin();
  const supabase = getAdminClient();
  if (!supabase) {
    return {
      ok: false,
      error: "Supabase is not configured, so leads cannot be deleted.",
    };
  }
  if (refs.length === 0) return { ok: true, deleted: 0 };

  const byRoute = new Map<LeadRoute, string[]>();
  for (const ref of refs) {
    const ids = byRoute.get(ref.route) ?? [];
    ids.push(ref.id);
    byRoute.set(ref.route, ids);
  }

  let deleted = 0;
  for (const [route, ids] of byRoute) {
    const { error, count } = await supabase
      .from(TABLE_BY_ROUTE[route])
      .delete({ count: "exact" })
      .in("id", ids);
    if (error) {
      console.error(`[admin/all-leads] delete ${route} failed:`, error.message);
      return {
        ok: false,
        error:
          deleted > 0
            ? `Deleted ${deleted}, then hit an error. Refresh and try the rest.`
            : "The leads could not be deleted. Please try again.",
      };
    }
    deleted += count ?? ids.length;
  }

  revalidatePath("/admin/all-leads");
  revalidatePath("/admin/leads");
  return { ok: true, deleted };
}
