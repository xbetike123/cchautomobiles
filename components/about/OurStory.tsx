export function OurStory() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <div className="mx-auto max-w-[760px]">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cch-red">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-cch-red" />
            Our Story
          </span>
          <h2 className="mt-4 font-display text-[28px] font-semibold tracking-[-0.02em] text-corporate-black md:text-[40px]">
            From sourcing factory machines to sourcing electric vehicles.
          </h2>

          <div className="mt-8 space-y-5 text-[16px] leading-[1.75] text-text-secondary">
            <p>
              Over the years, we&rsquo;ve supported African buyers with
              sourcing and shipping everything from cosmetics and furniture to
              factory machines and industrial equipment. Through that
              experience, we built strong supplier networks, inspection
              systems, logistics partnerships, and on-ground operational
              structures across China.
            </p>
            <p>But recently, one request kept coming repeatedly:</p>
          </div>

          <figure className="my-10 border-l-2 border-cch-red pl-6 md:my-12 md:pl-8">
            <blockquote className="font-display text-[24px] font-semibold leading-[1.25] tracking-tight text-corporate-black md:text-[32px]">
              &ldquo;Can you help us source clean cars too?&rdquo;
            </blockquote>
          </figure>

          <div className="space-y-5 text-[16px] leading-[1.75] text-text-secondary">
            <p>
              That question led to months of research, factory visits, supplier
              verification, inspections, and building the right operational
              process to make vehicle sourcing safer and more reliable for
              African buyers.
            </p>
            <p className="text-[18px] font-medium text-corporate-black">
              Today, CCH Automobile helps Nigerians source clean, unaccidented
              electric vehicles directly from China.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
