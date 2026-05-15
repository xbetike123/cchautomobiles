import Image from "next/image";

import { SectionHeader } from "@/components/site/SectionHeader";
import { TertiaryLink } from "@/components/site/TertiaryLink";
import { cn } from "@/lib/utils";

type Step = {
  number: string;
  name: string;
  description: string;
};

const leftSteps: Step[] = [
  {
    number: "01",
    name: "Identify",
    description: "You tell us the use case, budget, and timeline.",
  },
  {
    number: "02",
    name: "Deposit",
    description: "Refundable deposit secures a shortlist for the week.",
  },
  {
    number: "03",
    name: "Source",
    description: "We negotiate direct with the factory or the first owner.",
  },
];

const rightSteps: Step[] = [
  {
    number: "04",
    name: "Inspect",
    description: "Each car is inspected and filmed on our Guangzhou lot.",
  },
  {
    number: "05",
    name: "Document",
    description: "Export paperwork, battery passport, and customs files.",
  },
  {
    number: "06",
    name: "Deliver",
    description: "Roll-on roll-off to Lagos, Tema, Cotonou, or Dakar.",
  },
];

function StepBlock({
  step,
  align,
}: {
  step: Step;
  align: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        align === "right" ? "md:items-end md:text-right" : "md:items-start",
      )}
    >
      <p className="text-[13px] font-medium leading-none text-cch-red">
        {step.number}
      </p>
      <p className="text-base font-medium leading-tight text-corporate-black">
        {step.name}
      </p>
      <p className="text-[13px] leading-[1.5] text-text-secondary">
        {step.description}
      </p>
    </div>
  );
}

export function ProcessDiagram() {
  return (
    <section className="bg-surface-tint">
      <div className="mx-auto max-w-content px-6 py-16 md:py-24">
        <SectionHeader
          label="Our process"
          heading="Six steps. Fully transparent."
          description="You see your car at every stage, from the Guangzhou lot to the port in Lagos."
        />

        {/* Mobile: vertical list with car at top */}
        <div className="mt-12 flex flex-col gap-8 md:hidden">
          <div className="flex items-center justify-center">
            <Image
              src="/icons/car-silhouette.svg"
              alt=""
              width={260}
              height={130}
              className="opacity-80"
            />
          </div>
          <ol className="flex flex-col gap-6 border-t border-hairline pt-6">
            {[...leftSteps, ...rightSteps].map((step) => (
              <li key={step.number} className="flex gap-4">
                <span className="w-8 shrink-0 text-[13px] font-medium leading-none text-cch-red">
                  {step.number}
                </span>
                <div className="flex flex-col gap-1.5">
                  <p className="text-base font-medium leading-tight text-corporate-black">
                    {step.name}
                  </p>
                  <p className="text-[13px] leading-[1.5] text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Desktop: six steps around the car silhouette */}
        <div className="mt-16 hidden md:grid md:grid-cols-[1fr_64px_220px_64px_1fr] md:grid-rows-3 md:gap-y-12">
          {leftSteps.map((step, rowIndex) => (
            <div
              key={step.number}
              className="contents"
            >
              <div
                className="col-start-1"
                style={{ gridRowStart: rowIndex + 1 }}
              >
                <StepBlock step={step} align="right" />
              </div>
              <div
                className="col-start-2 self-center"
                style={{ gridRowStart: rowIndex + 1 }}
                aria-hidden="true"
              >
                <div className="h-px w-full bg-hairline" />
              </div>
            </div>
          ))}
          <div className="col-start-3 row-span-3 flex items-center justify-center self-stretch">
            <Image
              src="/icons/car-silhouette.svg"
              alt=""
              width={220}
              height={110}
              className="w-full max-w-[220px]"
            />
          </div>
          {rightSteps.map((step, rowIndex) => (
            <div key={step.number} className="contents">
              <div
                className="col-start-4 self-center"
                style={{ gridRowStart: rowIndex + 1 }}
                aria-hidden="true"
              >
                <div className="h-px w-full bg-hairline" />
              </div>
              <div
                className="col-start-5"
                style={{ gridRowStart: rowIndex + 1 }}
              >
                <StepBlock step={step} align="left" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <TertiaryLink href="/process">See the full process</TertiaryLink>
        </div>
      </div>
    </section>
  );
}
