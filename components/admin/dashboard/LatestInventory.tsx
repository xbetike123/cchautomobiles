import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  INVENTORY_STATUS_LABEL,
  formatRelativeTime,
  formatUsd,
} from "@/lib/admin/format";
import type { Inventory, InventoryStatus } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type LatestInventoryProps = {
  inventory: Inventory[];
  totalCount: number;
  now: string;
};

const STATUS_TONE: Record<InventoryStatus, string> = {
  coming_soon: "bg-corporate-black/4 text-text-secondary",
  on_the_lot: "bg-cch-red-soft text-cch-red",
  reserved: "bg-corporate-black text-white",
  in_shipping: "bg-corporate-black/8 text-corporate-black",
  delivered: "bg-emerald-100 text-emerald-700",
  sold: "bg-corporate-black/4 text-text-tertiary",
  archived: "bg-corporate-black/4 text-text-tertiary",
};

const COLUMN_TEMPLATE =
  "grid-cols-[64px_minmax(0,1fr)_100px_110px_64px]";

export function LatestInventory({
  inventory,
  totalCount,
  now,
}: LatestInventoryProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-hairline bg-white">
      <header className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-4">
        <div className="flex items-center gap-2.5">
          <h2 className="font-display text-[15px] font-semibold tracking-tight text-corporate-black">
            Latest Inventory
          </h2>
          <span className="inline-flex items-center rounded-full bg-corporate-black/5 px-2 py-0.5 text-[11px] font-medium tabular-nums text-corporate-black/70">
            {inventory.length}
          </span>
        </div>
        <span className="hidden text-[10.5px] font-medium uppercase tracking-[0.16em] text-text-tertiary sm:inline-block">
          New arrivals
        </span>
      </header>

      <div
        className={cn(
          "hidden gap-4 border-b border-hairline bg-surface-tint px-5 py-2 text-[10.5px] font-medium uppercase tracking-[0.14em] text-text-tertiary md:grid",
          COLUMN_TEMPLATE,
        )}
      >
        <span aria-hidden />
        <span>Vehicle</span>
        <span className="text-right">Price</span>
        <span>Status</span>
        <span className="text-right">Added</span>
      </div>

      <ul className="flex-1 divide-y divide-hairline">
        {inventory.map((item) => (
          <li key={item.id}>
            <Link
              href={`/admin/inventory/${item.carCode}`}
              className={cn(
                "items-center gap-4 px-5 py-3 transition-colors hover:bg-surface-tint md:grid",
                COLUMN_TEMPLATE,
                "flex",
              )}
            >
              <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-surface-warm">
                {item.heroImageUrl ? (
                  <Image
                    src={item.heroImageUrl}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : null}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium text-corporate-black">
                  {item.year} {item.brand} {item.model}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-text-secondary">
                  <span className="font-medium text-corporate-black/75">
                    {item.carCode}
                  </span>
                  {" · "}
                  {item.condition === "new" ? "New" : "Used"}
                  {item.bodyType ? ` · ${item.bodyType}` : ""}
                </p>
              </div>
              <span className="hidden text-right text-[14px] font-medium tabular-nums text-corporate-black md:inline-block">
                {formatUsd(item.priceUsdFob)}
              </span>
              <span
                className={cn(
                  "hidden w-fit shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide md:inline-flex",
                  STATUS_TONE[item.status],
                )}
              >
                {INVENTORY_STATUS_LABEL[item.status]}
              </span>
              <span className="hidden text-right text-[11.5px] tabular-nums text-text-tertiary md:inline-block">
                {formatRelativeTime(item.createdAt, now)}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/admin/inventory"
        className="flex items-center justify-between border-t border-hairline px-5 py-3 text-[12.5px] font-medium text-cch-red transition-colors hover:bg-surface-tint hover:text-cch-red-hover"
      >
        <span>View all Inventory</span>
        <span className="flex items-center gap-1.5">
          <span className="tabular-nums text-text-tertiary">{totalCount}</span>
          <ArrowRight className="size-3.5" />
        </span>
      </Link>
    </section>
  );
}
