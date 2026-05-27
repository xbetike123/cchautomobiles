import { Check } from "lucide-react";

type Service = {
  number: string;
  title: string;
  description: string;
  bullets: string[];
};

const SERVICES: Service[] = [
  {
    number: "01",
    title: "Sourcing",
    description:
      "Direct factory-desk access to BYD, Geely, Zeekr, Xpeng, and Leapmotor. First-owner used cars from the Guangzhou lot. Shortlisted to your spec, budget, and destination port.",
    bullets: [
      "Factory-direct allocation on new units",
      "Verified first-owner used inventory",
      "Three to five matched options per request",
      "Quote returned within 24 hours",
    ],
  },
  {
    number: "02",
    title: "Inspection & Verification",
    description:
      "Every car filmed and inspected before payment. EVs run through battery health diagnostics. Paperwork audited against manufacturer records.",
    bullets: [
      "On-camera walk-through from the lot",
      "Manufacturer channel verification",
      "Battery health check (EVs)",
      "Pre-export paperwork audit",
    ],
  },
  {
    number: "03",
    title: "Export & Documentation",
    description:
      "All export paperwork prepared in-house. Filed correctly the first time, matched to your destination country's requirements.",
    bullets: [
      "Bill of lading",
      "Commercial invoice",
      "Certificate of origin",
      "Export permit and customs declaration",
      "KYC and port documentation",
    ],
  },
  {
    number: "04",
    title: "Shipping",
    description:
      "RoRo or container, port-to-port across Africa. Weekly sailing slots from Guangzhou and Shanghai. Major African ports served directly.",
    bullets: [
      "Roll-on roll-off (RoRo) for single units",
      "Container shipping for multi-unit orders",
      "Direct lanes to Lagos, Tema, Mombasa, Dar es Salaam, Douala, Abidjan",
      "Tracking from port of loading to port of discharge",
    ],
  },
  {
    number: "05",
    title: "Customs & Delivery Coordination",
    description:
      "Clearing agent handoff at destination. Coordination with your pickup contact in Africa so the car moves without sitting at the port.",
    bullets: [
      "Pre-arrival documentation to your clearing agent",
      "Local agent referrals where needed",
      "Delivery contact coordination",
      "Status updates through clearance",
    ],
  },
  {
    number: "06",
    title: "After-Sales Support",
    description:
      "The relationship doesn't end at the port. Warranty registration, battery passport handover, and spare parts sourcing when you need them.",
    bullets: [
      "Warranty registration with manufacturer",
      "Battery passport handover (EVs)",
      "Spare parts sourcing on request",
      "Repeat order priority for returning clients",
    ],
  },
];

export function ServicesList() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <header className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cch-red">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-cch-red" />
            Services
          </span>
          <h2 className="mt-4 max-w-[680px] font-display text-[28px] font-semibold tracking-[-0.02em] text-corporate-black md:text-[40px]">
            Six in-house services. One paper trail.
          </h2>
        </header>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {SERVICES.map((service) => (
            <article
              key={service.number}
              className="flex h-full flex-col rounded-card-lg border border-hairline bg-white p-7 transition-shadow hover:shadow-[var(--shadow-card)]"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display text-[34px] font-semibold leading-none text-cch-red/85">
                  {service.number}
                </span>
                <h3 className="font-display text-[20px] font-semibold leading-tight tracking-tight text-corporate-black">
                  {service.title}
                </h3>
              </div>
              <p className="mt-4 text-[14px] leading-[1.65] text-text-secondary">
                {service.description}
              </p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {service.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-corporate-black/85"
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-cch-red-soft text-cch-red"
                    >
                      <Check className="size-2.5" strokeWidth={3} />
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="mt-6 inline-flex w-fit items-center rounded-full bg-corporate-black/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-corporate-black/70">
                Included in every order
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
