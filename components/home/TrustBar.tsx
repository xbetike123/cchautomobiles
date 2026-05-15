type Stat = {
  number: string;
  label: string;
};

const stats: Stat[] = [
  { number: "8+", label: "Years operating in China" },
  { number: "3,000+", label: "Clients served" },
  { number: "15+", label: "Brands sourced" },
  { number: "100%", label: "Pre-shipment inspection" },
];

export function TrustBar() {
  return (
    <section
      aria-label="CCH Automobile by the numbers"
      className="border-y border-hairline bg-background"
    >
      <div className="mx-auto max-w-content px-6">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={
                "flex flex-col items-start py-10 lg:py-12 px-4 lg:px-8 " +
                // vertical hairlines between stats on lg, hairline between rows on mobile
                (index % 2 === 1 ? "border-l border-hairline " : "") +
                (index >= 2 ? "border-t border-hairline lg:border-t-0 " : "") +
                (index > 0 ? "lg:border-l lg:border-hairline" : "")
              }
            >
              <dd className="font-display text-[40px] font-semibold leading-none tracking-[-0.02em] text-cch-red">
                {stat.number}
              </dd>
              <dt className="mt-3 text-meta text-text-tertiary">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
