import Image from "next/image";

import { CtaButton } from "@/components/site/CtaButton";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-corporate-black text-white">
      <div className="relative w-full aspect-[21/9] min-h-[460px] md:min-h-[560px]">
        <Image
          src="/placeholders/lot-hero.svg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-corporate-black/85 via-corporate-black/45 to-transparent"
        />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-content flex-col justify-end px-6 pb-12 md:px-12 md:pb-24 lg:px-24 lg:pb-24">
            <div className="max-w-[720px]">
              <div className="h-px w-6 bg-cch-red" />
              <p className="mt-4 text-meta text-cch-red">
                CCH Automobile · Guangzhou export group
              </p>
              <h1 className="mt-6 font-display font-semibold leading-[1.05] tracking-[-0.03em] text-[40px] md:text-[56px] lg:text-[64px]">
                Your one stop hub for Chinese EVs.
              </h1>
              <p className="mt-6 max-w-[540px] text-base font-normal leading-[1.6] text-white/90">
                New from the factory. Used from the first owner. Every car
                inspected on our lot in Guangzhou before it ships.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <CtaButton href="/request">Start a request</CtaButton>
                <CtaButton href="/lot" variant="outline-light">
                  See this week&apos;s lot
                </CtaButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
