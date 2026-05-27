import Image from "next/image";
import { ArrowLeft, ArrowRight, Cog, Fuel, Gauge, Heart } from "lucide-react";

const CARS = [
  {
    title: "Hyundai Kona Electric",
    subtitle: "2.0 D5 PowerPulse AWD",
    image: "/types/360x0_c42_autohomecar__ChxoHmXVw2qAaWiuAAg1C-bg8-c383.avif",
    miles: "150 Miles",
    fuel: "Electric",
    transmission: "Automatic",
    price: "$32,000",
  },
  {
    title: "Hyundai Elantra",
    subtitle: "2.0 D5 PowerPulse AWD",
    image: "/types/360x0_c42_autohomecar__ChxpV2j18I-AbhS1ACdsTtsNeoQ722.avif",
    miles: "100 Miles",
    fuel: "Petrol",
    transmission: "Automatic",
    price: "$28,500",
  },
  {
    title: "Toyota C-HR",
    subtitle: "2.0 D5 PowerPulse AWD",
    image: "/types/360x0_c42_autohomecar__ChxknGhZNDeAZ_tCAAcajawlkNE378.avif",
    miles: "200 Miles",
    fuel: "Hybrid",
    transmission: "CVT",
    price: "$36,000",
  },
];

export function CarentoSearchedCars() {
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
            <button
              type="button"
              aria-label="Previous"
              className="inline-flex size-11 items-center justify-center rounded-full border border-hairline text-corporate-black transition-colors hover:bg-surface-tint"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next"
              className="inline-flex size-11 items-center justify-center rounded-full border border-hairline text-corporate-black transition-colors hover:bg-surface-tint"
            >
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CARS.map((car) => (
            <article
              key={car.title}
              className="group flex flex-col overflow-hidden rounded-[14px] border border-hairline bg-white shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="relative aspect-[5/3] overflow-hidden bg-surface-tint">
                <Image
                  src={car.image}
                  alt={car.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  type="button"
                  aria-label="Save"
                  className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full bg-white/90 text-corporate-black shadow-sm backdrop-blur-md hover:text-cch-red"
                >
                  <Heart className="size-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-corporate-black">
                    {car.title}
                  </h3>
                  <p className="mt-0.5 text-[11.5px] text-text-tertiary">
                    {car.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 border-y border-hairline py-2.5 text-[11px] text-text-secondary">
                  <Spec icon={Gauge} label={car.miles} />
                  <Spec icon={Fuel} label={car.fuel} />
                  <Spec icon={Cog} label={car.transmission} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-bold text-corporate-black">
                    {car.price}
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full bg-cch-red px-3 py-1.5 text-[11.5px] font-semibold text-white hover:bg-cch-red-hover"
                  >
                    View Details
                    <ArrowRight className="size-3" aria-hidden="true" />
                  </button>
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
