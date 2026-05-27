// Formatting helpers shared across admin components. All time-based helpers
// take a reference "now" so server-side rendering is deterministic during
// review. When live data lands, pass `new Date().toISOString()` for `now`.

import type {
  InventoryStatus,
  InvoiceKind,
  InvoiceStatus,
  LeadStatus,
  LeadTrack,
  QuoteStatus,
} from "@/lib/admin/types";

const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const NGN_FORMATTER = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

// Mock FX rate. Live value will come from `settings.ngn_per_usd` once the
// settings UI is wired (cchu_admin_architecture.md, Phase 3).
export const NGN_PER_USD_MOCK = 1620;

export function formatUsd(value: number): string {
  return USD_FORMATTER.format(value);
}

export function formatNgn(value: number): string {
  return NGN_FORMATTER.format(value);
}

export function formatNgnApprox(usd: number): string {
  return formatNgn(Math.round(usd * NGN_PER_USD_MOCK));
}

export function formatBudgetRange(
  min: number | null,
  max: number | null,
): string {
  if (min === null && max === null) return "—";
  if (min !== null && max !== null) {
    return `${formatUsd(min)} – ${formatUsd(max)}`;
  }
  return formatUsd((min ?? max) as number);
}

function formatThousands(n: number): string {
  if (n < 1000) return `$${n}`;
  const k = Math.round(n / 1000);
  return `$${k}k`;
}

export function formatBudgetShort(
  min: number | null,
  max: number | null,
): string {
  if (min === null && max === null) return "—";
  if (min !== null && max !== null) {
    if (min === max) return formatThousands(min);
    return `${formatThousands(min)} – ${formatThousands(max).replace("$", "")}`;
  }
  return formatThousands((min ?? max) as number);
}

export function formatRelativeTime(iso: string, now: string): string {
  const target = new Date(iso).getTime();
  const reference = new Date(now).getTime();
  const diffMs = reference - target;
  const minute = 60_000;
  const hour = 3_600_000;
  const day = 86_400_000;

  if (diffMs < 0) {
    const absMs = Math.abs(diffMs);
    if (absMs < hour) return `in ${Math.max(1, Math.round(absMs / minute))}m`;
    if (absMs < day) return `in ${Math.round(absMs / hour)}h`;
    return `in ${Math.round(absMs / day)}d`;
  }

  if (diffMs < minute) return "just now";
  if (diffMs < hour) return `${Math.round(diffMs / minute)}m ago`;
  if (diffMs < day) return `${Math.round(diffMs / hour)}h ago`;
  if (diffMs < 7 * day) return `${Math.round(diffMs / day)}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  negotiating: "Negotiating",
  reserved: "Reserved",
  closed_won: "Won",
  closed_lost: "Lost",
};

export const LEAD_TRACK_LABEL: Record<LeadTrack, string> = {
  in_stock: "In stock",
  source_to_order: "Source to order",
  unclassified: "Browsing",
};

export const QUOTE_STATUS_LABEL: Record<QuoteStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  rejected: "Rejected",
  expired: "Expired",
  superseded: "Superseded",
};

export const INVENTORY_STATUS_LABEL: Record<InventoryStatus, string> = {
  coming_soon: "Coming soon",
  on_the_lot: "On the lot",
  reserved: "Reserved",
  in_shipping: "In shipping",
  delivered: "Delivered",
  sold: "Sold",
  archived: "Archived",
};

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  refunded: "Refunded",
  void: "Void",
};

export const INVOICE_KIND_LABEL: Record<InvoiceKind, string> = {
  deposit: "Deposit",
  balance: "Balance",
  single: "Full payment",
};
