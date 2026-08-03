"use client";

import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Download,
  Loader2,
  Minus,
  Square,
  CheckSquare,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import { deleteLeads, type LeadRef } from "@/app/admin/all-leads/actions";
import {
  LEAD_STATUS_LABEL,
  formatDate,
  formatDateTime,
} from "@/lib/admin/format";
import { leadsCsvFilename, leadsToCsv } from "@/lib/admin/leads-csv";
import {
  LEAD_ROUTE_LABEL,
  type LeadRoute,
  type LeadStatus,
  type UnifiedLead,
} from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type Props = {
  leads: UnifiedLead[];
};

type SortKey = "name" | "email" | "route" | "status" | "createdAt";
type SortDir = "asc" | "desc";

const COLUMN_TEMPLATE =
  "grid-cols-[36px_28px_minmax(160px,1fr)_minmax(200px,1.2fr)_130px_minmax(160px,1fr)_120px_110px_72px]";

const STATUS_DOT: Record<LeadStatus, string> = {
  new: "bg-cch-red",
  contacted: "bg-amber-500",
  quoted: "bg-sky-500",
  negotiating: "bg-indigo-500",
  reserved: "bg-corporate-black",
  closed_won: "bg-emerald-500",
  closed_lost: "bg-corporate-black/30",
};

const ROUTE_TONE: Record<LeadRoute, string> = {
  car_request: "bg-cch-red-soft text-cch-red",
  lead_magnet: "bg-corporate-black/5 text-corporate-black/75",
};

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

