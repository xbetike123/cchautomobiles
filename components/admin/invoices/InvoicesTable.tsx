"use client";

import {
  CheckSquare,
  Download,
  Minus,
  Send,
  Square,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  INVOICE_KIND_LABEL,
  INVOICE_STATUS_LABEL,
  formatUsd,
} from "@/lib/admin/format";
import type { Invoice, InvoiceKind, InvoiceStatus } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<InvoiceStatus, string> = {
  draft: "bg-corporate-black/5 text-text-secondary",
  sent: "bg-sky-100 text-sky-700",
  paid: "bg-emerald-100 text-emerald-700",
  overdue: "bg-cch-red-soft text-cch-red",
  refunded: "bg-corporate-black/8 text-corporate-black",
  void: "bg-corporate-black/5 text-text-tertiary",
};

const KIND_TONE: Record<InvoiceKind, string> = {
  deposit: "bg-sky-50 text-sky-700 border-sky-200",
  balance: "bg-cch-red-soft text-cch-red border-cch-red/30",
  single: "bg-corporate-black/5 text-corporate-black border-hairline",
};

const COLUMN_TEMPLATE =
  "grid-cols-[32px_minmax(150px,1fr)_minmax(180px,1.2fr)_minmax(220px,1.4fr)_110px_120px_130px_120px_84px]";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string | null): string {
  if (!value) return "—";
  return dateFormatter.format(new Date(value));
}

function CheckboxIcon({
  state,
}: {
  state: "checked" | "indeterminate" | "unchecked";
}) {
  if (state === "checked") {
    return <CheckSquare aria-hidden className="size-4 text-cch-red" />;
  }
  if (state === "indeterminate") {
    return (
      <span
        aria-hidden
        className="grid size-4 place-items-center rounded-sm bg-cch-red text-white"
      >
        <Minus className="size-3" />
      </span>
    );
  }
  return <Square aria-hidden className="size-4 text-corporate-black/35" />;
}

type Props = {
  invoices: Invoice[];
};

