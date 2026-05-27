import "server-only";

import { getAdminClient } from "@/lib/admin/supabase";
import { leadFromRow } from "@/lib/admin/mappers";
import { MOCK_LEADS } from "@/lib/admin/mocks/leads";
import type { Lead, LeadStatus, LeadTrack } from "@/lib/admin/types";

export type LeadsFilter = {
  status?: LeadStatus;
  track?: LeadTrack;
  hasCode?: "yes" | "no";
  q?: string;
};

const STATUS_VALUES: readonly LeadStatus[] = [
  "new",
  "contacted",
  "quoted",
  "negotiating",
  "reserved",
  "closed_won",
  "closed_lost",
];

function isLeadStatus(value: string): value is LeadStatus {
  return STATUS_VALUES.includes(value as LeadStatus);
}

function applyMockFilter(filter: LeadsFilter): Lead[] {
  const q = filter.q?.trim().toLowerCase();
  return [...MOCK_LEADS]
    .filter((l) => {
      if (filter.status && l.status !== filter.status) return false;
      if (filter.track && l.track !== filter.track) return false;
      if (filter.hasCode === "yes" && !l.carCode) return false;
      if (filter.hasCode === "no" && l.carCode) return false;
      if (q) {
        const haystack = [
          l.name,
          l.email,
          l.whatsapp,
          l.carCode ?? "",
          l.preferredBrand ?? "",
          l.preferredModel ?? "",
          l.destinationCity ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const supabase = getAdminClient();
  if (!supabase) {
    return MOCK_LEADS.find((l) => l.id === id) ?? null;
  }
  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[admin/leads] getLeadById failed:", error.message);
    return null;
  }
  return data ? leadFromRow(data) : null;
}

export async function listLeads(): Promise<Lead[]> {
  const supabase = getAdminClient();
  if (!supabase) {
    return [...MOCK_LEADS].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }
  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[admin/leads] listLeads failed:", error.message);
    return [];
  }
  return (data ?? []).map(leadFromRow);
}

export async function getLeads(filter: LeadsFilter = {}): Promise<Lead[]> {
  const supabase = getAdminClient();
  if (!supabase) {
    return applyMockFilter(filter);
  }

  let query = supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter.status) query = query.eq("status", filter.status);
  if (filter.track) query = query.eq("track", filter.track);
  if (filter.hasCode === "yes") query = query.not("cch_car_code", "is", null);
  if (filter.hasCode === "no") query = query.is("cch_car_code", null);
  if (filter.q) {
    const term = filter.q.trim();
    if (term) {
      const escaped = term.replace(/[%_]/g, (m) => `\\${m}`);
      const like = `%${escaped}%`;
      query = query.or(
        [
          `name.ilike.${like}`,
          `email.ilike.${like}`,
          `whatsapp.ilike.${like}`,
          `cch_car_code.ilike.${like}`,
          `preferred_brand.ilike.${like}`,
          `preferred_model.ilike.${like}`,
          `destination_city.ilike.${like}`,
        ].join(","),
      );
    }
  }

  const { data, error } = await query;
  if (error) {
    console.error("[admin/leads] getLeads failed:", error.message);
    return [];
  }
  return (data ?? []).map(leadFromRow);
}

export async function getLeadStatusCounts(): Promise<
  Record<LeadStatus | "all", number>
> {
  const counts = {
    all: 0,
    new: 0,
    contacted: 0,
    quoted: 0,
    negotiating: 0,
    reserved: 0,
    closed_won: 0,
    closed_lost: 0,
  } as Record<LeadStatus | "all", number>;

  const supabase = getAdminClient();
  if (!supabase) {
    counts.all = MOCK_LEADS.length;
    for (const lead of MOCK_LEADS) counts[lead.status]++;
    return counts;
  }

  const { data, error } = await supabase.from("quote_requests").select("status");
  if (error) {
    console.error("[admin/leads] getLeadStatusCounts failed:", error.message);
    return counts;
  }
  for (const row of data ?? []) {
    counts.all++;
    if (isLeadStatus(row.status)) counts[row.status]++;
  }
  return counts;
}
