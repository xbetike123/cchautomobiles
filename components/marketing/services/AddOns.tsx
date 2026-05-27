import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

type AddOn = {
  title: string;
  description: string;
};

const ADD_ONS: AddOn[] = [
  {
    title: "Ceramic Coating",
    description: "Full-body protection applied at the lot.",
  },
  {
    title: "Spare Battery Pack",
    description: "For EVs, shipped alongside the unit.",
  },
  {
    title: "Charger Upgrade",
    description: "Fast-charge cable or home wall unit.",
  },
  {
    title: "Tinting",
    description: "Privacy or solar film, applied pre-export.",
  },
  {
    title: "Floor Mats & Interior Kit",
    description: "OEM or premium aftermarket.",
  },
  {
    title: "Extended Warranty",
    description: "Beyond standard manufacturer coverage.",
  },
  {
    title: "Container Upgrade",
    description: "Move from RoRo to enclosed container.",
  },
];

export function AddOns() {
  return (
    <section className="bg-surface-tint">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <header className="flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[640px]">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cch-red">
              <span aria-hidden className="inline-block size-1.5 rounded-full bg-cch-red" />
              Add-Ons
            </span>
            <h2 className="mt-4 font-display text-[28px] font-semibold tracking-[-0.02em] text-corporate-black md:text-[36px]">
              Customise the spec before shipping.
            </h2>
            <p className="mt-3 text-[14px] leading-[1.6] text-text-secondary md:text-[15px]">
              Bookable on any order, finished at the Guangzhou lot before the
              car ships.
            </p>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-hairline bg-white px-5 py-2.5 text-[13px] font-semibold text-corporate-black transition-colors hover:bg-white/80 md:self-end"
          >
            See Full Add-On Menu
            <ArrowRight className="size-3.5" />
          </Link>
        </header>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADD_ONS.map((item) => (
            <li
              key={item.title}
              className="flex items-start gap-3 rounded-card border border-hairline bg-white p-5"
            >
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-cch-red-soft text-cch-red">
                <Plus className="size-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="font-display text-[15px] font-semibold leading-snug tracking-tight text-corporate-black">
                  {item.title}
                </p>
                <p className="mt-1 text-[13px] leading-[1.55] text-text-secondary">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
