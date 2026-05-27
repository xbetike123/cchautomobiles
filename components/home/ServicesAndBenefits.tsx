import {
  Award,
  BadgePercent,
  Globe2,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import { SectionMarker } from "@/components/site/SectionMarker";

type Service = {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const services: Service[] = [
  {
    title: "Verification and warranty",
    Icon: ShieldCheck,
    description:
      "Each car passes a 150-point inspection plus a clean legal background check before it leaves Guangzhou.",
  },
  {
    title: "Sourcing to order",
    Icon: Globe2,
    description:
      "We pick specific units off the factory line or first-owner market, anywhere in mainland China.",
  },
  {
    title: "Finance and leasing",
    Icon: BadgePercent,
    description:
      "Tailored payment plans through partner banks and leasing companies across West Africa.",
  },
  {
    title: "Trade-in",
    Icon: KeyRound,
    description:
      "Trade your current car against your next one at honest, transparent market value.",
  },
  {
    title: "Premium service",
    Icon: Award,
    description:
      "Concierge handling, original parts, and aftersales support — all in one place.",
  },
];

export function ServicesAndBenefits() {
  return (
    <section className="border-t border-hairline bg-white">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <SectionMarker number="02" label="Services" className="mb-10" />
        <header className="max-w-[820px]">
          <h2 className="font-display text-[36px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[56px]">
            Services and benefits.
          </h2>
          <p className="mt-4 max-w-[560px] text-[14px] leading-[1.6] text-text-secondary">
            Everything around the car, handled in-house. One team, one set of
            hands, from Guangzhou to your port.
          </p>
        </header>

        <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[6px] border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-5">
          {services.map((service) => {
            const Icon = service.Icon;
            return (
              <li
                key={service.title}
                className="flex flex-col gap-4 bg-white p-6"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-[4px] border border-hairline text-corporate-black">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold leading-[1.3] text-corporate-black">
                    {service.title}
                  </p>
                  <p className="mt-2 text-[12.5px] leading-[1.55] text-text-secondary">
                    {service.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
