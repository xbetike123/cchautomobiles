import "server-only";

import { getAdminClient } from "@/lib/admin/supabase";
import { leadFromRow, quoteFromRow } from "@/lib/admin/mappers";
import { MOCK_LEADS } from "@/lib/admin/mocks/leads";
import { MOCK_QUOTES } from "@/lib/admin/mocks/quotes";
import type { Database } from "@/lib/supabase/types";
import type { Lead, Quote, QuoteStatus } from "@/lib/admin/types";

type QuoteRow = Database["public"]["Tables"]["quotes"]["Row"];
type LeadRow = Database["public"]["Tables"]["quote_requests"]["Row"];

export type QuoteWithClient = Quote & {
  clientName: string;
  clientWhatsapp: string;
  destinationCity: string | null;
};

export type QuotesFilter = {
  status?: QuoteStatus;
  q?: string;
};

const STATUS_VALUES: readonly QuoteStatus[] = [
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
  "superseded",
];

function isQuoteStatus(value: string): value is QuoteStatus {
  return STATUS_VALUES.includes(value as QuoteStatus);
}

function enrichWithMockLead(quote: Quote): QuoteWithClient {
  const lead = MOCK_LEADS.find((l) => l.id === quote.leadId);
  return {
    ...quote,
    clientName: lead?.name ?? "Unknown client",
    clientWhatsapp: lead?.whatsapp ?? "",
    destinationCity: lead?.destinationCity ?? null,
  };
}

function rowsToWithClient(
  rows: (QuoteRow & { lead: LeadRow | null })[],
): QuoteWithClient[] {
  return rows.map((row) => {
    const quote = quoteFromRow(row);
    let lead: Lead | null = null;
    if (row.lead) {
      lead = leadFromRow(row.lead);
    }
    return {
      ...quote,
      clientName: lead?.name ?? "Unknown client",
      clientWhatsapp: lead?.whatsapp ?? "",
      destinationCity: lead?.destinationCity ?? null,
    };
  });
}

export async function getQuoteById(
  id: string,
): Promise<QuoteWithClient | null> {
  const supabase = getAdminClient();
  if (!supabase) {
    const quote = MOCK_QUOTES.find((q) => q.id === id);
    return quote ? enrichWithMockLead(quote) : null;
  }
  const { data, error } = await supabase
    .from("quotes")
    .select("*, lead:quote_requests!quotes_lead_id_fkey(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[admin/quotes] getQuoteById failed:", error.message);
    return null;
  }
  if (!data) return null;
  return rowsToWithClient([data])[0] ?? null;
}

export async function getQuotes(
  filter: QuotesFilter = {},
): Promise<QuoteWithClient[]> {
  const supabase = getAdminClient();
  if (!supabase) {
    const q = filter.q?.trim().toLowerCase();
    return MOCK_QUOTES.map(enrichWithMockLead)
      .filter((quote) => {
        if (filter.status && quote.status !== filter.status) return false;
        if (q) {
          const haystack = [
            quote.clientName,
            quote.clientWhatsapp,
            quote.carCode,
            quote.carName,
            quote.destinationCity ?? "",
          ]
            .join(" ")
            .toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt));
  }

  let query = supabase
    .from("quotes")
    .select("*, lead:quote_requests!quotes_lead_id_fkey(*)")
    .order("sent_at", { ascending: false });

  if (filter.status) query = query.eq("status", filter.status);

  if (filter.q) {
    const term = filter.q.trim();
    if (term) {
      const escaped = term.replace(/[%_]/g, (m) => `\\${m}`);
      const like = `%${escaped}%`;
      query = query.or(
        [`car_name.ilike.${like}`, `car_code.ilike.${like}`].join(","),
      );
    }
  }

  const { data, error } = await query;
  if (error) {
    console.error("[admin/quotes] getQuotes failed:", error.message);
    return [];
  }
  return rowsToWithClient((data ?? []) as (QuoteRow & { lead: LeadRow | null })[]);
}

export async function getQuotesStatusCounts(): Promise<
  Record<QuoteStatus | "all", number>
> {
  const counts = {
    all: 0,
    draft: 0,
    sent: 0,
    accepted: 0,
    rejected: 0,
    expired: 0,
    superseded: 0,
  } as Record<QuoteStatus | "all", number>;

  const supabase = getAdminClient();
  if (!supabase) {
    counts.all = MOCK_QUOTES.length;
    for (const q of MOCK_QUOTES) counts[q.status]++;
    return counts;
  }

  const { data, error } = await supabase.from("quotes").select("status");
  if (error) {
    console.error("[admin/quotes] getQuotesStatusCounts failed:", error.message);
    return counts;
  }
  for (const row of data ?? []) {
    counts.all++;
    if (isQuoteStatus(row.status)) counts[row.status]++;
  }
  return counts;
}

export async function getQuotesTotal(): Promise<number> {
  const supabase = getAdminClient();
  if (!supabase) return MOCK_QUOTES.length;
  const { count, error } = await supabase
    .from("quotes")
    .select("*", { head: true, count: "exact" });
  if (error) {
    console.error("[admin/quotes] getQuotesTotal failed:", error.message);
    return 0;
  }
  return count ?? 0;
}
