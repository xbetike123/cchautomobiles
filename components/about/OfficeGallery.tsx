import Image from "next/image";

type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  aspect: "tall" | "wide" | "square";
};

const ITEMS: GalleryItem[] = [
  {
    src: "/about/pexels-zion-5948346.jpg",
    alt: "CCH lot in Guangzhou",
    caption: "The lot. Baiyun district, Guangzhou.",
    aspect: "tall",
  },
  {
    src: "/about/pexels-gustavo-fring-4895435.jpg",
    alt: "Inspection officer beside a vehicle",
    caption: "Inspection bay where every car is checked.",
    aspect: "wide",
  },
  {
    src: "/about/pexels-silverkblack-36729874.jpg",
    alt: "Operations floor",
    caption: "Operations floor, paperwork and logistics.",
    aspect: "square",
  },
];

const aspectClass: Record<GalleryItem["aspect"], string> = {
  tall: "aspect-[3/4]",
  wide: "aspect-[4/3]",
  square: "aspect-square",
};

export function OfficeGallery() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <header className="flex flex-col items-start text-left md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cch-red">
              <span aria-hidden className="inline-block size-1.5 rounded-full bg-cch-red" />
              The Guangzhou Lot
            </span>
            <h2 className="mt-4 max-w-[640px] font-display text-[28px] font-semibold tracking-[-0.02em] text-corporate-black md:text-[40px]">
              Where every car gets checked before it ships.
            </h2>
          </div>
          <p className="mt-4 max-w-[420px] text-[15px] leading-[1.6] text-text-secondary md:mt-0 md:text-right">
            Filmed and photographed by the CCH operations team. New images
            arrive each week as the lot turns over.
          </p>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {ITEMS.map((item) => (
            <figure
              key={item.src}
              className="flex flex-col gap-3"
            >
              <div
                className={`relative ${aspectClass[item.aspect]} overflow-hidden rounded-card border border-hairline bg-surface-tint`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="text-[13px] text-text-tertiary">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
