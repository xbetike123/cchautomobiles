import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FaqHero() {
  return (
    <section className="relative overflow-hidden bg-surface-warm">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 size-[420px] rounded-full bg-cch-red/8 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 size-[360px] rounded-full bg-corporate-black/5 blur-3xl"
      />
      <div className="relative mx-auto max-w-content px-6 py-20 md:py-28">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cch-red">
          <span aria-hidden className="inline-block size-1.5 rounded-full bg-cch-red" />
          Frequently Asked Questions
        </span>
        <h1 className="mt-4 max-w-[920px] font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.025em] text-corporate-black md:text-[60px]">
          Everything you need to know before you order.
        </h1>
        <p className="mt-6 max-w-[640px] text-[16px] leading-[1.6] text-text-secondary md:text-[18px]">
          Straight answers on payment, inspection, shipping, and paperwork. If
          your question isn&apos;t here, reach out and a real person will walk
          you through it.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/request"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-cch-red px-6 py-3 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(230,57,70,0.28)] transition-colors hover:bg-cch-red-hover"
          >
            Ask a Question
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/lot"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline bg-white px-6 py-3 text-[14px] font-semibold text-corporate-black transition-colors hover:bg-surface-tint"
          >
            Browse the Lot
          </Link>
        </div>
      </div>
    </section>
  );
}
