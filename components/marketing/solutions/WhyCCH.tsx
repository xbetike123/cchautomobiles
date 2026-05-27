import { HeartHandshake, Layers, ShieldCheck, type LucideIcon } from "lucide-react";

type Pillar = {
  title: string;
  body: string;
  icon: LucideIcon;
};

const PILLARS: Pillar[] = [
  {
    title: "Prime Access Points",
    icon: Layers,
    body: "Sourcing direct from BYD, Geely, Zeekr, Xpeng, and Leapmotor factory desks. First-owner used cars from the Guangzhou lot.",
  },
  {
    title: "Service That Puts You First",
    icon: HeartHandshake,
    body: "Inspection, paperwork, and shipping handled in-house. Weekly walk-through videos from the lot.",
  },
  {
    title: "Safety as Standard",
    icon: ShieldCheck,
    body: "Every car verified through manufacturer channels. Ships with battery passport and warranty.",
  },
];

type WhyCCHProps = {
  eyebrow?: string;
  heading?: string;
};

export function WhyCCH({
  eyebrow = "Why you should buy from CCH Automobile",
  heading = "Built around how serious importers operate.",
}: WhyCCHProps = {}) {
  return (
    <section className="bg-surface-tint">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <header className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cch-red">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-cch-red" />
            {eyebrow}
          </span>
          <h2 className="mt-4 font-display text-[28px] font-semibold tracking-[-0.02em] text-corporate-black md:text-[40px]">
            {heading}
          </h2>
        </header>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.title}
                className="flex h-full flex-col rounded-card-lg border border-hairline bg-white p-7"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-corporate-black text-white">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-[18px] font-semibold leading-snug tracking-tight text-corporate-black">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-[13.5px] leading-[1.6] text-text-secondary">
                  {pillar.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
