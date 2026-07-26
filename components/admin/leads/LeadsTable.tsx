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
  LEAD_STATUS_LABEL,
  formatBudgetShort,
  formatDate,
  formatDateTime,
} from "@/lib/admin/format";
import type { Lead, LeadStatus } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type LeadsTableProps = {
  leads: Lead[];
};

const STATUS_DOT: Record<LeadStatus, string> = {
  new: "bg-cch-red",
  contacted: "bg-amber-500",
  quoted: "bg-sky-500",
  negotiating: "bg-indigo-500",
  reserved: "bg-corporate-black",
  closed_won: "bg-emerald-500",
  closed_lost: "bg-corporate-black/30",
};

const COLUMN_TEMPLATE =
  "grid-cols-[36px_28px_minmax(200px,1fr)_160px_130px_110px_140px_96px_84px]";

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

export function LeadsTable({ leads }: LeadsTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allIds = useMemo(() => leads.map((l) => l.id), [leads]);
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
              Mark as contacted
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-full border border-cch-red/40 bg-white px-3 py-1 text-[12px] font-medium text-cch-red hover:bg-white/80"
            >
              Assign
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
            "hidden gap-3 border-b border-hairline bg-surface-tint px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-[0.14em] text-text-tertiary md:grid",
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
          <span>Client</span>
          <span>Wants</span>
          <span>Destination</span>
          <span className="text-right">Budget</span>
          <span className="md:pl-4">Status</span>
          <span className="text-right">Submitted</span>
          <span className="text-right">Actions</span>
        </div>

        <ul className="divide-y divide-hairline">
          {leads.map((lead, idx) => {
            const isSelected = selected.has(lead.id);
            return (
              <li key={lead.id}>
                <div
                  className={cn(
                    "group items-center gap-3 px-4 py-3 transition-colors md:grid",
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
                    onClick={() => toggleOne(lead.id)}
                    aria-label={isSelected ? "Deselect" : "Select"}
                    className="hidden size-6 place-items-center rounded hover:bg-corporate-black/5 md:grid"
                  >
                    <CheckboxIcon
                      state={isSelected ? "checked" : "unchecked"}
                    />
                  </button>

                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <span
                      aria-hidden
                      className="relative grid size-9 shrink-0 place-items-center rounded-full bg-corporate-black/5 text-[11.5px] font-semibold uppercase tracking-wide text-corporate-black/75"
                    >
                      {getInitials(lead.name)}
                      {lead.status === "new" ? (
                        <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-cch-red ring-2 ring-white" />
                      ) : null}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-corporate-black">
                        {lead.name}
                      </p>
                      <p className="mt-0.5 truncate text-[12px] text-text-secondary">
                        {lead.whatsapp}
                      </p>
                    </div>
                  </Link>

                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="hidden min-w-0 md:block"
                  >
                    <p className="truncate text-[13px] font-medium text-corporate-black">
                      {lead.carCode ??
                        (lead.preferredBrand
                          ? `${lead.preferredBrand}${lead.preferredModel ? ` ${lead.preferredModel}` : ""}`
                          : "Browsing")}
                    </p>
                  </Link>

                  <div className="hidden min-w-0 md:block">
                    <p className="truncate text-[13px] text-corporate-black">
                      {lead.destinationCity ?? lead.destinationCountry ?? "—"}
                    </p>
                    {lead.destinationCity && lead.destinationCountry ? (
                      <p className="mt-0.5 truncate text-[12px] text-text-secondary">
                        {lead.destinationCountry}
                      </p>
                    ) : null}
                  </div>

                  <span className="hidden text-right text-[13.5px] font-medium tabular-nums text-corporate-black md:inline-block">
                    {formatBudgetShort(lead.budgetMinUsd, lead.budgetMaxUsd)}
                  </span>

                  <span className="hidden items-center gap-2 text-[12.5px] font-medium text-corporate-black md:inline-flex md:pl-4">
                    <span
                      aria-hidden
                      className={cn(
                        "size-1.5 shrink-0 rounded-full",
                        STATUS_DOT[lead.status],
                      )}
                    />
                    {LEAD_STATUS_LABEL[lead.status]}
                  </span>

                  <span
                    title={formatDateTime(lead.createdAt)}
                    className="hidden text-right text-[11.5px] tabular-nums text-text-tertiary md:inline-block"
                  >
                    {formatDate(lead.createdAt)}
                  </span>

                  <div className="hidden items-center justify-end gap-1 md:flex">
                    <Link
                      href={`/admin/quotes/new?lead=${lead.id}`}
                      aria-label="Send quote"
                      title="Send quote"
                      className="grid size-7 place-items-center rounded-full text-text-tertiary opacity-70 transition-all hover:bg-corporate-black hover:text-white group-hover:opacity-100"
                    >
                      <Send className="size-3.5" />
                    </Link>
                    <button
                      type="button"
                      aria-label="Delete request"
                      title="Delete request"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete request from ${lead.name}? This can't be undone.`,
                          )
                        ) {
                          // Wire to server action when Supabase is connected.
                          console.log("delete lead", lead.id);
                        }
                      }}
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
