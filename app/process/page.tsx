import type { Metadata } from "next";

import { ClosingCta } from "@/components/marketing/solutions/ClosingCta";
import { ProcessSteps } from "@/components/process/ProcessSteps";
import { WhyCch } from "@/components/process/WhyCch";

export const metadata: Metadata = {
  title: "How to Buy a Car — CCH Automobile",
  description:
    "A simple, step-by-step guide to buying new or clean used vehicles from China — from your first request through inspection, export, and delivery to your destination.",
};

export default function HowToBuyPage() {
  return (
    <main className="flex-1">
      <ProcessSteps />
      <WhyCch />
      <ClosingCta />
    </main>
  );
}
