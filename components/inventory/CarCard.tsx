import Image from "next/image";
import Link from "next/link";

import type { InventoryRow } from "@/lib/queries/inventory";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

function buildFactsLine(car: InventoryRow): string {
  if (car.condition === "used") {
    const parts: string[] = [];
    if (car.mileage_km != null) parts.push(`${formatNumber(car.mileage_km)} km`);
    if (car.battery_health_pct != null) {
      parts.push(`${car.battery_health_pct}% battery health`);
    }
    return parts.join(" · ");
  }
  const parts: string[] = [];
  if (car.range_km != null) parts.push(`${car.range_km} km range`);
  if (car.body_type) parts.push(car.body_type);
  return parts.join(" · ");
}

type CarCardProps = {
  car: InventoryRow;
  priority?: boolean;
};

export function CarCard({ car, priority = false }: CarCardProps) {
  const meta = `${car.condition.toUpperCase()} · ${car.year}`;
  const facts = buildFactsLine(car);
  const price = `From ${usdFormatter.format(car.price_usd_fob)} FOB Guangzhou`;
  const imageSrc = car.hero_image_url ?? "/placeholders/inventory-card.svg";

  return (
    <Link
      href={`/lot/${car.slug}`}
      className="group flex flex-col gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cch-red focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <div className="relative w-full aspect-[4/3] bg-surface-tint overflow-hidden">
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
          priority={priority}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-meta text-cch-red">{meta}</p>
        <h3 className="font-display text-[18px] font-medium leading-[1.25] tracking-[-0.01em] text-corporate-black">
          {car.brand} {car.model}
        </h3>
        {facts ? (
          <p className="text-[13px] leading-[1.5] text-text-secondary">
            {facts}
          </p>
        ) : null}
        <p className="mt-1 text-[14px] font-medium leading-[1.4] text-corporate-black">
          {price}
        </p>
      </div>
    </Link>
  );
}
