import Image from "next/image";
import { ArrowRight } from "lucide-react";

const TYPES = [
  { label: "SUV", count: "24", image: "/types/360x0_c42_autohomecar__ChxknGhZNDeAZ_tCAAcajawlkNE378.avif" },
  { label: "Hatchback", count: "16", image: "/types/360x0_c42_autohomecar__ChxpV2j18I-AbhS1ACdsTtsNeoQ722.avif" },
  { label: "Sedan", count: "150", image: "/types/360x0_c42_autohomecar__ChxoHmXVw2qAaWiuAAg1C-bg8-c383.avif" },
  { label: "Minivan", count: "56", image: "/types/360x0_c42_autohomecar__ChtlyGgCI7mACAZAAAmdLJf9XDM270.avif" },
  { label: "Coupe", count: "25", image: "/types/360x0_c42_autohomecar__ChxpVWm71bKAIXDYACrJkPzrxfY598.avif" },
  { label: "Pickup Truck", count: "—", image: "/types/360x0_c42_autohomecar__Chtlx2SiN-OAaF63AA24LxoN35Q774.avif" },
];

export function CarentoBrowseByType() {
  return (
    <section className="bg-surface-tint py-20 md:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-[36px] font-bold leading-[1.1] tracking-tight text-corporate-black md:text-[44px]">
              Browse by Type
            </h2>
            <p className="mt-2 text-[14px] text-text-secondary">
              Find the perfect ride for any occasion
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-cch-red px-6 py-3 text-[13px] font-semibold text-white hover:bg-cch-red-hover"
          >
            View More
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {TYPES.map((type) => (
            <button
              key={type.label}
              type="button"
              className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-[14px] border border-hairline bg-white p-3 text-center shadow-card transition-shadow hover:shadow-card-hover"
            >
              <Image
                src={type.image}
                alt={type.label}
                width={64}
                height={64}
                sizes="64px"
                className="size-16 object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <h3 className="text-[12.5px] font-semibold leading-tight text-corporate-black">
                {type.label}
              </h3>
              <span className="text-[10.5px] font-medium text-text-tertiary">
                {type.count} Vehicles
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
