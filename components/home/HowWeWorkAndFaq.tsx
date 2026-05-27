"use client";

import { ArrowRight, Minus, Plus } from "lucide-react";
import { useState } from "react";

import { SectionMarker } from "@/components/site/SectionMarker";
import { cn } from "@/lib/utils";

type Step = {
  number: string;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    number: "01",
    title: "Choose a car",
    description: "Tell us your spec, budget, and timeline.",
  },
  {
    number: "02",
    title: "Inspection and approval",
    description: "We inspect, film, and confirm condition with you.",
  },
  {
    number: "03",
    title: "Paperwork and invoice",
    description: "Export documents and a transparent invoice are issued.",
  },
  {
    number: "04",
    title: "Delivery",
    description: "We ship and clear the unit at your destination port.",
  },
];

type Faq = {
  question: string;
  answer: string;
};

const faqs: Faq[] = [
  {
    question: "What documents do I need to provide?",
    answer:
      "A valid ID, your shipping address, and your destination port. For corporate buyers we also need the company registration. Everything else (export paperwork, customs forms, battery passport) is handled by us.",
  },
  {
    question: "Can I finance the order or apply for leasing?",
    answer:
      "Yes. We work with partner banks and leasing companies across West Africa. Once you choose a car, we walk you through the available options based on your destination country.",
  },
  {
    question: "How is the inspection carried out?",
    answer:
      "Every car goes through a 150-point inspection at our Guangzhou lot. We film a walkaround for you, run the battery diagnostic, and you sign off before the balance is due.",
  },
  {
    question: "How long does the order take?",
    answer:
      "New cars from the factory: 30 to 45 days. Used cars from first owners: 14 to 21 days from sign-off. Shipping adds 25 to 35 days depending on the destination port.",
  },
];

export function HowWeWorkAndFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-t border-hairline bg-white">
      <div className="mx-auto max-w-content px-6 py-20 md:py-24">
        <SectionMarker number="05" label="Process / FAQ" className="mb-10" />
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-[32px] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[44px]">
              How we work.
            </h2>
            <p className="mt-4 max-w-[440px] text-[14px] leading-[1.6] text-text-secondary">
              Four clear stages from first request to your driveway. Each stage
              is handled by the same team — no hand-offs, no missing files.
            </p>

            <ol className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[6px] border border-hairline bg-hairline sm:grid-cols-2">
              {steps.map((step, idx) => (
                <li
                  key={step.number}
                  className="relative flex flex-col gap-3 bg-white p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cch-red">
                      {step.number}
                    </span>
                    {idx < steps.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="text-text-tertiary/70"
                      >
                        <ArrowRight className="size-4" />
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[14px] font-semibold leading-tight text-corporate-black">
                    {step.title}
                  </p>
                  <p className="text-[12.5px] leading-[1.55] text-text-secondary">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="font-display text-[32px] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[44px]">
              Frequently asked questions.
            </h2>
            <p className="mt-4 max-w-[440px] text-[14px] leading-[1.6] text-text-secondary">
              Still have questions? Our team is one call or message away.
            </p>

            <ul className="mt-10 divide-y divide-hairline border-y border-hairline">
              {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <li key={faq.question}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-4 py-5 text-left transition-colors hover:text-cch-red"
                    >
                      <span className="text-[14.5px] font-medium leading-[1.45] text-corporate-black">
                        {faq.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "inline-flex size-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                          isOpen
                            ? "border-cch-red bg-cch-red text-white"
                            : "border-hairline text-corporate-black",
                        )}
                      >
                        {isOpen ? (
                          <Minus className="size-3.5" />
                        ) : (
                          <Plus className="size-3.5" />
                        )}
                      </span>
                    </button>
                    {isOpen ? (
                      <p className="pb-5 pr-12 text-[13.5px] leading-[1.65] text-text-secondary">
                        {faq.answer}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
