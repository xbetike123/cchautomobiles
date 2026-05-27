"use client";

import {
  CheckSquare,
  Download,
  Eye,
  Minus,
  Send,
  Square,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  QUOTE_STATUS_LABEL,
  formatRelativeTime,
  formatUsd,
} from "@/lib/admin/format";
import type { QuoteWithClient } from "@/lib/admin/queries/quotes";
import type { QuoteStatus } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type QuotesTableProps = {
  quotes: QuoteWithClient[];
  now: string;
};

const STATUS_DOT: Record<QuoteStatus, string> = {
  draft: "bg-corporate-black/30",
  sent: "bg-amber-500",
  accepted: "bg-emerald-500",
  rejected: "bg-cch-red",
  expired: "bg-corporate-black/30",
  superseded: "bg-indigo-500",
};

const COLUMN_TEMPLATE =
  "grid-cols-[40px_32px_80px_minmax(220px,1.4fr)_minmax(160px,1fr)_110px_110px_92px]";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
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

export function QuotesTable({ quotes, now }: QuotesTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allIds = useMemo(() => quotes.map((q) => q.id), [quotes]);
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center rounded-full border border-cch-red/40 bg-white px-3 py-1 text-[12px] font-medium text-cch-red hover:bg-white/80"
            >
              Mark as expired
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-cch-red px-3 py-1 text-[12px] font-medium text-white shadow-[0_6px_14px_rgba(230,57,70,0.25)] hover:bg-cch-red-hover"
            >
              <Download className="size-3.5" />
              Export selected
            </button>
          </div>
        </div>
      ) : null}

      <section className="overflow-hidden rounded-xl border border-hairline bg-white shadow-card">
        <div
          className={cn(
            "hidden gap-4 border-b border-hairline bg-surface-tint px-5 py-2.5 text-[10.5px] font-medium uppercase tracking-[0.14em] text-text-tertiary md:grid",
            COLUMN_TEMPLATE,
          )}
        >
          <span className="text-right">SN</span>
          <button
            type="button"
            onClick={toggleAll}
            aria-label={allSelected ? "Deselect all" : "Select all"}
            className="-my-1 -ml-1 grid size-6 place-items-center rounded hover:bg-corporate-black/5"
          >
            <CheckboxIcon state={headerState} />
          </button>
          <span>Sent</span>
          <span>Vehicle</span>
          <span>Client</span>
          <span className="text-right">Total</span>
          <span className="md:pl-4">Status</span>
          <span className="text-right">Actions</span>
        </div>

        <ul className="divide-y divide-hairline">
          {quotes.map((quote, idx) => {
            const isSelected = selected.has(quote.id);
            const heroPhoto = quote.photoUrls[0];
            return (
              <li key={quote.id}>
                <div
                  className={cn(
                    "group items-center gap-4 px-5 py-3.5 transition-colors md:grid",
                    COLUMN_TEMPLATE,
                    "flex",
                    isSelected ? "bg-cch-red-soft/40" : "hover:bg-surface-tint",
                  )}
                >
                  <span className="hidden text-right text-[11.5px] tabular-nums text-text-tertiary md:inline-block">
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleOne(quote.id)}
                    aria-label={isSelected ? "Deselect" : "Select"}
                    className="hidden size-6 place-items-center rounded hover:bg-corporate-black/5 md:grid"
                  >
                    <CheckboxIcon
                      state={isSelected ? "checked" : "unchecked"}
                    />
                  </button>

                  <span className="hidden text-[12px] tabular-nums text-text-secondary md:inline-block">
                    {formatRelativeTime(quote.sentAt, now)}
                  </span>

                  <Link
                    href={`/admin/quotes/${quote.id}`}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-surface-warm">
                      {heroPhoto ? (
                        <Image
                          src={heroPhoto}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : null}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-corporate-black">
                        {quote.carName}
                      </p>
                      <p className="mt-0.5 truncate text-[12px] text-text-secondary">
                        <span className="font-medium text-corporate-black/75">
                          {quote.carCode}
                        </span>
                        {" · "}
                        {quote.carCondition === "new" ? "New" : "Used"}
                      </p>
                    </div>
                  </Link>

                  <Link
                    href={`/admin/leads/${quote.leadId}`}
                    className="hidden min-w-0 items-center gap-3 md:flex"
                  >
                    <span
                      aria-hidden
                      className="grid size-8 shrink-0 place-items-center rounded-full bg-corporate-black/5 text-[10.5px] font-semibold uppercase tracking-wide text-corporate-black/75"
                    >
                      {getInitials(quote.clientName)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-corporate-black">
                        {quote.clientName}
                      </p>
                      <p className="mt-0.5 truncate text-[11.5px] text-text-secondary">
                        {quote.destinationCity ?? quote.clientWhatsapp}
                      </p>
                    </div>
                  </Link>

                  <span className="hidden text-right text-[14px] font-semibold tabular-nums text-corporate-black md:inline-block">
                    {formatUsd(quote.totalUsd)}
                  </span>

                  <span className="hidden items-center gap-2 text-[12.5px] font-medium text-corporate-black md:inline-flex md:pl-4">
                    <span
                      aria-hidden
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        STATUS_DOT[quote.status],
                      )}
                    />
                    {QUOTE_STATUS_LABEL[quote.status]}
                  </span>

                  <div className="hidden items-center justify-end gap-1 md:flex">
                    <Link
                      href={`/admin/quotes/${quote.id}`}
                      aria-label="View PDF"
                      title="View PDF"
                      className="grid size-7 place-items-center rounded-full text-text-tertiary opacity-70 transition-all hover:bg-corporate-black/85 hover:text-white group-hover:opacity-100"
                    >
                      <Eye className="size-3.5" />
                    </Link>
                    <button
                      type="button"
                      aria-label="Resend quote"
                      title="Resend quote"
                      onClick={() => console.log("resend quote", quote.id)}
                      className="grid size-7 place-items-center rounded-full text-text-tertiary opacity-70 transition-all hover:bg-cch-red hover:text-white group-hover:opacity-100"
                    >
                      <Send className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete quote"
                      title="Delete quote"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete quote ${quote.carCode} for ${quote.clientName}? This can't be undone.`,
                          )
                        ) {
                          console.log("delete quote", quote.id);
                        }
                      }}
                      className="grid size-7 place-items-center rounded-full text-text-tertiary opacity-70 transition-all hover:bg-corporate-black hover:text-white group-hover:opacity-100"
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
