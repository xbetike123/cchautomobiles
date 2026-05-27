"use client";

import {
  CheckSquare,
  ChevronDown,
  Minus,
  Pencil,
  Square,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  INVENTORY_STATUS_LABEL,
  formatRelativeTime,
  formatUsd,
} from "@/lib/admin/format";
import type { Inventory, InventoryStatus } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<InventoryStatus, string> = {
  coming_soon: "bg-corporate-black/4 text-text-secondary",
  on_the_lot: "bg-cch-red-soft text-cch-red",
  reserved: "bg-corporate-black text-white",
  in_shipping: "bg-corporate-black/8 text-corporate-black",
  delivered: "bg-emerald-100 text-emerald-700",
  sold: "bg-corporate-black/4 text-text-tertiary",
  archived: "bg-corporate-black/4 text-text-tertiary",
};

const STATUS_VALUES: readonly InventoryStatus[] = [
  "coming_soon",
  "on_the_lot",
  "reserved",
  "in_shipping",
  "delivered",
  "sold",
  "archived",
];

const COLUMN_TEMPLATE =
  "grid-cols-[32px_64px_minmax(220px,1fr)_120px_84px_110px_140px_96px_84px]";

const numberFormatter = new Intl.NumberFormat("en-US");

function formatMileage(km: number | null): string {
  if (km == null) return "—";
  if (km >= 1000) return `${(km / 1000).toFixed(km % 1000 === 0 ? 0 : 1)}k km`;
  return `${km} km`;
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
  items: Inventory[];
  now: string;
};

export function InventoryTable({ items, now }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allIds = useMemo(() => items.map((i) => i.id), [items]);
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

  const handleStatusUpdate = (status: InventoryStatus) => {
    // Wire to a server action when the admin write layer is built.
    console.log("bulk update status", { status, ids: Array.from(selected) });
    clearSelection();
  };

  const handleDelete = () => {
    if (
      !window.confirm(
        `Delete ${selected.size} vehicle${selected.size === 1 ? "" : "s"}? This can't be undone.`,
      )
    ) {
      return;
    }
    // Wire to a server action when the admin write layer is built.
    console.log("bulk delete", { ids: Array.from(selected) });
    clearSelection();
  };

  const handleRowDelete = (item: Inventory) => {
    if (
      !window.confirm(
        `Delete ${item.brand} ${item.model} (${item.carCode})? This can't be undone.`,
      )
    ) {
      return;
    }
    // Wire to a server action when the admin write layer is built.
    console.log("delete inventory", item.id);
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
            <div className="relative inline-flex h-8 items-center gap-1.5 rounded-full border border-cch-red/40 bg-white px-3 text-[12px] font-medium text-cch-red shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-colors hover:bg-white/80">
              <span>Set status</span>
              <ChevronDown className="size-3.5" aria-hidden="true" />
              <select
                aria-label="Set status for selected vehicles"
                defaultValue=""
                onChange={(event) => {
                  const next = event.target.value;
                  if (!next) return;
                  handleStatusUpdate(next as InventoryStatus);
                  event.target.value = "";
                }}
                className="absolute inset-0 cursor-pointer appearance-none rounded-full bg-transparent opacity-0"
              >
                <option value="" disabled>
                  Set status
                </option>
                {STATUS_VALUES.map((status) => (
                  <option key={status} value={status}>
                    {INVENTORY_STATUS_LABEL[status]}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 rounded-full bg-cch-red px-3 py-1.5 text-[12px] font-semibold text-white shadow-[0_6px_14px_rgba(230,57,70,0.25)] hover:bg-cch-red-hover"
            >
              <Trash2 className="size-3.5" />
              Delete selected
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
          <span aria-hidden />
          <span>Vehicle</span>
          <span>Code</span>
          <span>Year</span>
          <span className="text-right">Price</span>
          <span>Status</span>
          <span className="text-right">Added</span>
          <span className="text-right">Actions</span>
        </div>

        <ul className="divide-y divide-hairline">
          {items.map((item) => {
            const isSelected = selected.has(item.id);
            const factsParts: string[] = [];
            if (item.bodyType) factsParts.push(item.bodyType);
            if (item.condition === "used") {
              factsParts.push(formatMileage(item.mileageKm));
              if (item.batteryHealthPct != null) {
                factsParts.push(`${item.batteryHealthPct}% battery`);
              }
            } else if (item.rangeKm != null) {
              factsParts.push(
                `${numberFormatter.format(item.rangeKm)} km range`,
              );
            }
            const facts = factsParts.join(" · ");

            return (
              <li key={item.id}>
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
                    onClick={() => toggleOne(item.id)}
                    aria-label={isSelected ? "Deselect" : "Select"}
                    className="grid size-6 place-items-center rounded hover:bg-corporate-black/5"
                  >
                    <CheckboxIcon
                      state={isSelected ? "checked" : "unchecked"}
                    />
                  </button>

                  <Link
                    href={`/admin/inventory/${item.carCode}`}
                    aria-label={`${item.brand} ${item.model}`}
                    className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-surface-warm"
                  >
                    {item.heroImageUrl ? (
                      <Image
                        src={item.heroImageUrl}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : null}
                  </Link>

                  <Link
                    href={`/admin/inventory/${item.carCode}`}
                    className="min-w-0 flex-1"
                  >
                    <p className="truncate text-[14px] font-medium text-corporate-black">
                      {item.brand} {item.model}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-text-secondary">
                      {facts || "—"}
                    </p>
                  </Link>

                  <span className="hidden text-[12px] font-medium tabular-nums text-text-secondary md:inline-block">
                    {item.carCode}
                  </span>

                  <span className="hidden text-[12.5px] tabular-nums text-corporate-black md:inline-block">
                    {item.year}
                  </span>

                  <span className="hidden text-right text-[13.5px] font-medium tabular-nums text-corporate-black md:inline-block">
                    {formatUsd(item.priceUsdFob)}
                  </span>

                  <span className="hidden md:inline-flex">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        STATUS_TONE[item.status],
                      )}
                    >
                      {INVENTORY_STATUS_LABEL[item.status]}
                    </span>
                  </span>

                  <span className="hidden text-right text-[11.5px] tabular-nums text-text-tertiary md:inline-block">
                    {item.weekAdded
                      ? formatRelativeTime(`${item.weekAdded}T00:00:00Z`, now)
                      : "—"}
                  </span>

                  <div className="hidden items-center justify-end gap-1 md:flex">
                    <Link
                      href={`/admin/inventory/${item.carCode}/edit`}
                      aria-label="Edit vehicle"
                      title="Edit vehicle"
                      className="grid size-7 place-items-center rounded-full text-text-tertiary opacity-70 transition-all hover:bg-corporate-black hover:text-white group-hover:opacity-100"
                    >
                      <Pencil className="size-3.5" />
                    </Link>
                    <button
                      type="button"
                      aria-label="Delete vehicle"
                      title="Delete vehicle"
                      onClick={() => handleRowDelete(item)}
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
