import Image from "next/image";
import { Check } from "lucide-react";

import { CarentoHeroSearch } from "./CarentoHeroSearch";
import { getInventoryFacets } from "@/lib/queries/inventory";

const USPS = [
  "Low Mileage",
  "Accident-Free",
  "Verified Condition",
];

export async function CarentoHero() {
  const facets = await getInventoryFacets();

  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="/cch_automobile.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,10,15,0.78)_0%,rgba(8,10,15,0.45)_45%,rgba(8,10,15,0.1)_75%,rgba(8,10,15,0)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[linear-gradient(180deg,rgba(8,10,15,0)_0%,rgba(8,10,15,0.45)_100%)]"
      />

      <div className="relative mx-auto max-w-content px-6 pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-[640px]">
          <span className="text-[14px] font-semibold tracking-wide text-cch-red">
            Find Your Perfect Car
          </span>
          <h1 className="mt-3 font-display text-[38px] font-bold leading-[1.05] tracking-tight text-white md:text-[60px] lg:text-[72px]">
            Own a Clean Chinese Vehicle
            <br />
            Without the Stress.
          </h1>

          <div className="mt-8 flex flex-col flex-wrap gap-x-8 gap-y-3 sm:flex-row sm:items-center">
            {USPS.map((usp) => (
              <div
                key={usp}
                className="inline-flex items-center gap-2 text-[13px] font-medium text-white"
              >
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-cch-red text-white shadow-[0_4px_10px_rgba(230,57,70,0.35)]">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
                {usp}
              </div>
            ))}
          </div>
        </div>

        <CarentoHeroSearch
          brands={facets.brands}
          bodyTypes={facets.bodyTypes}
        />
      </div>
    </section>
  );
}
