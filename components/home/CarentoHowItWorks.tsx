import { HandCoins, Search, Send, Truck } from "lucide-react";

const STEPS = [
  {
    Icon: Send,
    title: "Request a Car",
    description:
      "Tell us your brand, model, and budget. A CCH operator confirms what's possible within 24 hours.",
  },
  {
    Icon: Search,
    title: "Sourced in Guangzhou",
    description:
      "Our team finds the car, films a full walkaround, and inspects it on our lot before you commit.",
  },
  {
    Icon: HandCoins,
    title: "Confirm & Pay",
    description:
      "Review the inspection, agree on the landed cost, and pay your deposit to lock the car in.",
  },
  {
    Icon: Truck,
    title: "Shipped to You",
    description:
      "We handle export, shipping, and port clearance so you collect at your destination.",
  },
];

export function CarentoHowItWorks() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="flex flex-col items-center text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cch-red">
            How It Works
          </span>
          <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.1] tracking-tight text-corporate-black md:text-[52px]">
            From Desire to Your Driveway
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 md:mt-20 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center"
            >
              <step.Icon
                className="size-12 text-corporate-black"
                strokeWidth={1.4}
                aria-hidden="true"
              />
              <h3 className="mt-6 text-[18px] font-semibold text-corporate-black">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[240px] text-[13.5px] leading-[1.6] text-text-secondary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
