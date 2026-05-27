"use client";

import { ArrowRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SectionMarker } from "@/components/site/SectionMarker";

type CarItem = {
  name: string;
  city: string;
  year: string;
  transmission: string;
  mileage: string;
  fuel: string;
  price: string;
  perDay: string;
  image: string;
  badge?: string;
};

const cars: CarItem[] = [
  {
    name: "BYD Han EV Premium",
    city: "Guangzhou Lot",
    year: "2025",
    transmission: "Auto",
    mileage: "1.2k km",
    fuel: "Electric",
    price: "$28,400",
    perDay: "On the lot",
    image: "/types/360x0_c42_autohomecar__ChxoHmXVw2qAaWiuAAg1C-bg8-c383.avif",
    badge: "New In",
  },
  {
    name: "Zeekr 001 Long Range",
    city: "Guangzhou Lot",
    year: "2024",
    transmission: "Auto",
    mileage: "8.6k km",
    fuel: "Electric",
    price: "$32,900",
    perDay: "Reserved",
    image: "/types/360x0_c42_autohomecar__ChxknGhZNDeAZ_tCAAcajawlkNE378.avif",
  },
  {
    name: "Xpeng G9 Performance",
    city: "Guangzhou Lot",
    year: "2024",
    transmission: "Auto",
    mileage: "4.1k km",
    fuel: "Electric",
    price: "$34,200",
    perDay: "On the lot",
    image: "/types/360x0_c42_autohomecar__ChxpVWm71bKAIXDYACrJkPzrxfY598.avif",
  },
  {
    name: "Geely Galaxy E8",
    city: "Guangzhou Lot",
    year: "2025",
    transmission: "Auto",
    mileage: "0 km",
    fuel: "Electric",
    price: "$26,500",
    perDay: "On the lot",
    image: "/types/360x0_c42_autohomecar__ChtlyGgCI7mACAZAAAmdLJf9XDM270.avif",
  },
];

export function PopularCars() {
  return (
    <section className="border-t border-hairline bg-white">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <SectionMarker number="01" label="On the lot" className="mb-10" />
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[820px]">
            <h2 className="font-display text-[36px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[64px]">
              On the lot, this week.
            </h2>
            <p className="mt-4 max-w-[520px] text-[14px] leading-[1.6] text-text-secondary">
              New arrivals this week. Inspected, certified, and ready to ship.
            </p>
          </div>
          <Link
            href="/lot"
            className="group inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-corporate-black/75 transition-colors hover:text-cch-red"
          >
            Browse all inventory
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cars.map((car) => (
            <article
              key={car.name}
              className="group flex flex-col overflow-hidden rounded-[6px] border border-hairline bg-white transition-colors hover:border-corporate-black/30"
            >
              <div className="relative bg-white p-4">
                <button
                  type="button"
                  aria-label={`Save ${car.name}`}
                  className="absolute right-4 top-4 z-10 inline-flex size-9 items-center justify-center rounded-full border border-hairline bg-white text-text-tertiary transition-colors hover:border-cch-red hover:text-cch-red"
                >
                  <Heart className="size-4" aria-hidden="true" />
                </button>
                <Image
                  src={car.image}
                  alt=""
                  width={400}
                  height={240}
                  className="h-auto w-full"
                />
              </div>
              <div className="flex flex-1 flex-col px-5 pb-5">
                <h3 className="text-[15.5px] font-semibold leading-tight text-corporate-black">
                  {car.name}
                </h3>

                <dl className="mt-5 grid grid-cols-4 gap-3">
                  <Stat label="Year" value={car.year} />
                  <Stat label="Drive" value={car.transmission} />
                  <Stat label="Range" value={car.fuel} />
                  <Stat label="Mileage" value={car.mileage} />
                </dl>

                <div className="mt-6 flex items-end justify-between gap-3 border-t border-hairline pt-4">
                  <p className="font-display text-[20px] font-semibold tabular-nums text-corporate-black">
                    {car.price}
                  </p>
                  <Link
                    href={`/lot/${encodeURIComponent(car.name.toLowerCase().replace(/\s+/g, "-"))}`}
                    className="inline-flex items-center gap-1.5 rounded-[2px] bg-corporate-black px-4 py-2 text-[11.5px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-cch-red"
                  >
                    Details
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/lot"
            className="inline-flex items-center gap-2 rounded-[2px] border border-corporate-black bg-white px-8 py-3.5 text-[12.5px] font-medium uppercase tracking-[0.14em] text-corporate-black transition-colors hover:bg-corporate-black hover:text-white"
          >
            View this week&apos;s lot
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-text-tertiary">
        {label}
      </span>
      <span className="text-[12.5px] font-medium text-corporate-black">
        {value}
      </span>
    </div>
  );
}
