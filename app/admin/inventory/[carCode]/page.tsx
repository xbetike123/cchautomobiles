import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { InventoryRowActions } from "@/components/admin/inventory/InventoryRowActions";
import {
  INVENTORY_STATUS_LABEL,
  formatRelativeTime,
  formatUsd,
} from "@/lib/admin/format";
import { getInventoryByCarCode } from "@/lib/admin/queries/inventory";
import type { InventoryStatus } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<InventoryStatus, string> = {
  coming_soon: "bg-corporate-black/5 text-text-secondary",
  on_the_lot: "bg-cch-red-soft text-cch-red",
  reserved: "bg-corporate-black text-white",
  in_shipping: "bg-corporate-black/8 text-corporate-black",
  delivered: "bg-emerald-100 text-emerald-700",
  sold: "bg-corporate-black/5 text-text-tertiary",
  archived: "bg-corporate-black/5 text-text-tertiary",
};

const numberFormatter = new Intl.NumberFormat("en-US");

type PageProps = {
  params: Promise<{ carCode: string }>;
};

function formatMileage(km: number | null): string {
  if (km == null) return "—";
  return `${numberFormatter.format(km)} km`;
}

export default async function AdminInventoryDetailPage({ params }: PageProps) {
  const NOW_REFERENCE = new Date().toISOString();
  const { carCode } = await params;
  const decoded = decodeURIComponent(carCode);
  const car = await getInventoryByCarCode(decoded);
  if (!car) notFound();

  const title = `${car.brand} ${car.model}`;
  const subtitle = [
    car.year,
    car.bodyType,
    car.condition === "new" ? "New from factory" : "Used · first owner",
  ]
    .filter(Boolean)
    .join(" · ");

  const galleryUrls = [
    car.heroImageUrl,
    ...car.galleryImageUrls,
  ].filter((url): url is string => Boolean(url));

  return (
    <>
      <AdminHeader
        eyebrow={`Inventory · ${car.carCode}`}
        title={title}
        description={subtitle}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/inventory"
              className="hidden items-center gap-1.5 rounded-full border border-hairline bg-white px-3.5 py-2 text-[12.5px] font-medium text-corporate-black transition-colors hover:bg-corporate-black hover:text-white sm:inline-flex"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Back
            </Link>
            <InventoryRowActions carCode={car.carCode} label={title} />
          </div>
        }
      />

      <div className="flex-1 px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <section className="overflow-hidden rounded-xl border border-hairline bg-white shadow-card">
              <div className="relative aspect-[16/9] w-full bg-surface-warm">
                {car.heroImageUrl ? (
                  <Image
                    src={car.heroImageUrl}
                    alt={title}
                    fill
                    sizes="(min-width: 1024px) 800px, 100vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-[12px] uppercase tracking-[0.16em] text-text-tertiary">
                    No hero image yet
                  </div>
                )}
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-hairline bg-white shadow-card">
              <header className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[14px] font-semibold tracking-tight text-corporate-black">
                    Photo gallery
                  </h2>
                  <span className="inline-flex items-center rounded-full bg-corporate-black/5 px-2 py-0.5 text-[11px] font-medium tabular-nums text-corporate-black/70">
                    {galleryUrls.length}
                  </span>
                </div>
                <Link
                  href={`/admin/inventory/${car.carCode}/edit`}
                  className="text-[11.5px] font-medium text-text-tertiary hover:text-corporate-black"
                >
                  Manage images
                </Link>
              </header>
              {galleryUrls.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <p className="text-[14px] font-medium text-corporate-black">
                    No images uploaded yet.
                  </p>
                  <p className="mt-1 text-[12.5px] text-text-secondary">
                    Use Edit details on the right to upload the hero and
                    gallery shots.
                  </p>
                </div>
              ) : (
                <ul className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 md:grid-cols-4">
                  {galleryUrls.map((url, idx) => (
                    <li
                      key={`${url}-${idx}`}
                      className="group relative aspect-[4/3] overflow-hidden rounded-md border border-hairline bg-surface-tint"
                    >
                      <Image
                        src={url}
                        alt={`${title} photo ${idx + 1}`}
                        fill
                        sizes="(min-width: 768px) 200px, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                      {idx === 0 ? (
                        <span className="absolute left-2 top-2 inline-flex items-center rounded-full bg-cch-red px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-white">
                          Hero
                        </span>
                      ) : null}
                      <span className="absolute right-2 top-2 inline-flex items-center rounded-full bg-corporate-black/70 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-white">
                        {idx + 1}/{galleryUrls.length}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="overflow-hidden rounded-xl border border-hairline bg-white shadow-card">
              <header className="border-b border-hairline px-5 py-3">
                <h2 className="text-[14px] font-semibold tracking-tight text-corporate-black">
                  Specifications
                </h2>
              </header>
              <dl className="divide-y divide-hairline">
                <Row label="Brand" value={car.brand} />
                <Row label="Model" value={car.model} />
                <Row label="Year" value={String(car.year)} />
                <Row label="Body type" value={car.bodyType ?? "—"} />
                <Row
                  label="Condition"
                  value={
                    car.condition === "new"
                      ? "New from factory"
                      : "Used (first-owner)"
                  }
                />
                <Row
                  label="Range (claimed)"
                  value={
                    car.rangeKm != null
                      ? `${numberFormatter.format(car.rangeKm)} km`
                      : "—"
                  }
                />
                {car.condition === "used" ? (
                  <>
                    <Row label="Mileage" value={formatMileage(car.mileageKm)} />
                    <Row
                      label="Battery health"
                      value={
                        car.batteryHealthPct != null
                          ? `${car.batteryHealthPct}%`
                          : "—"
                      }
                    />
                    <Row
                      label="Prior owners"
                      value={String(car.ownerCount ?? 1)}
                    />
                  </>
                ) : (
                  <Row
                    label="Factory warranty"
                    value={
                      car.factoryWarrantyMonths != null
                        ? `${car.factoryWarrantyMonths} months`
                        : "—"
                    }
                  />
                )}
                <Row
                  label="Price (FOB Guangzhou)"
                  value={formatUsd(car.priceUsdFob)}
                />
              </dl>
            </section>

            <section className="overflow-hidden rounded-xl border border-hairline bg-white shadow-card">
              <header className="border-b border-hairline px-5 py-3">
                <h2 className="text-[14px] font-semibold tracking-tight text-corporate-black">
                  Internal notes
                </h2>
              </header>
              <div className="px-5 py-4 text-[13.5px] leading-[1.55] text-corporate-black">
                {car.internalNotes ? (
                  car.internalNotes
                ) : (
                  <span className="text-text-tertiary">
                    No internal notes yet. Use Edit to add inspection or
                    sourcing details.
                  </span>
                )}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-4 lg:col-span-4 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-hairline bg-white p-5 shadow-card">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                Status
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11.5px] font-medium",
                    STATUS_TONE[car.status],
                  )}
                >
                  {INVENTORY_STATUS_LABEL[car.status]}
                </span>
                <span className="text-[12px] text-text-tertiary">
                  {car.weekAdded
                    ? `Added ${formatRelativeTime(`${car.weekAdded}T00:00:00Z`, NOW_REFERENCE)}`
                    : "Date not set"}
                </span>
              </div>

              <div className="mt-5 border-t border-hairline pt-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                  Price (FOB Guangzhou)
                </p>
                <p className="mt-1 font-display text-[24px] font-semibold leading-none text-corporate-black">
                  {formatUsd(car.priceUsdFob)}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-hairline pt-4 text-[12px]">
                <Stat label="Car code" value={car.carCode} />
                <Stat label="Slug" value={car.slug} truncate />
                <Stat label="Body" value={car.bodyType ?? "—"} />
                <Stat
                  label={car.condition === "used" ? "Mileage" : "Range"}
                  value={
                    car.condition === "used"
                      ? formatMileage(car.mileageKm)
                      : car.rangeKm != null
                        ? `${numberFormatter.format(car.rangeKm)} km`
                        : "—"
                  }
                />
              </div>

              <div className="mt-5 flex flex-col gap-2 border-t border-hairline pt-4">
                <Link
                  href={`/admin/inventory/${car.carCode}/edit`}
                  className="inline-flex items-center justify-center rounded-full bg-cch-red px-4 py-2 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(230,57,70,0.28)] transition-colors hover:bg-cch-red-hover"
                >
                  Edit details
                </Link>
                <Link
                  href={`/lot/${car.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-hairline bg-white px-4 py-2 text-[13px] font-medium text-corporate-black transition-colors hover:bg-corporate-black hover:text-white"
                >
                  View public page
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-hairline bg-white p-5 shadow-card">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                Timestamps
              </p>
              <dl className="mt-3 space-y-2 text-[12.5px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-text-tertiary">Added to lot</dt>
                  <dd className="font-medium text-corporate-black">
                    {car.weekAdded ?? "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-text-tertiary">Created</dt>
                  <dd className="font-medium text-corporate-black">
                    {car.createdAt.slice(0, 10)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-text-tertiary">Updated</dt>
                  <dd className="font-medium text-corporate-black">
                    {car.updatedAt.slice(0, 10)}
                  </dd>
                </div>
                {car.soldDate ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-text-tertiary">Sold</dt>
                    <dd className="font-medium text-corporate-black">
                      {car.soldDate}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-[180px_1fr] sm:gap-6">
      <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
        {label}
      </dt>
      <dd className="text-[13.5px] text-corporate-black">{value}</dd>
    </div>
  );
}

function Stat({
  label,
  value,
  truncate,
}: {
  label: string;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div>
      <p className="text-text-tertiary">{label}</p>
      <p
        className={cn(
          "mt-0.5 font-medium text-corporate-black",
          truncate && "truncate",
        )}
      >
        {value}
      </p>
    </div>
  );
}
