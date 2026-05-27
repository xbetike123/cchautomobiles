import "server-only";

import { getAdminClient } from "@/lib/admin/supabase";
import { invoiceFromRow } from "@/lib/admin/mappers";
import { MOCK_INVOICES } from "@/lib/admin/mocks/invoices";
import type { Invoice, InvoiceStatus } from "@/lib/admin/types";

const STATUS_VALUES: readonly InvoiceStatus[] = [
  "draft",
  "sent",
  "paid",
  "overdue",
  "refunded",
  "void",
];

export function isInvoiceStatus(value: string): value is InvoiceStatus {
  return STATUS_VALUES.includes(value as InvoiceStatus);
}

export type InvoiceFilters = {
  status?: InvoiceStatus;
  q?: string;
};

export async function getInvoiceByNumber(
  invoiceNumber: string,
): Promise<Invoice | null> {
  const supabase = getAdminClient();
  if (!supabase) {
    return (
      MOCK_INVOICES.find((invoice) => invoice.invoiceNumber === invoiceNumber) ??
      null
    );
  }
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("invoice_number", invoiceNumber)
    .maybeSingle();
  if (error) {
    console.error("[admin/invoices] getInvoiceByNumber failed:", error.message);
    return null;
  }
  return data ? invoiceFromRow(data) : null;
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const supabase = getAdminClient();
  if (!supabase) {
    return MOCK_INVOICES.find((invoice) => invoice.id === id) ?? null;
  }
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[admin/invoices] getInvoiceById failed:", error.message);
    return null;
  }
  return data ? invoiceFromRow(data) : null;
}

export async function getChildBalanceInvoice(
  depositInvoiceId: string,
): Promise<Invoice | null> {
  const supabase = getAdminClient();
  if (!supabase) {
    return (
      MOCK_INVOICES.find(
        (invoice) =>
          invoice.parentInvoiceId === depositInvoiceId && invoice.kind === "balance",
      ) ?? null
    );
  }
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("parent_invoice_id", depositInvoiceId)
    .eq("kind", "balance")
    .maybeSingle();
  if (error) {
    console.error(
      "[admin/invoices] getChildBalanceInvoice failed:",
      error.message,
    );
    return null;
  }
  return data ? invoiceFromRow(data) : null;
}

export async function getInvoices(
  filters: InvoiceFilters = {},
): Promise<Invoice[]> {
  const supabase = getAdminClient();
  if (!supabase) {
    const q = filters.q?.trim().toLowerCase();
    const rows = MOCK_INVOICES.filter((invoice) => {
      if (filters.status && invoice.status !== filters.status) return false;
      if (q) {
        const haystack = [
          invoice.invoiceNumber,
          invoice.clientName,
          invoice.carCode ?? "",
          invoice.carDescription ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    return [...rows].sort((a, b) =>
      (b.issuedAt ?? b.createdAt).localeCompare(a.issuedAt ?? a.createdAt),
    );
  }

  let query = supabase
    .from("invoices")
    .select("*")
    .order("issued_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.q) {
    const term = filters.q.trim();
    if (term) {
      const escaped = term.replace(/[%_]/g, (m) => `\\${m}`);
      const like = `%${escaped}%`;
      query = query.or(
        [
          `invoice_number.ilike.${like}`,
          `client_name.ilike.${like}`,
          `car_code.ilike.${like}`,
          `car_description.ilike.${like}`,
        ].join(","),
      );
    }
  }

  const { data, error } = await query;
  if (error) {
    console.error("[admin/invoices] getInvoices failed:", error.message);
    return [];
  }
  return (data ?? []).map(invoiceFromRow);
}

export async function getInvoiceStatusCounts(): Promise<
  Record<InvoiceStatus | "all", number>
> {
  const counts = {
    all: 0,
    draft: 0,
    sent: 0,
    paid: 0,
    overdue: 0,
    refunded: 0,
    void: 0,
  } as Record<InvoiceStatus | "all", number>;

  const supabase = getAdminClient();
  if (!supabase) {
    counts.all = MOCK_INVOICES.length;
    for (const invoice of MOCK_INVOICES) counts[invoice.status]++;
    return counts;
  }

  const { data, error } = await supabase.from("invoices").select("status");
  if (error) {
    console.error(
      "[admin/invoices] getInvoiceStatusCounts failed:",
      error.message,
    );
    return counts;
  }
  for (const row of data ?? []) {
    counts.all++;
    if (isInvoiceStatus(row.status)) counts[row.status]++;
  }
  return counts;
}

export async function getInvoiceTotals(): Promise<{
  outstandingUsd: number;
  paidUsd: number;
  overdueUsd: number;
}> {
  const supabase = getAdminClient();
  if (!supabase) {
    let outstandingUsd = 0;
    let paidUsd = 0;
    let overdueUsd = 0;
    for (const invoice of MOCK_INVOICES) {
      if (invoice.status === "paid") paidUsd += invoice.amountUsd;
      else if (invoice.status === "overdue") {
        overdueUsd += invoice.amountUsd;
        outstandingUsd += invoice.amountUsd;
      } else if (invoice.status === "sent") {
        outstandingUsd += invoice.amountUsd;
      }
    }
    return { outstandingUsd, paidUsd, overdueUsd };
  }

  const { data, error } = await supabase
    .from("invoices")
    .select("status, amount_usd");
  if (error) {
    console.error("[admin/invoices] getInvoiceTotals failed:", error.message);
    return { outstandingUsd: 0, paidUsd: 0, overdueUsd: 0 };
  }
  let outstandingUsd = 0;
  let paidUsd = 0;
  let overdueUsd = 0;
  for (const row of data ?? []) {
    const amount = Number(row.amount_usd);
    if (row.status === "paid") paidUsd += amount;
    else if (row.status === "overdue") {
      overdueUsd += amount;
      outstandingUsd += amount;
    } else if (row.status === "sent") {
      outstandingUsd += amount;
    }
  }
  return { outstandingUsd, paidUsd, overdueUsd };
}
