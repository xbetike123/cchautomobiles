import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Logomark } from "@/components/site/Logomark";

export const metadata: Metadata = {
  title: "We'll be right back — CCH Automobile",
  description:
    "Our website is getting a few finishing touches. You can still request a car or get started with us in the meantime.",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-surface-warm px-6 py-20 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 size-[420px] rounded-full bg-cch-red/8 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 size-[360px] rounded-full bg-corporate-black/5 blur-3xl"
      />

      <div className="relative flex w-full max-w-[560px] flex-col items-center">
        <Logomark />

        <span className="mt-10 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cch-red">
          <span aria-hidden className="inline-block size-1.5 rounded-full bg-cch-red" />
          Under maintenance
        </span>

        <h1 className="mt-4 font-display text-[34px] font-semibold leading-[1.08] tracking-[-0.025em] text-corporate-black md:text-[48px]">
          We&apos;ll be right back.
        </h1>

        <p className="mt-5 max-w-[460px] text-[15px] leading-[1.65] text-text-secondary md:text-[16px]">
          We&apos;re putting the finishing touches on our website. In the
          meantime, you can still tell us what you&apos;re looking for and our
          team will take it from there.
        </p>

        <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/request"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-cch-red px-7 py-3.5 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(230,57,70,0.28)] transition-colors hover:bg-cch-red-hover"
          >
            Request a Car
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/get-started"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline bg-white px-7 py-3.5 text-[14px] font-semibold text-corporate-black transition-colors hover:bg-surface-tint"
          >
            Get Started
          </Link>
        </div>

        <p className="mt-8 text-[13px] text-text-secondary">
          Questions? Read our{" "}
          <Link href="/faq" className="font-medium text-cch-red hover:underline">
            FAQ
          </Link>{" "}
          or{" "}
          <Link
            href="/consultation"
            className="font-medium text-cch-red hover:underline"
          >
            book a consultation
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
