import Image from "next/image";

const HERO_IMAGE = "/about/pexels-zion-5948346.jpg";

export function FounderHero() {
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
      <div className="relative mx-auto grid max-w-content grid-cols-1 items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cch-red">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-cch-red" />
            About CCH Automobile
          </span>
          <h1 className="mt-4 font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.025em] text-corporate-black md:text-[60px]">
            Transparent. Safe. Properly guided.
          </h1>
          <p className="mt-6 max-w-[560px] text-[16px] leading-[1.65] text-text-secondary md:text-[18px]">
            At CCH Automobile, we believe buying a car from abroad should feel
            transparent, safe, and properly guided — not risky or uncertain.
          </p>
          <p className="mt-4 max-w-[560px] text-[15px] leading-[1.65] text-text-secondary">
            CCH Automobile is the automobile division of Naiyuan Mart Ltd, a
            China-based supply chain management company that has spent years
            helping businesses across Africa source products directly from
            China.
          </p>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-card-lg border border-hairline bg-white shadow-card">
          <Image
            src={HERO_IMAGE}
            alt="CCH Automobile lot in Guangzhou"
            fill
            priority
            sizes="(min-width: 1024px) 480px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
