import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const POINTS = [
  "Quote within 24 hours",
  "No hidden fees",
  "Deposit secures your unit",
  "Balance due before export",
];

export function PricingNote() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <div className="grid gap-10 rounded-card-lg border border-hairline bg-surface-warm p-8 md:grid-cols-[1.2fr_1fr] md:gap-12 md:p-12">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cch-red">
              <span aria-hidden className="inline-block size-1.5 rounded-full bg-cch-red" />
              Pricing
            </span>
            <h2 className="mt-4 max-w-[440px] font-display text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-corporate-black md:text-[34px]">
              Straight pricing. Deposit secures the unit.
            </h2>
            <p className="mt-4 max-w-[480px] text-[14.5px] leading-[1.6] text-text-secondary">
              Quote within 24 hours. No hidden fees. Deposit secures your unit.
              Balance due before export.
            </p>
            <div className="mt-7">
              <Link
                href="/request"
                className="inline-flex items-center gap-2 rounded-full bg-cch-red px-6 py-3 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(230,57,70,0.28)] transition-colors hover:bg-cch-red-hover"
              >
                Request a Quote
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <ul className="flex flex-col gap-3 self-center">
            {POINTS.map((point) => (
              <li
                key={point}
                className="flex items-center gap-3 rounded-card border border-hairline bg-white px-4 py-3 text-[13.5px] font-medium text-corporate-black"
              >
                <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-cch-red-soft text-cch-red">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
