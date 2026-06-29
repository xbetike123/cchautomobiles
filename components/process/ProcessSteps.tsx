"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Car, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

type Step = {
  title: string;
  description: string;
};

type Track = {
  id: "new" | "used";
  label: string;
  icon: typeof Car;
  blurb: string;
  steps: Step[];
};

const TRACKS: Track[] = [
  {
    id: "new",
    label: "New Vehicles",
    icon: Car,
    blurb: "Straight from manufacturers and authorized dealers.",
    steps: [
      {
        title: "Request a Vehicle",
        description:
          "Tell us the vehicle you're looking for, your budget, destination country, and preferred timeline.",
      },
      {
        title: "Availability Check",
        description:
          "We confirm availability, specifications, pricing, and estimated delivery timelines with the manufacturer or authorized dealer.",
      },
      {
        title: "Receive Your Quotation",
        description:
          "We'll send you the confirmed vehicle details, quotation, shipping estimate, and payment instructions.",
      },
      {
        title: "Confirm Your Order",
        description:
          "Once full payment is received, we secure your vehicle and place the order with the manufacturer or authorized dealer.",
      },
      {
        title: "Vehicle Preparation",
        description:
          "We monitor your order and keep you updated throughout the production or preparation process.",
      },
      {
        title: "Inspection & Verification",
        description:
          "Before export, we verify the vehicle and provide photos, videos, and a final condition update.",
      },
      {
        title: "Export & Shipping",
        description:
          "We complete the export documentation and arrange international shipping to your destination.",
      },
      {
        title: "Delivery",
        description:
          "Your vehicle arrives at the destination port, ready for customs clearance and collection.",
      },
    ],
  },
  {
    id: "used",
    label: "Clean Used Vehicles",
    icon: ShieldCheck,
    blurb: "Inspected units from trusted dealers and first owners.",
    steps: [
      {
        title: "Request a Vehicle",
        description:
          "Tell us the make, model, budget, destination country, and any specific requirements.",
      },
      {
        title: "Vehicle Search",
        description:
          "We first check our inventory of over 800 export-ready vehicles. If we don't have a suitable match, we'll search our network of over 20,000 verified vehicles across China.",
      },
      {
        title: "Receive Your Options",
        description:
          "We'll send you the available vehicle details, including mileage, condition, specifications, pricing, and estimated shipping costs.",
      },
      {
        title: "Secure Your Vehicle",
        description:
          "If the vehicle is already in our inventory, you can proceed with full payment. If it's sourced from our nationwide network, a deposit secures the vehicle and allows us to bring it to our facility for inspection.",
      },
      {
        title: "Professional Inspection",
        description:
          "Our team carries out a comprehensive inspection, verifying the mileage, engine or battery, paintwork, overall condition, and ensuring the vehicle matches its description. We then send you the full inspection report, along with photos and videos.",
      },
      {
        title: "Complete Payment",
        description:
          "Once you're satisfied with the inspection, you complete the remaining balance (if applicable).",
      },
      {
        title: "Export & Shipping",
        description:
          "We prepare the export documentation and arrange international shipping to your destination.",
      },
      {
        title: "Delivery",
        description:
          "Your vehicle arrives at the destination port, ready for customs clearance and collection.",
      },
    ],
  },
];

export function ProcessSteps() {
  const [activeId, setActiveId] = useState<Track["id"]>("new");
  const active = TRACKS.find((t) => t.id === activeId) ?? TRACKS[0];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-content px-6">
        {/* Choose first — keeps the page short and mobile-friendly. */}
        <div className="flex flex-col items-center text-center">
          <h2 className="font-display text-[26px] font-bold leading-[1.1] tracking-tight text-corporate-black md:text-[32px]">
            What are you buying?
          </h2>
          <p className="mt-3 max-w-[420px] text-[14px] leading-[1.6] text-text-secondary">
            Choose an option below to see exactly how the buying process works.
          </p>

          <div
            role="tablist"
            aria-label="Vehicle type"
            className="mt-7 grid w-full max-w-[440px] grid-cols-2 gap-2 rounded-full border border-hairline/70 bg-surface-tint/70 p-1.5"
          >
            {TRACKS.map((track) => {
              const Icon = track.icon;
              const isActive = track.id === activeId;
              return (
                <button
                  key={track.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(track.id)}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-[13.5px] font-semibold leading-none transition-all duration-200",
                    isActive
                      ? "bg-cch-red text-white shadow-[0_8px_18px_rgba(230,57,70,0.32)]"
                      : "text-text-secondary hover:bg-white hover:text-corporate-black",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {track.label}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-[13px] font-medium text-text-secondary">
            {active.blurb}
          </p>
        </div>

        {/* Steps timeline */}
        <AnimatePresence mode="wait">
          <motion.ol
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative mx-auto mt-12 max-w-[680px] space-y-7 border-l border-hairline pl-0"
          >
            {active.steps.map((step, idx) => (
              <li key={step.title} className="relative pl-12 sm:pl-14">
                <span
                  aria-hidden="true"
                  className="absolute -left-[18px] top-0 inline-flex size-9 items-center justify-center rounded-full border-2 border-white bg-cch-red text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(230,57,70,0.28)]"
                >
                  {idx + 1}
                </span>
                <h3 className="text-[16px] font-semibold leading-[1.3] text-corporate-black md:text-[17px]">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-text-secondary">
                  {step.description}
                </p>
              </li>
            ))}
          </motion.ol>
        </AnimatePresence>

        <div className="mt-12 flex justify-center">
          <Link
            href="/request"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-cch-red px-7 py-3.5 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(230,57,70,0.28)] transition-colors hover:bg-cch-red-hover"
          >
            Get Started
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
