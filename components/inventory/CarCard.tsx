import { BatteryCharging, Calendar, Car as CarIcon, Gauge } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { InventoryRow } from "@/lib/queries/inventory";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

function formatMileage(km: number | null): string {
  if (km == null) return "—";
  if (km >= 1000) return `${(km / 1000).toFixed(km % 1000 === 0 ? 0 : 1)}k km`;
  return `${km} km`;
}

function statusLabel(status: string): string {
  if (status === "reserved") return "Reserved";
  if (status === "sold") return "Sold";
  return "On the lot";
}

type CarCardProps = {
  car: InventoryRow;
  priority?: boolean;
};

export function CarCard({ car, priority = false }: CarCardProps) {
  const isNew = car.condition === "new";
  const price = usdFormatter.format(car.price_usd_fob);
  const image = car.hero_image_url ?? "/placeholders/inventory-card.svg";
  const badge = isNew
    ? "New In"
    : car.battery_health_pct != null && car.battery_health_pct >= 96
      ? "Top Pick"
      : null;

  const specs: { icon: typeof Calendar; label: string }[] = [
    { icon: Calendar, label: String(car.year) },
    { icon: CarIcon, label: car.body_type ?? "—" },
    {
      icon: Gauge,
      label: isNew
        ? car.range_km
          ? `${numberFormatter.format(car.range_km)} km`
          : "—"
        : formatMileage(car.mileage_km),
    },
    {
      icon: BatteryCharging,
      label: isNew
        ? "New battery"
        : car.battery_health_pct != null
          ? `${car.battery_health_pct}% health`
          : "Battery report",
    },
  ];

  return (
    <article className="group flex flex-col overflow-hidden rounded-card-lg bg-white shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
      <div className="relative aspect-[4/3] w-full bg-surface-warm">
        {badge ? (
          <span className="absolute left-4 top-4 z-10 inline-flex items-center rounded-chip bg-cch-red px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white">
            {badge}
          </span>
        ) : null}
        <Image
          src={image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[16px] font-semibold leading-tight text-corporate-black">
          {car.brand} {car.model}
        </h3>
        <p className="mt-1 text-[12px] text-text-tertiary">
          {statusLabel(car.status)} · Guangzhou
        </p>

        <ul className="mt-4 grid grid-cols-2 gap-y-2 text-[12px] text-text-secondary">
          {specs.map((spec, idx) => {
            const Icon = spec.icon;
            return (
              <li key={idx} className="flex items-center gap-1.5">
                <Icon className="size-3.5" aria-hidden="true" />
                <span className="truncate">{spec.label}</span>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex items-end justify-between border-t border-hairline pt-4">
          <div>
            <p className="text-[18px] font-bold leading-none text-cch-red">
              {price}
            </p>
            <p className="mt-1 text-[10.5px] uppercase tracking-[0.08em] text-text-tertiary">
              FOB Guangzhou
            </p>
          </div>
          <Link
            href={`/lot/${car.slug}`}
            className="inline-flex items-center rounded-chip bg-cch-red-soft px-4 py-1.5 text-[12px] font-semibold text-cch-red transition-colors hover:bg-cch-red hover:text-white"
          >
            Get Details
          </Link>
        </div>
      </div>
    </article>
  );
}
