import Image from "next/image";

import type { InventoryRow } from "@/lib/queries/inventory";

type Props = {
  car: InventoryRow;
};

const GALLERY_LENGTH = 9;
const FALLBACK_IMAGE = "/placeholders/inventory-card.svg";

function buildGalleryUrls(car: InventoryRow): string[] {
  const base: string[] = [];
  if (car.hero_image_url) base.push(car.hero_image_url);
  for (const url of car.gallery_image_urls ?? []) {
    if (url && !base.includes(url)) base.push(url);
  }
  while (base.length < GALLERY_LENGTH) {
    base.push(FALLBACK_IMAGE);
  }
  return base.slice(0, GALLERY_LENGTH);
}

export function Gallery({ car }: Props) {
  const urls = buildGalleryUrls(car);
  const realCount = (car.gallery_image_urls?.length ?? 0) +
    (car.hero_image_url ? 1 : 0);

  return (
    <section className="bg-surface-tint">
      <div className="mx-auto max-w-content px-6 py-12 md:py-16">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-[22px] font-semibold leading-tight tracking-tight text-corporate-black md:text-[26px]">
              Photo gallery
            </h2>
            <p className="mt-2 max-w-[640px] text-[14px] text-text-secondary">
              Exterior, interior, underbody and paperwork. Shot on the CCH lot
              this week.
            </p>
          </div>
          {realCount < GALLERY_LENGTH ? (
            <p className="text-[11px] uppercase tracking-[0.12em] text-text-tertiary">
              Placeholder fill · final photos pending
            </p>
          ) : null}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
          {urls.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="relative aspect-[4/3] overflow-hidden rounded-card border border-hairline bg-white"
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
