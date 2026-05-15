import Image from "next/image";

import { SectionHeader } from "@/components/site/SectionHeader";
import { TertiaryLink } from "@/components/site/TertiaryLink";

type Panel = {
  label: string;
  heading: string;
  paragraph: string;
  bullets: string[];
  cta: { href: string; label: string };
  image: { src: string; alt: string };
};

const panels: Panel[] = [
  {
    label: "New",
    heading: "From the factory.",
    paragraph:
      "New stock is sourced direct from BYD, Geely, Xpeng, Zeekr, Wuling, and Leapmotor. No dealer markup. No staged demonstrators. Cars leave the production line, ship to the CCH lot in Guangzhou, and are inspected before they are written into a contract.",
    bullets: [
      "Factory warranty preserved",
      "Latest 2026 models",
      "30 to 45 days delivery",
    ],
    cta: { href: "/lot?condition=new", label: "View new inventory" },
    image: {
      src: "/placeholders/inventory-new.svg",
      alt: "",
    },
  },
  {
    label: "Used",
    heading: "From the first owner.",
    paragraph:
      "Used stock is sourced direct from first owners in China. No auction lots. No rebadged write-offs. Every car is verified against its Chinese registration, road tested on the CCH lot, and shipped with a battery health report and the full service history.",
    bullets: [
      "First-owner verification",
      "Battery health report",
      "Full service history",
    ],
    cta: { href: "/lot?condition=used", label: "View used inventory" },
    image: {
      src: "/placeholders/inventory-used.svg",
      alt: "",
    },
  },
];

export function NewVsUsed() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-content px-6 py-16 md:py-24">
        <SectionHeader label="Our inventory" heading="Two paths. One standard of inspection." />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-hairline border-y border-hairline">
          {panels.map((panel, index) => (
            <article
              key={panel.label}
              className={
                "flex flex-col " +
                (index === 1 ? "border-t border-hairline md:border-t-0" : "")
              }
            >
              <div className="relative w-full aspect-video bg-surface-tint">
                <Image
                  src={panel.image.src}
                  alt={panel.image.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-6 p-8 md:p-12">
                <p className="text-meta text-cch-red">{panel.label}</p>
                <h3 className="font-display text-2xl font-medium leading-[1.2] tracking-[-0.01em] text-corporate-black">
                  {panel.heading}
                </h3>
                <p className="text-base leading-[1.6] text-text-secondary">
                  {panel.paragraph}
                </p>
                <ul className="flex flex-col gap-3 text-base leading-[1.5] text-corporate-black">
                  {panel.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-baseline gap-3"
                    >
                      <span
                        aria-hidden="true"
                        className="inline-block size-px shrink-0 translate-y-[0.55em] bg-cch-red"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-2">
                  <TertiaryLink href={panel.cta.href}>
                    {panel.cta.label}
                  </TertiaryLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
