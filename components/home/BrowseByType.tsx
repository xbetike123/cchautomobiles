import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionMarker } from "@/components/site/SectionMarker";

type CategoryCard = {
  name: string;
  href: string;
  image: string;
  badge?: string;
};

const categories: CategoryCard[] = [
  {
    name: "Pickup Truck",
    href: "/lot?type=pickup",
    image: "/types/360x0_c42_autohomecar__Chtlx2SiN-OAaF63AA24LxoN35Q774.avif",
  },
  {
    name: "SUV",
    href: "/lot?type=suv",
    image: "/types/360x0_c42_autohomecar__ChxknGhZNDeAZ_tCAAcajawlkNE378.avif",
    badge: "Hot",
  },
  {
    name: "Hatchback",
    href: "/lot?type=hatchback",
    image: "/types/360x0_c42_autohomecar__ChxpV2j18I-AbhS1ACdsTtsNeoQ722.avif",
  },
  {
    name: "Coupe",
    href: "/lot?type=coupe",
    image: "/types/360x0_c42_autohomecar__ChxpVWm71bKAIXDYACrJkPzrxfY598.avif",
  },
  {
    name: "Sedan",
    href: "/lot?type=sedan",
    image: "/types/360x0_c42_autohomecar__ChxoHmXVw2qAaWiuAAg1C-bg8-c383.avif",
  },
  {
    name: "Mini Van",
    href: "/lot?type=minivan",
    image: "/types/360x0_c42_autohomecar__ChtlyGgCI7mACAZAAAmdLJf9XDM270.avif",
  },
];

export function BrowseByType() {
  return (
    <section className="border-t border-hairline bg-white">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <SectionMarker number="01" label="Browse" className="mb-10" />
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-[820px] font-display text-[36px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[64px]">
            Find the exact car you want.
          </h2>
          <Link
            href="/lot"
            className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-corporate-black/75 transition-colors hover:text-cch-red"
          >
            Browse all vehicles
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </header>

        <div className="mt-16 grid grid-cols-2 divide-x divide-hairline border-y border-hairline md:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, index) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col items-center px-3 py-8 transition-colors hover:bg-corporate-black/[0.02]"
            >
              <div className="flex h-28 w-full items-center justify-center overflow-visible">
                <Image
                  src={cat.image}
                  alt=""
                  width={200}
                  height={100}
                  className="h-full w-auto animate-car-float transition-transform duration-500 ease-out group-hover:translate-x-1.5"
                  style={{ animationDelay: `${index * 0.45}s` }}
                />
              </div>
              <p className="mt-6 text-[13px] font-medium uppercase tracking-[0.14em] text-corporate-black transition-colors group-hover:text-cch-red">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
