import Image from "next/image";

import { SectionMarker } from "@/components/site/SectionMarker";

type Step = {
  number: string;
  name: string;
  description: string;
};

const CAR_IMAGE = "/types/360x0_c42_autohomecar__ChxoHmXVw2qAaWiuAAg1C-bg8-c383.avif";

const leftSteps: Step[] = [
  {
    number: "Step 1",
    name: "Place Your Car Request",
    description:
      "Tell us the make, model, year, and budget. New from the factory or used from the first owner, you pick the route.",
  },
  {
    number: "Step 2",
    name: "Receive Your Quote",
    description:
      "We shortlist matching cars from the Guangzhou lot, filmed and inspected, and send a full quote within 24 hours.",
  },
  {
    number: "Step 3",
    name: "Pay Deposit",
    description:
      "Lock in your chosen unit with a deposit. Paperwork begins and the car is reserved in your name.",
  },
];

const rightSteps: Step[] = [
  {
    number: "Step 4",
    name: "Car Prepped for Shipping",
    description:
      "We prep the vehicle: inspection, cleaning, and any extras you've added (charger, spare battery, ceramic coat). You see it before it moves.",
  },
  {
    number: "Step 5",
    name: "Pay Balance & Export Cleared",
    description:
      "Settle the balance. Export documents are filed, and the car is booked onto the next available slot, RoRo or container.",
  },
  {
    number: "Step 6",
    name: "Shipped, Cleared & Delivered",
    description:
      "Your car sails, clears customs, and is delivered to your doorstep within 6 to 8 weeks.",
  },
];

function StepBlock({ step, align }: { step: Step; align: "left" | "right" }) {
  return (
    <div
      className={`flex flex-col gap-1.5 ${align === "right" ? "md:items-end md:text-right" : "md:items-start"}`}
    >
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-cch-red">
        {step.number}
      </p>
      <p className="text-[15px] font-semibold leading-tight text-corporate-black">
        {step.name}
      </p>
      <p className="max-w-[260px] text-[13px] leading-[1.55] text-text-secondary">
        {step.description}
      </p>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden border-t border-hairline bg-white"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[55%] -translate-y-1/2 select-none text-center font-display font-bold uppercase tracking-[-0.04em] text-corporate-black/[0.035] text-[24vw] leading-none whitespace-nowrap"
      >
        Process
      </span>
      <div className="relative mx-auto max-w-content px-6 py-20 md:py-24">
        <SectionMarker number="06" label="Process" className="mb-12" />
        <header className="flex flex-col items-center text-center">
          <h2 className="font-display text-[36px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[64px]">
            How it Works
          </h2>
          <p className="mt-3 max-w-[560px] text-[14px] leading-[1.6] text-text-secondary">
            From first request to doorstep delivery in six clear steps.
            Transparent at every stage.
          </p>
        </header>

        <div className="mt-12 flex flex-col gap-8 md:hidden">
          <div className="overflow-hidden rounded-card-lg border border-hairline bg-white p-6">
            <Image
              src={CAR_IMAGE}
              alt=""
              width={400}
              height={240}
              className="mx-auto h-auto w-full max-w-[320px] motion-safe:animate-spin"
              style={{ animationDuration: "30s" }}
            />
          </div>
          <ol className="flex flex-col gap-6">
            {[...leftSteps, ...rightSteps].map((step) => (
              <li
                key={step.number}
                className="flex gap-4 rounded-card border border-hairline bg-white p-5"
              >
                <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-cch-red">
                  {step.number}
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-corporate-black">
                    {step.name}
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.55] text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative mt-16 hidden md:grid md:grid-cols-[1fr_360px_1fr] md:grid-rows-3 md:gap-x-24 md:gap-y-14">
          {leftSteps.map((step, idx) => (
            <div
              key={step.number}
              className="flex items-center justify-end col-start-1"
              style={{ gridRowStart: idx + 1 }}
            >
              <StepBlock step={step} align="right" />
            </div>
          ))}

          <div className="col-start-2 row-span-3 flex items-center justify-center">
            <div className="relative w-full overflow-hidden rounded-card-lg border border-hairline bg-white p-6">
              <Image
                src={CAR_IMAGE}
                alt=""
                width={400}
                height={240}
                className="h-auto w-full object-contain motion-safe:animate-spin"
                style={{ animationDuration: "30s" }}
              />
            </div>
          </div>

          {rightSteps.map((step, idx) => (
            <div
              key={step.number}
              className="flex items-center justify-start col-start-3"
              style={{ gridRowStart: idx + 1 }}
            >
              <StepBlock step={step} align="left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
