import { Plus } from "lucide-react";
import Link from "next/link";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { InvoicesTable } from "@/components/admin/invoices/InvoicesTable";
import { INVOICE_STATUS_LABEL, formatUsd } from "@/lib/admin/format";
import {
  getInvoiceStatusCounts,
  getInvoiceTotals,
  getInvoices,
  isInvoiceStatus,
} from "@/lib/admin/queries/invoices";
import type { InvoiceStatus } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type RawSearchParams = {
  [key: string]: string | string[] | undefined;
};

type PageProps = {
  searchParams: Promise<RawSearchParams>;
};

function asString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value ?? undefined;
}

const FILTER_VALUES: (InvoiceStatus | "all")[] = [
  "all",
  "draft",
  "sent",
  "paid",
  "overdue",
  "refunded",
  "void",
];

function statusHref(value: InvoiceStatus | "all", q?: string): string {
  const params = new URLSearchParams();
  if (value !== "all") params.set("status", value);
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/admin/invoices?${qs}` : "/admin/invoices";
}

export default async function AdminInvoicesPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const statusRaw = asString(raw.status);
  const status = statusRaw && isInvoiceStatus(statusRaw) ? statusRaw : undefined;
  const q = asString(raw.q);

  const [invoices, counts, totals] = await Promise.all([
    getInvoices({ status, q }),
    getInvoiceStatusCounts(),
    getInvoiceTotals(),
  ]);

  const hasFilters = Boolean(status || q);
  const activeFilter: InvoiceStatus | "all" = status ?? "all";

  return (
    <>
      <AdminHeader
        eyebrow="Billing"
        title="Invoices"
        description="Issued invoices, deposits, and balances across every CCH deal."
        actions={
          <Link
            href="/admin/invoices/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-cch-red px-4 py-2 text-[12.5px] font-semibold text-white shadow-[0_8px_18px_rgba(230,57,70,0.25)] transition-colors hover:bg-cch-red-hover"
          >
            <Plus className="size-4" aria-hidden="true" />
            New invoice
          </Link>
        }
      />

      <div className="flex-1 px-6 py-6">
        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <TotalCard
            label="Outstanding"
            value={formatUsd(totals.outstandingUsd)}
            hint="Sent + overdue balances"
            tone="warn"
          />
          <TotalCard
            label="Overdue"
            value={formatUsd(totals.overdueUsd)}
            hint="Past due, awaiting payment"
            tone="alert"
          />
          <TotalCard
            label="Paid this period"
            value={formatUsd(totals.paidUsd)}
            hint="Cleared invoices"
            tone="good"
          />
        </section>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-[13px] text-text-secondary">
              <span className="font-semibold text-corporate-black tabular-nums">
                {invoices.length}
              </span>
              <span className="text-text-tertiary">
                {" "}
                {invoices.length === 1 ? "invoice" : "invoices"}
              </span>
            </p>
            {hasFilters ? (
              <span className="inline-flex items-center rounded-full bg-cch-red-soft px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-cch-red">
                Filtered
              </span>
            ) : null}
          </div>
        </div>

        <nav
          aria-label="Filter by status"
          className="mb-4 flex flex-wrap items-center gap-2"
        >
          {FILTER_VALUES.map((value) => {
            const count = counts[value];
            const isActive = activeFilter === value;
            const label =
              value === "all" ? "All" : INVOICE_STATUS_LABEL[value];
            return (
              <Link
                key={value}
                href={statusHref(value, q)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                  isActive
                    ? "border-cch-red bg-cch-red text-white shadow-[0_6px_14px_rgba(230,57,70,0.28)]"
                    : "border-hairline bg-white text-corporate-black hover:border-corporate-black/30",
                )}
              >
                <span>{label}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-px text-[10.5px] tabular-nums",
                    isActive
                      ? "bg-white/20"
                      : "bg-corporate-black/5 text-corporate-black/70",
                  )}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </nav>

        {invoices.length === 0 ? (
          <div className="rounded-xl border border-dashed border-hairline bg-white px-8 py-16 text-center">
            <p className="text-[15px] font-medium text-corporate-black">
              No invoices match those filters.
            </p>
            <p className="mt-2 text-[13px] text-text-secondary">
              Clear the filter set or issue a new invoice to start the queue.
            </p>
          </div>
        ) : (
          <InvoicesTable invoices={invoices} />
        )}
      </div>
    </>
  );
}

function TotalCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "warn" | "alert" | "good";
}) {
  const toneClass = {
    warn: "border-amber-200 bg-amber-50/60",
    alert: "border-cch-red/30 bg-cch-red-soft/60",
    good: "border-emerald-200 bg-emerald-50/60",
  }[tone];
  const valueColor = {
    warn: "text-amber-900",
    alert: "text-cch-red",
    good: "text-emerald-700",
  }[tone];

  return (
    <div className={cn("rounded-xl border p-5 shadow-card", toneClass)}>
      <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-display text-[24px] font-semibold leading-none tabular-nums",
          valueColor,
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-[12px] text-text-secondary">{hint}</p>
    </div>
  );
}
