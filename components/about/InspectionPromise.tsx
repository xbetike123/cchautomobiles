import { BatteryCharging, ClipboardCheck, FileSearch, ShieldCheck, Zap } from "lucide-react";

const CHECKS = [
  {
    Icon: ClipboardCheck,
    title: "Detailed inspection",
    body: "Every vehicle is physically inspected on our Guangzhou lot before payment is finalised.",
  },
  {
    Icon: ShieldCheck,
    title: "Third-party verification",
    body: "Independent verification of the car’s condition and history, separate from the seller.",
  },
  {
    Icon: BatteryCharging,
    title: "Battery & condition checks",
    body: "Battery health, charging performance, and full mechanical checks documented and shared.",
  },
  {
    Icon: FileSearch,
    title: "Full reporting before payment",
    body: "Videos, diagnostics, and verification reports sent to you before final payment is approved.",
  },
];

export function InspectionPromise() {
  return (
    <section className="bg-surface-tint">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <header className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cch-red">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-cch-red" />
            How we work
          </span>
          <h2 className="mt-4 font-display text-[28px] font-semibold tracking-[-0.02em] text-corporate-black md:text-[40px]">
            No blind buying. No guesswork.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.65] text-text-secondary md:text-[16px]">
            Our goal is simple: help buyers access modern electric vehicles
            from China with confidence, clarity, and proper support throughout
            the process.
          </p>
        </header>

        <ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
          {CHECKS.map(({ Icon, title, body }) => (
            <li
              key={title}
              className="flex h-full gap-4 rounded-card-lg border border-hairline bg-white p-7 shadow-card"
            >
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-cch-red-soft text-cch-red">
                <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-[17px] font-semibold leading-snug tracking-tight text-corporate-black">
                  {title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-text-secondary">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 overflow-hidden rounded-card-lg border border-hairline bg-corporate-black text-white shadow-lift">
          <div className="flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:gap-8 md:p-10">
            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-cch-red text-white shadow-[0_10px_24px_rgba(230,57,70,0.4)]">
              <Zap className="size-6" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cch-red">
                <span aria-hidden className="inline-block size-1.5 rounded-full bg-cch-red" />
                Included with every car
              </span>
              <h3 className="mt-3 font-display text-[22px] font-semibold leading-tight tracking-tight md:text-[28px]">
                A free home charging station.
              </h3>
              <p className="mt-3 max-w-[560px] text-[15px] leading-[1.65] text-white/75">
                To make EV ownership easier, every vehicle ships with a home
                charging station at no extra cost.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
