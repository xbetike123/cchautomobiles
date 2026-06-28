import Image from "next/image";

const TYPES = [
  { label: "SUV", image: "/types/360x0_c42_autohomecar__ChxknGhZNDeAZ_tCAAcajawlkNE378.avif" },
  { label: "Hatchback", image: "/types/360x0_c42_autohomecar__ChxpV2j18I-AbhS1ACdsTtsNeoQ722.avif" },
  { label: "Sedan", image: "/types/360x0_c42_autohomecar__ChxoHmXVw2qAaWiuAAg1C-bg8-c383.avif" },
  { label: "Minivan", image: "/types/360x0_c42_autohomecar__ChtlyGgCI7mACAZAAAmdLJf9XDM270.avif" },
  { label: "Coupe", image: "/types/360x0_c42_autohomecar__ChxpVWm71bKAIXDYACrJkPzrxfY598.avif" },
  { label: "Pickup Truck", image: "/types/360x0_c42_autohomecar__Chtlx2SiN-OAaF63AA24LxoN35Q774.avif" },
];

export function CarentoBrowseByType() {
  return (
    <section className="bg-surface-tint py-20 md:py-28">
      <div className="mx-auto max-w-content px-6">
        <div>
          <h2 className="font-display text-[36px] font-bold leading-[1.1] tracking-tight text-corporate-black md:text-[44px]">
            For every road, every reason.
          </h2>
          <p className="mt-3 max-w-[480px] text-[14.5px] leading-relaxed text-text-secondary">
            From compact city drives to executive arrivals — pick the shape
            that fits your life.
          </p>
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
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
