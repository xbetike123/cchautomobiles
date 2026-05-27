import Image from "next/image";

import { RequestCarCta } from "@/components/site/RequestCarCta";
import { SectionMarker } from "@/components/site/SectionMarker";

const features = [
  {
    title: "No middlemen between you and the factory",
    description:
      "New cars at desk prices from BYD, Geely, Xpeng, Zeekr, Wuling, and Leapmotor. Used cars only from verified first owners. Never auctions, never resellers.",
  },
  {
    title: "You see your car before the balance is due",
    description:
      "Photographed, road-tested, and walk-through filmed on our Guangzhou lot. You sign off on the exact unit. Then we ship.",
  },
  {
    title: "One team from Guangzhou to your port",
    description:
      "Export paperwork, ocean freight, and customs clearing — same hands the whole way. No hand-offs, no missing files when your container lands.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="border-t border-hairline bg-white">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <SectionMarker number="04" label="Why CCH" className="mb-12" />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-card-lg border border-hairline">
                <Image
                  src="/about/pexels-silverkblack-36729874.jpg"
                  alt=""
                  width={640}
                  height={480}
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-card-lg border border-hairline">
                <Image
                  src="/about/pexels-zion-5948346.jpg"
                  alt=""
                  width={640}
                  height={480}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
            <div className="mt-10 space-y-4">
              <div className="overflow-hidden rounded-card-lg border border-hairline">
                <Image
                  src="/about/pexels-gustavo-fring-4895435.jpg"
                  alt=""
                  width={640}
                  height={480}
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-card-lg border border-hairline">
                <Image
                  src="/about/pexels-ai25studioai-7144184.jpg"
                  alt=""
                  width={640}
                  height={480}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 left-6 flex items-center gap-4 rounded-card-lg border border-hairline bg-white px-5 py-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-cch-red text-white">
              <span className="text-lg font-semibold">10+</span>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-tertiary">
                Years of
              </p>
              <p className="text-sm font-semibold text-corporate-black">
                Sourcing Experience
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-meta text-cch-red">Why CCH</p>
          <h2 className="mt-3 font-display text-[36px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[56px]">
            Wiring money across the world <br className="hidden md:inline" />
            shouldn&apos;t feel like a gamble.
          </h2>
          <p className="mt-4 max-w-[480px] text-[15px] leading-[1.65] text-text-secondary">
            We&apos;ve watched importers lose deposits on cars that never
            shipped, receive accident-damaged units they couldn&apos;t return,
            and wait months for paperwork that didn&apos;t arrive at the port.
            CCH Automobile was built so none of that touches you.
          </p>

          <ul className="mt-8 flex flex-col divide-y divide-hairline border-y border-hairline">
            {features.map((feature, idx) => (
              <li
                key={feature.title}
                className="flex items-start gap-5 py-5"
              >
                <span
                  aria-hidden
                  className="w-10 shrink-0 font-display text-[18px] font-semibold tabular-nums tracking-tight text-cch-red"
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-corporate-black">
                    {feature.title}
                  </p>
                  <p className="mt-1 text-[14px] leading-[1.55] text-text-secondary">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <RequestCarCta className="rounded-[2px] px-8 text-[12.5px] uppercase tracking-[0.14em]">Request a Car</RequestCarCta>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