export function InvoicesTable({ invoices }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allIds = useMemo(() => invoices.map((i) => i.id), [invoices]);
  const allSelected = allIds.length > 0 && selected.size === allIds.length;
  const headerState: "checked" | "indeterminate" | "unchecked" =
    selected.size === 0
      ? "unchecked"
      : allSelected
        ? "checked"
        : "indeterminate";

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === allIds.length ? new Set() : new Set(allIds),
    );
  };

  const clearSelection = () => setSelected(new Set());

  const handleMarkPaid = () => {
    // Wire to a server action when the billing write layer is built.
    console.log("bulk mark paid", { ids: Array.from(selected) });
    clearSelection();
  };

  const handleSendReminder = () => {
    console.log("bulk send reminder", { ids: Array.from(selected) });
    clearSelection();
  };

  const handleDelete = () => {
    if (
      !window.confirm(
        `Delete ${selected.size} invoice${selected.size === 1 ? "" : "s"}? This can't be undone.`,
      )
    ) {
      return;
    }
    console.log("bulk delete invoices", { ids: Array.from(selected) });
    clearSelection();
  };

  const handleRowDelete = (invoice: Invoice) => {
    if (
      !window.confirm(
        `Delete ${invoice.invoiceNumber} (${invoice.clientName})? This can't be undone.`,
      )
    ) {
      return;
    }
    console.log("delete invoice", invoice.id);
  };

  return (
    <div className="space-y-3">
      {selected.size > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cch-red/40 bg-cch-red-soft px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-cch-red">
              <span className="tabular-nums">{selected.size}</span>
              <span>selected</span>
            </span>
            <button
              type="button"
              onClick={clearSelection}
              className="inline-flex items-center gap-1 text-[12px] font-medium text-cch-red/80 hover:text-cch-red"
            >
              <X className="size-3.5" />
              Clear
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleMarkPaid}
              className="inline-flex items-center rounded-full border border-cch-red/40 bg-white px-3 py-1 text-[12px] font-medium text-cch-red hover:bg-white/80"
            >
              Mark as paid
            </button>
            <button
              type="button"
              onClick={handleSendReminder}
              className="inline-flex items-center gap-1.5 rounded-full border border-cch-red/40 bg-white px-3 py-1 text-[12px] font-medium text-cch-red hover:bg-white/80"
            >
              <Send className="size-3.5" />
              Send reminder
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 rounded-full bg-cch-red px-3 py-1 text-[12px] font-medium text-white shadow-[0_6px_14px_rgba(230,57,70,0.25)] hover:bg-cch-red-hover"
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>
          </div>
        </div>
      ) : null}

      <section className="overflow-hidden rounded-xl border border-hairline bg-white shadow-card">
        <div
          className={cn(
            "hidden gap-3 border-b border-hairline bg-surface-tint px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-[0.14em] text-text-tertiary md:grid",
            COLUMN_TEMPLATE,
          )}
        >
          <button
            type="button"
            onClick={toggleAll}
            aria-label={allSelected ? "Deselect all" : "Select all"}
            className="-my-1 -ml-1 grid size-6 place-items-center rounded hover:bg-corporate-black/5"
          >
            <CheckboxIcon state={headerState} />
          </button>
          <span>Invoice</span>
          <span>Client</span>
          <span>Vehicle</span>
          <span>Kind</span>
          <span className="text-right">Amount</span>
          <span>Status</span>
          <span>Due</span>
          <span className="text-right">Actions</span>
        </div>

        <ul className="divide-y divide-hairline">
          {invoices.map((invoice) => {
            const isSelected = selected.has(invoice.id);
            const dueLabel = invoice.dueAt ? formatDate(invoice.dueAt) : "—";
            return (
              <li key={invoice.id}>
                <div
                  className={cn(
                    "group items-center gap-3 px-4 py-3 transition-colors md:grid",
                    COLUMN_TEMPLATE,
                    "flex",
                    isSelected ? "bg-cch-red-soft/40" : "hover:bg-surface-tint",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleOne(invoice.id)}
                    aria-label={isSelected ? "Deselect" : "Select"}
                    className="grid size-6 place-items-center rounded hover:bg-corporate-black/5"
                  >
                    <CheckboxIcon
                      state={isSelected ? "checked" : "unchecked"}
                    />
                  </button>

                  <Link
                    href={`/admin/invoices/${invoice.invoiceNumber}`}
                    className="min-w-0"
                  >
                    <p className="truncate text-[13.5px] font-semibold tabular-nums text-corporate-black">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="mt-0.5 truncate text-[11.5px] text-text-tertiary">
                      {formatDate(invoice.issuedAt)}
                    </p>
                  </Link>

                  <Link
                    href={`/admin/invoices/${invoice.invoiceNumber}`}
                    className="hidden min-w-0 md:block"
                  >
                    <p className="truncate text-[13.5px] font-medium text-corporate-black">
                      {invoice.clientName}
                    </p>
                    {invoice.clientEmail ? (
                      <p className="mt-0.5 truncate text-[12px] text-text-secondary">
                        {invoice.clientEmail}
                      </p>
                    ) : null}
                  </Link>

                  <div className="hidden min-w-0 md:block">
                    <p className="truncate text-[13px] text-corporate-black">
                      {invoice.carDescription ?? "—"}
                    </p>
                    {invoice.carCode ? (
                      <p className="mt-0.5 truncate text-[11.5px] text-text-tertiary">
                        {invoice.carCode}
                      </p>
                    ) : null}
                  </div>

                  <span className="hidden md:inline-flex">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em]",
                        KIND_TONE[invoice.kind],
                      )}
                    >
                      {INVOICE_KIND_LABEL[invoice.kind]}
                    </span>
                  </span>

                  <span className="hidden text-right text-[13.5px] font-medium tabular-nums text-corporate-black md:inline-block">
                    {formatUsd(invoice.amountUsd)}
                  </span>

                  <span className="hidden md:inline-flex">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        STATUS_TONE[invoice.status],
                      )}
                    >
                      {INVOICE_STATUS_LABEL[invoice.status]}
                    </span>
                  </span>

                  <span className="hidden text-[11.5px] tabular-nums text-text-tertiary md:inline-block">
                    {dueLabel}
                  </span>

                  <div className="hidden items-center justify-end gap-1 md:flex">
                    <Link
                      href={`/admin/invoices/${invoice.invoiceNumber}`}
                      aria-label="View invoice"
                      title="View invoice"
                      className="grid size-7 place-items-center rounded-full text-text-tertiary opacity-70 transition-all hover:bg-corporate-black hover:text-white group-hover:opacity-100"
                    >
                      <Send className="size-3.5" />
                    </Link>
                    <button
                      type="button"
                      aria-label="Download PDF"
                      title="Download PDF"
                      onClick={() =>
                        console.log("download invoice", invoice.id)
                      }
                      className="grid size-7 place-items-center rounded-full text-text-tertiary opacity-70 transition-all hover:bg-corporate-black hover:text-white group-hover:opacity-100"
                    >
                      <Download className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete invoice"
                      title="Delete invoice"
                      onClick={() => handleRowDelete(invoice)}
                      className="grid size-7 place-items-center rounded-full text-text-tertiary opacity-70 transition-all hover:bg-cch-red hover:text-white group-hover:opacity-100"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
