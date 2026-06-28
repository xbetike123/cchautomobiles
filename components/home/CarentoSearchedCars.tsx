import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Cog, Fuel, Gauge, Heart } from "lucide-react";

import { getInventory, type InventoryRow } from "@/lib/queries/inventory";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

function distanceLabel(car: InventoryRow): string {
  if (car.condition === "new") {
    return car.range_km ? `${numberFormatter.format(car.range_km)} km range` : "New";
  }
  if (car.mileage_km == null) return "—";
  return car.mileage_km >= 1000
    ? `${(car.mileage_km / 1000).toFixed(car.mileage_km % 1000 === 0 ? 0 : 1)}k km`
    : `${car.mileage_km} km`;
}

export async function CarentoSearchedCars() {
  const { rows } = await getInventory({ sort: "newest", perPage: 3, page: 1 });
  const cars = rows.slice(0, 3);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-[36px] font-bold leading-[1.1] tracking-tight text-corporate-black md:text-[44px]">
              Most Requested Vehicles This Week
            </h2>
            <p className="mt-2 text-[14px] text-text-secondary">
              Explore This Week&apos;s Most In-Demand Chinese EVs
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/lot"
              aria-label="Browse the full lot"
              className="inline-flex size-11 items-center justify-center rounded-full border border-hairline text-corporate-black transition-colors hover:bg-surface-tint"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/lot"
              aria-label="Browse the full lot"
              className="inline-flex size-11 items-center justify-center rounded-full border border-hairline text-corporate-black transition-colors hover:bg-surface-tint"
            >
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <article
              key={car.id}
              className="group flex flex-col overflow-hidden rounded-[14px] border border-hairline bg-white shadow-card transition-shadow hover:shadow-card-hover"
            >
              <Link href={`/lot/${car.slug}`} className="relative aspect-5/3 overflow-hidden bg-surface-tint">
                <Image
                  src={car.hero_image_url ?? "/placeholders/inventory-card.svg"}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full bg-white/90 text-corporate-black shadow-sm backdrop-blur-md"
                >
                  <Heart className="size-3.5" />
                </span>
              </Link>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-corporate-black">
                    <Link href={`/lot/${car.slug}`} className="hover:text-cch-red">
                      {car.brand} {car.model}
                    </Link>
                  </h3>
                  <p className="mt-0.5 text-[11.5px] text-text-tertiary">
                    {car.year}
                    {car.body_type ? ` · ${car.body_type}` : ""}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 border-y border-hairline py-2.5 text-[11px] text-text-secondary">
                  <Spec icon={Gauge} label={distanceLabel(car)} />
                  <Spec icon={Fuel} label="Electric" />
                  <Spec icon={Cog} label={car.condition === "new" ? "New" : "Used"} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-bold text-corporate-black">
                    {usdFormatter.format(car.price_usd_fob)}
                  </span>
                  <Link
                    href={`/lot/${car.slug}`}
                    className="inline-flex items-center gap-1 rounded-full bg-cch-red px-3 py-1.5 text-[11.5px] font-semibold text-white hover:bg-cch-red-hover"
                  >
                    View Details
                    <ArrowRight className="size-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Spec({ icon: Icon, label }: { icon: typeof Gauge; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <Icon className="size-4 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
