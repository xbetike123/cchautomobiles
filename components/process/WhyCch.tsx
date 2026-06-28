import { Check } from "lucide-react";

const REASONS = [
  "New vehicles from manufacturers and authorized dealers",
  "Clean used vehicles from trusted dealers and first owners",
  "Professional vehicle inspections before shipment",
  "Transparent pricing and export guidance",
  "Worldwide shipping support",
];

export function WhyCch() {
  return (
    <section className="bg-surface-warm py-16 md:py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cch-red">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-cch-red" />
            Why CCH Automobile
          </span>
          <h2 className="mt-4 font-display text-[28px] font-bold leading-[1.1] tracking-tight text-corporate-black md:text-[36px]">
            Built to make importing simple.
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-[15px] leading-[1.6] text-text-secondary md:text-[16px]">
            A simple, transparent way to buy vehicles from China.
          </p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-[860px] grid-cols-1 gap-3 sm:grid-cols-2">
          {REASONS.map((reason) => (
            <li
              key={reason}
              className="flex items-start gap-3 rounded-2xl border border-hairline bg-white px-5 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-cch-red/10 text-cch-red"
              >
                <Check className="size-4" />
              </span>
              <span className="text-[14.5px] leading-[1.5] text-corporate-black">
                {reason}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
