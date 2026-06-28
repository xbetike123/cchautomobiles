"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type Faq = {
  question: string;
  answer: string;
};

type FaqCategory = {
  title: string;
  blurb: string;
  faqs: Faq[];
};

const CATEGORIES: FaqCategory[] = [
  {
    title: "Ordering & Payment",
    blurb: "How a request becomes a confirmed order.",
    faqs: [
      {
        question: "How do I start an order?",
        answer:
          "Pick a car from the lot or tell us the model you want, and we'll confirm availability, condition, and a full landed price. Once you're happy, a deposit secures the unit and we begin processing.",
      },
      {
        question: "How does payment work?",
        answer:
          "We require an initial $2,000 deposit to secure and begin processing your vehicle order. The remaining balance is paid once the car is ready for shipment and all inspection checks have been completed.",
      },
      {
        question: "Is the deposit refundable?",
        answer:
          "If we can't source the agreed vehicle or it fails inspection and you don't want a replacement, your deposit is refunded. Once a specific unit has been secured and processing has started, the deposit covers that work.",
      },
      {
        question: "What's included in the price you quote?",
        answer:
          "We quote a clear landed cost so there are no surprises — the vehicle, inspection, documentation, and shipping to your destination port. Local duties and clearing at your end are handled separately and we tell you what to expect upfront.",
      },
    ],
  },
  {
    title: "Inspection & Quality",
    blurb: "How we verify every car before it ships.",
    faqs: [
      {
        question: "How is the inspection carried out?",
        answer:
          "Every vehicle goes through a physical inspection on our Guangzhou lot, including battery diagnostics, accident checks, and a full walkaround video before shipment approval.",
      },
      {
        question: "Will I see the actual car before I pay the balance?",
        answer:
          "Yes. You receive photos and a full walkaround video of your specific unit — not a stock image — along with the inspection report before the balance is due.",
      },
      {
        question: "Do you sell used cars too, and how are they checked?",
        answer:
          "We offer both new and carefully selected used vehicles sourced from first owners. Used units get the same physical inspection, battery health check, and accident-history review before we list or ship them.",
      },
      {
        question: "What if the car isn't as described when it arrives?",
        answer:
          "Because every unit is inspected and documented before shipment, surprises are rare. If something doesn't match the report we provided, contact us and we'll make it right.",
      },
    ],
  },
  {
    title: "Shipping & Delivery",
    blurb: "Timelines and how your car reaches you.",
    faqs: [
      {
        question: "How long does the process take?",
        answer:
          "Timelines depend on the vehicle and shipping method, but most orders are ready to ship within 7-10 days after confirmation. Sea transit time then varies by destination, and we keep you updated at each stage.",
      },
      {
        question: "Which countries do you ship to?",
        answer:
          "We ship across Africa directly from our Guangzhou lot. Tell us your destination and we'll confirm the route, port, and timeline before you commit.",
      },
      {
        question: "Can I track my order while it's in transit?",
        answer:
          "Yes. You have one point of contact from request to delivery who keeps you posted on inspection, shipment, and arrival — no chasing middlemen.",
      },
    ],
  },
  {
    title: "Documents & Compliance",
    blurb: "What's needed to import cleanly.",
    faqs: [
      {
        question: "What documents do I need to provide?",
        answer:
          "A valid means of identification and your delivery information are usually enough to get started. We'll guide you through the remaining process based on your destination country.",
      },
      {
        question: "What paperwork do I receive with the car?",
        answer:
          "You receive the full set of export and shipping documents needed for clearing at your destination, along with the inspection report for your records.",
      },
      {
        question: "Are electric vehicles allowed in my country?",
        answer:
          "EV import rules vary by country and change over time. We'll confirm what applies to your destination before you order so there are no compliance surprises on arrival.",
      },
    ],
  },
];

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: Faq;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
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
          {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
        </span>
      </button>
      {isOpen ? (
        <p className="pb-5 pr-12 text-[14px] leading-[1.65] text-text-secondary">
          {faq.answer}
        </p>
      ) : null}
    </li>
  );
}

export function FaqList() {
  const [openKey, setOpenKey] = useState<string | null>("0-0");

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto flex max-w-content flex-col gap-16 px-6">
        {CATEGORIES.map((category, categoryIdx) => (
          <div
            key={category.title}
            className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20"
          >
            <div>
              <h2 className="font-display text-[28px] font-bold leading-[1.1] tracking-tight text-corporate-black md:text-[34px]">
                {category.title}
              </h2>
              <p className="mt-4 max-w-[360px] text-[14px] leading-[1.65] text-text-secondary">
                {category.blurb}
              </p>
            </div>

            <ul className="divide-y divide-hairline border-y border-hairline">
              {category.faqs.map((faq, faqIdx) => {
                const key = `${categoryIdx}-${faqIdx}`;
                return (
                  <AccordionItem
                    key={faq.question}
                    faq={faq}
                    isOpen={openKey === key}
                    onToggle={() =>
                      setOpenKey((current) => (current === key ? null : key))
                    }
                  />
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
