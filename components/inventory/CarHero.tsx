import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { InventoryRow } from "@/lib/queries/inventory";

type CarHeroProps = {
  car: InventoryRow;
};

export function CarHero({ car }: CarHeroProps) {
  const isNew = car.condition === "new";
  const conditionLabel = isNew ? "New" : "Used";
  const image = car.hero_image_url ?? "/placeholders/inventory-card.svg";
  const title = `${car.year} ${car.brand} ${car.model}`;
  const badge = isNew ? "New In" : null;

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-content px-6 pt-10 md:pt-14">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-[12px] text-text-tertiary"
        >
          <Link href="/lot" className="hover:text-corporate-black">
            On the lot
          </Link>
          <ChevronRight aria-hidden="true" className="size-3" />
          <Link
            href={`/lot?condition=${car.condition}`}
            className="hover:text-corporate-black"
          >
            {conditionLabel}
          </Link>
          <ChevronRight aria-hidden="true" className="size-3" />
          <span className="text-corporate-black">{title}</span>
        </nav>

        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-card-lg bg-surface-warm shadow-[var(--shadow-card)]">
          {badge ? (
            <span className="absolute left-5 top-5 z-10 inline-flex items-center rounded-chip bg-cch-red px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white">
              {badge}
            </span>
          ) : null}
          <Image
            src={image}
            alt={title}
            fill
            priority
            sizes="(min-width: 1200px) 1200px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
