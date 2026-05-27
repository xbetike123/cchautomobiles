import type { Metadata } from "next";

import { HowItWorks } from "@/components/home/HowItWorks";
import { ClosingCta } from "@/components/marketing/solutions/ClosingCta";
import { SolutionCards } from "@/components/marketing/solutions/SolutionCards";
import { SolutionsHero } from "@/components/marketing/solutions/SolutionsHero";
import { WhyCCH } from "@/components/marketing/solutions/WhyCCH";

export const metadata: Metadata = {
  title: "Solutions · CCH Automobile",
  description:
    "Sourcing solutions for individual buyers, dealers, fleet operators, and first-time importers — direct from the Guangzhou lot.",
};

export default function SolutionsPage() {
  return (
    <>
      <SolutionsHero />
      <SolutionCards />
      <WhyCCH />
      <HowItWorks />
      <ClosingCta />
    </>
  );
}
