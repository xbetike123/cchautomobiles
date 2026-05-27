import { Plus } from "lucide-react";
import Link from "next/link";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { InventoryTable } from "@/components/admin/inventory/InventoryTable";
import {
  getInventory,
  getInventoryStatusCounts,
  isInventoryStatus,
} from "@/lib/admin/queries/inventory";

const NOW_REFERENCE = "2026-05-16T12:00:00Z";

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

export default async function AdminInventoryPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const statusRaw = asString(raw.status);
  const status = statusRaw && isInventoryStatus(statusRaw) ? statusRaw : undefined;
  const conditionRaw = asString(raw.condition);
  const condition =
    conditionRaw === "new" || conditionRaw === "used"
      ? conditionRaw
      : undefined;
  const q = asString(raw.q);

  const [items, counts] = await Promise.all([
    getInventory({ status, condition, q }),
    getInventoryStatusCounts(),
  ]);

  const hasFilters = Boolean(status || condition || q);

  return (
    <>
      <AdminHeader
        eyebrow="Stock"
        title="Inventory"
        description="Every car on the CCH lot, in shipping, and recently delivered."
        actions={
          <Link
            href="/admin/inventory/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-cch-red px-4 py-2 text-[12.5px] font-semibold text-white shadow-[0_8px_18px_rgba(230,57,70,0.25)] transition-colors hover:bg-cch-red-hover"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add Car
          </Link>
        }
      />
      <div className="flex-1 px-6 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-[13px] text-text-secondary">
              <span className="font-semibold text-corporate-black tabular-nums">
                {items.length}
              </span>
              <span className="text-text-tertiary">
                {" "}
                {items.length === 1 ? "vehicle" : "vehicles"}
              </span>
            </p>
            {hasFilters ? (
              <span className="inline-flex items-center rounded-full bg-cch-red-soft px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-cch-red">
                Filtered
              </span>
            ) : null}
            <span className="text-[12px] text-text-tertiary">
              · On the lot:{" "}
              <span className="font-medium text-corporate-black tabular-nums">
                {counts.on_the_lot}
              </span>
              {" · Reserved: "}
              <span className="font-medium text-corporate-black tabular-nums">
                {counts.reserved}
              </span>
              {" · In shipping: "}
              <span className="font-medium text-corporate-black tabular-nums">
                {counts.in_shipping}
              </span>
            </span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-hairline bg-white px-8 py-16 text-center">
            <p className="text-[15px] font-medium text-corporate-black">
              No vehicles match those filters.
            </p>
            <p className="mt-2 text-[13px] text-text-secondary">
              Adjust the filter set or clear it to see the full lot.
            </p>
          </div>
        ) : (
          <InventoryTable items={items} now={NOW_REFERENCE} />
        )}
      </div>
    </>
  );
}
