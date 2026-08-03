import "server-only";

import { GUIDE_SHORT_TITLE } from "@/app/get-started/schema";
import { leadFromRow } from "@/lib/admin/mappers";
import { MOCK_LEADS } from "@/lib/admin/mocks/leads";
import { getAdminClient } from "@/lib/admin/supabase";
import type { Lead, UnifiedLead } from "@/lib/admin/types";

function joinDestination(
  city: string | null,
  country: string | null,
): string | null {
  const parts = [city, country].filter(
    (part): part is string => Boolean(part?.trim()),
  );
  return parts.length > 0 ? parts.join(", ") : null;
}

function carRequestDetail(lead: Lead): string | null {
  if (lead.carCode) return lead.carCode;
  if (lead.preferredBrand) {
    return `${lead.preferredBrand}${lead.preferredModel ? ` ${lead.preferredModel}` : ""}`;
  }
  return null;
}

function fromCarRequest(lead: Lead): UnifiedLead {
  return {
    id: lead.id,
    route: "car_request",
    name: lead.name,
    email: lead.email || null,
    whatsapp: lead.whatsapp || null,
    destination: joinDestination(lead.destinationCity, lead.destinationCountry),
    detail: carRequestDetail(lead),
    status: lead.status,
    createdAt: lead.createdAt,
    href: `/admin/leads/${lead.id}`,
  };
}

/**
 * Every contact across both funnels, newest first.
 *
 * Guide downloads live in a table added by migration 0017. If that migration
 * hasn't been applied the query 404s; we log and carry on with car requests
 * rather than failing the whole page.
 */
export async function listAllLeads(): Promise<UnifiedLead[]> {
  const supabase = getAdminClient();
  if (!supabase) {
    return [...MOCK_LEADS]
      .map(fromCarRequest)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const [carRequests, guideDownloads] = await Promise.all([
    supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("guide_downloads")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const rows: UnifiedLead[] = [];

  if (carRequests.error) {
    console.error(
      "[admin/all-leads] car requests failed:",
      carRequests.error.message,
    );
  } else {
    for (const row of carRequests.data ?? []) {
      rows.push(fromCarRequest(leadFromRow(row)));
    }
  }

  if (guideDownloads.error) {
    console.error(
      "[admin/all-leads] guide downloads failed (apply migration 0017?):",
      guideDownloads.error.message,
    );
  } else {
    for (const row of guideDownloads.data ?? []) {
      rows.push({
        id: row.id,
        route: "lead_magnet",
        name: row.first_name,
        email: row.email,
        whatsapp: null,
        destination: null,
        detail: GUIDE_SHORT_TITLE,
        status: null,
        createdAt: row.created_at,
        href: null,
      });
    }
  }

  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
