"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "What documents do I need to provide?",
    answer:
      "A valid means of identification and your delivery information are usually enough to get started. We’ll guide you through the remaining process based on your destination country.",
  },
  {
    question: "How does payment work?",
    answer:
      "We require an initial $2,000 deposit to secure and begin processing your vehicle order. The remaining balance is paid once the car is ready for shipment and all inspection checks have been completed.",
  },
  {
    question: "How is the inspection carried out?",
    answer:
      "Every vehicle goes through a physical inspection on our Guangzhou lot, including battery diagnostics, accident checks, and a full walkaround video before shipment approval.",
  },
  {
    question: "How long does the process take?",
    answer:
      "Timelines depend on the vehicle and shipping method, but most orders are ready to ship within 7-10 days after confirmation.",
  },
];

export function CarentoFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-content px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-cch-red">
              Frequently Asked Questions
            </span>
            <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.1] tracking-tight text-corporate-black md:text-[44px]">
              Questions Buyers Commonly Ask
            </h2>
            <p className="mt-4 max-w-[360px] text-[14px] leading-[1.65] text-text-secondary">
              Everything you need to know before requesting a vehicle. Need more
              help? Reach out to us on WhatsApp.
            </p>
          </div>

          <ul className="divide-y divide-hairline border-y border-hairline">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <li key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-4 py-5 text-left transition-colors hover:text-cch-red"
                  >
                    <span className="text-[15px] font-medium leading-[1.45] text-corporate-black">
                      {faq.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "inline-flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors",
                        isOpen
                          ? "border-cch-red bg-cch-red text-white"
                          : "border-hairline text-corporate-black",
                      )}
                    >
                      {isOpen ? (
                        <Minus className="size-4" />
                      ) : (
                        <Plus className="size-4" />
                      )}
                    </span>
                  </button>
                  {isOpen ? (
                    <p className="pb-5 pr-12 text-[14px] leading-[1.65] text-text-secondary">
                      {faq.answer}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
