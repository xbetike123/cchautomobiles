import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function ClosingCta() {
  return (
    <section className="bg-corporate-black text-white">
      <div className="mx-auto flex max-w-content flex-col items-start gap-8 px-6 py-20 md:flex-row md:items-center md:justify-between md:py-24">
        <div className="max-w-[640px]">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cch-red">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-cch-red" />
            Ready when you are
          </span>
          <h2 className="mt-4 font-display text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] md:text-[40px]">
            Found a car you like?
          </h2>
          <p className="mt-4 text-[15px] leading-[1.6] text-white/70 md:text-[16px]">
            Place your order right away. Every unit is pre-certified and ready
            to ship.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/request"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-cch-red px-6 py-3 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(230,57,70,0.3)] transition-colors hover:bg-cch-red-hover"
          >
            Request a Car
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
