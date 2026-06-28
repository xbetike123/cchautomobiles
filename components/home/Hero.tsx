import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { RequestCarCta } from "@/components/site/RequestCarCta";

const HERO_CAR_IMAGE =
  "/types/360x0_c42_autohomecar__ChxoHmXVw2qAaWiuAAg1C-bg8-c383.avif";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-hairline bg-white">
      <div className="mx-auto max-w-content px-6 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="flex flex-col">
            <h1 className="font-display font-semibold leading-[1.02] tracking-[-0.035em] text-[40px] md:text-[56px] lg:text-[68px]">
              Premium dealership for buyers who choose with confidence.
            </h1>
            <p className="mt-6 max-w-[520px] text-[15px] leading-[1.65] text-text-secondary md:text-[16px]">
              Chinese EVs in stock and on order from Guangzhou. Inspected, filmed,
              and cleared at your destination port. Full coverage, transparent
              pricing, no auctions, no middlemen.
            </p>

            <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <RequestCarCta className="rounded-[2px] px-8 text-[12.5px] uppercase tracking-[0.14em]">
                Request a Car
              </RequestCarCta>
              <Link
                href="/request"
                className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-corporate-black bg-white px-8 py-[14px] text-[12.5px] font-medium uppercase tracking-[0.14em] text-corporate-black transition-colors hover:bg-corporate-black hover:text-white"
              >
                Book a consultation
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="relative flex size-2 shrink-0"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cch-red/40" />
                <span className="relative inline-flex size-2 rounded-full bg-cch-red" />
              </span>
              <p className="text-[12.5px] leading-[1.5] text-text-secondary">
                <span className="font-semibold text-corporate-black">
                  200+ vehicles in stock
                </span>{" "}
                with full inspection and ready to ship.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[6px] bg-surface-tint/40 md:aspect-[5/4] lg:aspect-[5/4]">
              <Image
                src={HERO_CAR_IMAGE}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 600px, (min-width: 768px) 700px, 100vw"
                className="object-contain p-6 md:p-10"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-[2px] border border-corporate-black/15 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-corporate-black/80 shadow-[0_1px_0_rgba(15,23,42,0.04)]"
              >
                CCH · Automobile
              </div>
            </div>
            <Link
              href="/lot"
              aria-label="View this week's arrivals"
              className="absolute -bottom-5 right-6 inline-flex size-12 items-center justify-center rounded-full bg-corporate-black text-white transition-colors hover:bg-cch-red"
            >
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