function downloadCsv(rows: UnifiedLead[]) {
  const blob = new Blob([leadsToCsv(rows)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = leadsCsvFilename(new Date().toISOString());
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function SortHeader({
  label,
  sortKey,
  active,
  dir,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  active: boolean;
  dir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const Icon = !active ? ChevronsUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      aria-label={`Sort by ${label}`}
      className={cn(
        "-my-1 inline-flex items-center gap-1 rounded py-1 text-left transition-colors hover:text-corporate-black",
        active && "text-corporate-black",
        className,
      )}
    >
      {label}
      <Icon
        className={cn("size-3", active ? "opacity-100" : "opacity-40")}
        aria-hidden
      />
    </button>
  );
}

export function AllLeadsTable({ leads }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const sorted = useMemo(() => {
    const factor = sortDir === "asc" ? 1 : -1;
    return [...leads].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "email":
          cmp = (a.email ?? "").localeCompare(b.email ?? "");
          break;
        case "route":
          cmp = LEAD_ROUTE_LABEL[a.route].localeCompare(
            LEAD_ROUTE_LABEL[b.route],
          );
          break;
        case "status":
          cmp = (a.status ?? "").localeCompare(b.status ?? "");
          break;
        case "createdAt":
          cmp = a.createdAt.localeCompare(b.createdAt);
          break;
      }
      // Fall back to newest-first so equal keys keep a stable, useful order.
      if (cmp === 0) return b.createdAt.localeCompare(a.createdAt);
      return cmp * factor;
    });
  }, [leads, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      // Dates read best newest-first; text reads best A–Z.
      setSortDir(key === "createdAt" ? "desc" : "asc");
    }
  };

  const allSelected = leads.length > 0 && selected.size === leads.length;
  const headerState: "checked" | "indeterminate" | "unchecked" =
    selected.size === 0 ? "unchecked" : allSelected ? "checked" : "indeterminate";

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === leads.length ? new Set() : new Set(leads.map((l) => l.id)),
    );

  const selectedLeads = sorted.filter((lead) => selected.has(lead.id));

  const handleDelete = () => {
    setError(null);
    const refs: LeadRef[] = selectedLeads.map((lead) => ({
      id: lead.id,
      route: lead.route,
    }));
    startTransition(async () => {
      const result = await deleteLeads(refs);
      if (result.ok) {
        setSelected(new Set());
        setConfirmingDelete(false);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-text-secondary">
          <span className="font-semibold text-corporate-black tabular-nums">
            {leads.length}
          </span>{" "}
          <span className="text-text-tertiary">
            {leads.length === 1 ? "lead" : "leads"}
          </span>
        </p>
        <button
          type="button"
          onClick={() => downloadCsv(sorted)}
          disabled={leads.length === 0}
          className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white px-3.5 py-2 text-[12.5px] font-medium text-corporate-black transition-colors hover:bg-corporate-black hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-corporate-black"
        >
          <Download className="size-3.5" />
          Export all as CSV
        </button>
      </div>

      {/* Selection bar */}
      {selected.size > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cch-red/40 bg-cch-red-soft px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-cch-red">
              <span className="tabular-nums">{selected.size}</span>
              <span>selected</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setSelected(new Set());
                setConfirmingDelete(false);
              }}
              className="inline-flex items-center gap-1 text-[12px] font-medium text-cch-red/80 hover:text-cch-red"
            >
              <X className="size-3.5" />
              Clear
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadCsv(selectedLeads)}
              className="inline-flex items-center gap-1.5 rounded-full border border-cch-red/40 bg-white px-3 py-1 text-[12px] font-medium text-cch-red hover:bg-white/80"
            >
              <Download className="size-3.5" />
              Export selected
            </button>
            {confirmingDelete ? (
              <>
                <span className="text-[12px] font-medium text-cch-red">
                  Delete {selected.size} permanently?
                </span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={pending}
                  className="inline-flex items-center gap-1.5 rounded-full bg-cch-red px-3 py-1 text-[12px] font-medium text-white hover:bg-cch-red-hover disabled:opacity-60"
                >
                  {pending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                  Yes, delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="inline-flex items-center rounded-full border border-cch-red/40 bg-white px-3 py-1 text-[12px] font-medium text-cch-red hover:bg-white/80"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-cch-red/40 bg-white px-3 py-1 text-[12px] font-medium text-cch-red hover:bg-white/80"
              >
                <Trash2 className="size-3.5" />
                Delete
              </button>
            )}
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-lg bg-cch-red-soft px-4 py-2 text-[12.5px] text-cch-red">
          {error}
        </p>
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
          <SortHeader
            label="Name"
            sortKey="name"
            active={sortKey === "name"}
            dir={sortDir}
            onSort={toggleSort}
          />
          <SortHeader
            label="Email"
            sortKey="email"
            active={sortKey === "email"}
            dir={sortDir}
            onSort={toggleSort}
          />
          <SortHeader
            label="Route"
            sortKey="route"
            active={sortKey === "route"}
            dir={sortDir}
            onSort={toggleSort}
          />
          <span>Interest</span>
          <SortHeader
            label="Status"
            sortKey="status"
            active={sortKey === "status"}
            dir={sortDir}
            onSort={toggleSort}
          />
          <SortHeader
            label="Submitted"
            sortKey="createdAt"
            active={sortKey === "createdAt"}
            dir={sortDir}
            onSort={toggleSort}
            className="justify-end"
          />
          <span className="text-right">Actions</span>
        </div>

        {sorted.length === 0 ? (
          <p className="px-4 py-10 text-center text-[13px] text-text-tertiary">
            No leads yet. Car requests and guide downloads both land here.
          </p>
        ) : null}

        <ul className="divide-y divide-hairline">
          {sorted.map((lead, idx) => {
            const isSelected = selected.has(lead.id);
            return (
              <li key={`${lead.route}-${lead.id}`}>
                <div
                  className={cn(
                    "group items-center gap-3 px-4 py-3 transition-colors md:grid",
                    COLUMN_TEMPLATE,
                    "flex flex-wrap",
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
                    <CheckboxIcon state={isSelected ? "checked" : "unchecked"} />
                  </button>

                  <div className="min-w-0">
                    {lead.href ? (
                      <Link
                        href={lead.href}
                        className="truncate text-[14px] font-medium text-corporate-black hover:text-cch-red"
                      >
                        {lead.name}
                      </Link>
                    ) : (
                      <p className="truncate text-[14px] font-medium text-corporate-black">
                        {lead.name}
                      </p>
                    )}
                    {lead.whatsapp ? (
                      <p className="mt-0.5 truncate text-[12px] text-text-secondary">
                        {lead.whatsapp}
                      </p>
                    ) : null}
                  </div>

                  <p className="min-w-0 truncate text-[13px] text-text-secondary">
                    {lead.email ?? "—"}
                  </p>

                  <span
                    className={cn(
                      "inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                      ROUTE_TONE[lead.route],
                    )}
                  >
                    {LEAD_ROUTE_LABEL[lead.route]}
                  </span>

                  <p className="hidden min-w-0 truncate text-[12.5px] text-text-secondary md:block">
                    {lead.detail ?? "—"}
                  </p>

                  <span className="hidden items-center gap-2 text-[12.5px] font-medium text-corporate-black md:inline-flex">
                    {lead.status ? (
                      <>
                        <span
                          aria-hidden
                          className={cn(
                            "size-1.5 shrink-0 rounded-full",
                            STATUS_DOT[lead.status],
                          )}
                        />
                        {LEAD_STATUS_LABEL[lead.status]}
                      </>
                    ) : (
                      <span className="text-text-tertiary">—</span>
                    )}
                  </span>

                  <span
                    title={formatDateTime(lead.createdAt)}
                    className="hidden text-right text-[11.5px] tabular-nums text-text-tertiary md:inline-block"
                  >
                    {formatDate(lead.createdAt)}
                  </span>

                  <div className="hidden items-center justify-end md:flex">
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(new Set([lead.id]));
                        setConfirmingDelete(true);
                      }}
                      aria-label={`Delete ${lead.name}`}
                      className="grid size-7 place-items-center rounded-full text-text-tertiary opacity-70 transition-all hover:bg-cch-red-soft hover:text-cch-red group-hover:opacity-100"
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
