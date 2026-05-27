import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { SectionMarker } from "@/components/site/SectionMarker";

type Card = {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  tone: "primary" | "secondary";
};

const cards: Card[] = [
  {
    title: "Ready to buy your car?",
    description:
      "Found what you want on our page? Place your order right away. Every unit is pre-certified and ready to ship.",
    ctaLabel: "Place Order",
    href: "/request",
    tone: "primary",
  },
  {
    title: "Sourcing for a fleet?",
    description:
      "Building a ride-hail, taxi, or corporate transport fleet? Our China desk handles bulk negotiations, fleet pricing, and consolidated shipping.",
    ctaLabel: "Talk to Sourcing",
    href: "/request?type=fleet",
    tone: "secondary",
  },
];

export function BuyOrSell() {
  return (
    <section className="border-t border-hairline bg-white">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <SectionMarker number="03" label="Buy or source" className="mb-10" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map((card) => {
            const isPrimary = card.tone === "primary";
            return (
              <article
                key={card.title}
                className={
                  isPrimary
                    ? "group relative flex flex-col justify-between gap-8 overflow-hidden rounded-card-lg bg-corporate-black p-8 text-white md:p-10"
                    : "group relative flex flex-col justify-between gap-8 overflow-hidden rounded-card-lg border border-hairline bg-white p-8 md:p-10"
                }
              >
                <span
                  aria-hidden
                  className={
                    isPrimary
                      ? "absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cch-red to-transparent md:inset-x-10"
                      : "absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cch-red/40 to-transparent md:inset-x-10"
                  }
                />
                <div className="max-w-[440px]">
                  <h3
                    className={
                      isPrimary
                        ? "font-display text-[24px] font-semibold leading-[1.15] tracking-[-0.015em] md:text-[30px]"
                        : "font-display text-[24px] font-semibold leading-[1.15] tracking-[-0.015em] text-corporate-black md:text-[30px]"
                    }
                  >
                    {card.title}
                  </h3>
                  <p
                    className={
                      isPrimary
                        ? "mt-4 text-[14.5px] leading-[1.65] text-white/70"
                        : "mt-4 text-[14.5px] leading-[1.65] text-text-secondary"
                    }
                  >
                    {card.description}
                  </p>
                </div>
                <Link
                  href={card.href}
                  className={
                    isPrimary
                      ? "inline-flex w-fit items-center gap-2 rounded-[2px] bg-cch-red px-7 py-3 text-[12.5px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-cch-red-hover"
                      : "inline-flex w-fit items-center gap-2 rounded-[2px] border border-corporate-black bg-transparent px-7 py-3 text-[12.5px] font-medium uppercase tracking-[0.14em] text-corporate-black transition-colors hover:bg-corporate-black hover:text-white"
                  }
                >
                  {card.ctaLabel}
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
