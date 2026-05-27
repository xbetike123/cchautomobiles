import "server-only";

import { getAdminClient } from "@/lib/admin/supabase";
import { inventoryFromRow, leadFromRow } from "@/lib/admin/mappers";
import { MOCK_INVENTORY } from "@/lib/admin/mocks/inventory";
import { MOCK_LEADS } from "@/lib/admin/mocks/leads";
import { MOCK_QUOTES } from "@/lib/admin/mocks/quotes";
import type {
  DashboardKpis,
  Inventory,
  Lead,
} from "@/lib/admin/types";

export type RevenueThisMonth = {
  totalUsd: number;
  dealCount: number;
  avgDealUsd: number;
};

// Dashboard data access. KPI counts are computed against a fixed
// reference moment for now so build-time renders remain stable; once
// the operator starts inserting live data, swap to `new Date()`.
const NOW_REFERENCE = "2026-05-16T12:00:00Z";

function startOfWeekIso(reference: string): string {
  const d = new Date(reference);
  const day = d.getUTCDay();
  // Week starts Monday.
  const diff = (day + 6) % 7;
  d.setUTCDate(d.getUTCDate() - diff);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function startOfMonthIso(reference: string): string {
  const d = new Date(reference);
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

async function countAll(
  table: "quote_requests" | "inventory" | "quotes",
): Promise<number> {
  const supabase = getAdminClient();
  if (!supabase) return 0;
  const { count, error } = await supabase
    .from(table)
    .select("*", { head: true, count: "exact" });
  if (error) {
    console.error(`[admin/dashboard] count(${table}) failed:`, error.message);
    return 0;
  }
  return count ?? 0;
}

export async function getDashboardKpis(): Promise<DashboardKpis> {
  const weekStart = startOfWeekIso(NOW_REFERENCE);
  const monthStart = startOfMonthIso(NOW_REFERENCE);

  const supabase = getAdminClient();
  if (!supabase) {
    return {
      newLeadsThisWeek: MOCK_LEADS.filter((l) => l.createdAt >= weekStart).length,
      carsOnTheLot: MOCK_INVENTORY.filter((i) => i.status === "on_the_lot").length,
      quotesSentThisWeek: MOCK_QUOTES.filter((q) => q.sentAt >= weekStart).length,
      reservedThisMonth: MOCK_LEADS.filter(
        (l) => l.status === "reserved" && l.createdAt >= monthStart,
      ).length,
    };
  }

  const [
    { count: newLeadsThisWeek, error: e1 },
    { count: carsOnTheLot, error: e2 },
    { count: quotesSentThisWeek, error: e3 },
    { count: reservedThisMonth, error: e4 },
  ] = await Promise.all([
    supabase
      .from("quote_requests")
      .select("*", { head: true, count: "exact" })
      .gte("created_at", weekStart),
    supabase
      .from("inventory")
      .select("*", { head: true, count: "exact" })
      .eq("internal_status", "on_the_lot"),
    supabase
      .from("quotes")
      .select("*", { head: true, count: "exact" })
      .gte("sent_at", weekStart),
    supabase
      .from("quote_requests")
      .select("*", { head: true, count: "exact" })
      .eq("status", "reserved")
      .gte("created_at", monthStart),
  ]);

  for (const err of [e1, e2, e3, e4]) {
    if (err) console.error("[admin/dashboard] KPI count failed:", err.message);
  }

  return {
    newLeadsThisWeek: newLeadsThisWeek ?? 0,
    carsOnTheLot: carsOnTheLot ?? 0,
    quotesSentThisWeek: quotesSentThisWeek ?? 0,
    reservedThisMonth: reservedThisMonth ?? 0,
  };
}

export async function getLatestLeads(limit = 5): Promise<Lead[]> {
  const supabase = getAdminClient();
  if (!supabase) {
    return [...MOCK_LEADS]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }
  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[admin/dashboard] getLatestLeads failed:", error.message);
    return [];
  }
  return (data ?? []).map(leadFromRow);
}

export async function getLeadsTotal(): Promise<number> {
  if (!getAdminClient()) return MOCK_LEADS.length;
  return countAll("quote_requests");
}

export async function getLatestInventory(limit = 5): Promise<Inventory[]> {
  const supabase = getAdminClient();
  if (!supabase) {
    return [...MOCK_INVENTORY]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[admin/dashboard] getLatestInventory failed:", error.message);
    return [];
  }
  return (data ?? []).map(inventoryFromRow);
}

export async function getInventoryTotal(): Promise<number> {
  if (!getAdminClient()) return MOCK_INVENTORY.length;
  return countAll("inventory");
}

export async function getDeadlinesApproaching(): Promise<Lead[]> {
  const now = new Date(NOW_REFERENCE).getTime();
  const horizon = new Date(now + 12 * 60 * 60 * 1000).toISOString();
  const nowIso = new Date(now).toISOString();

  const supabase = getAdminClient();
  if (!supabase) {
    return MOCK_LEADS.filter((l) => {
      if (l.track !== "source_to_order" || !l.sourceDeadline) return false;
      const t = new Date(l.sourceDeadline).getTime();
      return t >= now && t <= now + 12 * 60 * 60 * 1000;
    }).sort((a, b) =>
      (a.sourceDeadline ?? "").localeCompare(b.sourceDeadline ?? ""),
    );
  }

  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("track", "source_to_order")
    .not("source_deadline", "is", null)
    .gte("source_deadline", nowIso)
    .lte("source_deadline", horizon)
    .order("source_deadline", { ascending: true });
  if (error) {
    console.error(
      "[admin/dashboard] getDeadlinesApproaching failed:",
      error.message,
    );
    return [];
  }
  return (data ?? []).map(leadFromRow);
}

export async function getRevenueThisMonth(): Promise<RevenueThisMonth> {
  const monthStart = startOfMonthIso(NOW_REFERENCE);

  const supabase = getAdminClient();
  if (!supabase) {
    const wonLeadIds = new Set(
      MOCK_LEADS.filter(
        (l) => l.status === "closed_won" && l.createdAt >= monthStart,
      ).map((l) => l.id),
    );
    const wonQuotes = MOCK_QUOTES.filter((q) => wonLeadIds.has(q.leadId));
    const totalUsd = wonQuotes.reduce((sum, q) => sum + q.totalUsd, 0);
    const dealCount = wonQuotes.length;
    const avgDealUsd = dealCount > 0 ? Math.round(totalUsd / dealCount) : 0;
    return { totalUsd, dealCount, avgDealUsd };
  }

  const { data: wonLeads, error: leadsErr } = await supabase
    .from("quote_requests")
    .select("id")
    .eq("status", "closed_won")
    .gte("created_at", monthStart);
  if (leadsErr) {
    console.error(
      "[admin/dashboard] getRevenueThisMonth (leads) failed:",
      leadsErr.message,
    );
    return { totalUsd: 0, dealCount: 0, avgDealUsd: 0 };
  }
  const ids = (wonLeads ?? []).map((l) => l.id);
  if (ids.length === 0) {
    return { totalUsd: 0, dealCount: 0, avgDealUsd: 0 };
  }

  const { data: quoteRows, error: quotesErr } = await supabase
    .from("quotes")
    .select("total_usd")
    .in("lead_id", ids);
  if (quotesErr) {
    console.error(
      "[admin/dashboard] getRevenueThisMonth (quotes) failed:",
      quotesErr.message,
    );
    return { totalUsd: 0, dealCount: 0, avgDealUsd: 0 };
  }
  const totalUsd = (quoteRows ?? []).reduce(
    (sum, q) => sum + Number(q.total_usd),
    0,
  );
  const dealCount = quoteRows?.length ?? 0;
  const avgDealUsd = dealCount > 0 ? Math.round(totalUsd / dealCount) : 0;
  return { totalUsd, dealCount, avgDealUsd };
}

export async function getWaitResponsesPending(): Promise<Lead[]> {
  const cutoff = new Date(
    new Date(NOW_REFERENCE).getTime() - 24 * 60 * 60 * 1000,
  ).toISOString();

  const supabase = getAdminClient();
  if (!supabase) {
    const cutoffMs = new Date(cutoff).getTime();
    return MOCK_LEADS.filter(
      (l) =>
        l.track === "source_to_order" &&
        l.waitResponse === "pending" &&
        l.autoReplySentAt !== null &&
        new Date(l.autoReplySentAt).getTime() <= cutoffMs,
    );
  }

  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("track", "source_to_order")
    .eq("wait_response", "pending")
    .not("auto_reply_sent_at", "is", null)
    .lte("auto_reply_sent_at", cutoff);
  if (error) {
    console.error(
      "[admin/dashboard] getWaitResponsesPending failed:",
      error.message,
    );
    return [];
  }
  return (data ?? []).map(leadFromRow);
}
