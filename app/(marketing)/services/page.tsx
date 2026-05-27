import type { Metadata } from "next";

import { HowItWorks } from "@/components/home/HowItWorks";
import { ClosingCta } from "@/components/marketing/solutions/ClosingCta";
import { WhyCCH } from "@/components/marketing/solutions/WhyCCH";
import { AddOns } from "@/components/marketing/services/AddOns";
import { PricingNote } from "@/components/marketing/services/PricingNote";
import { ServicesHero } from "@/components/marketing/services/ServicesHero";
import { ServicesList } from "@/components/marketing/services/ServicesList";

export const metadata: Metadata = {
  title: "Services · CCH Automobile",
  description:
    "Sourcing, inspection, export, shipping, customs, and after-sales — handled in-house from our Guangzhou lot.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesList />
      <AddOns />
      <WhyCCH
        eyebrow="The CCH Difference"
        heading="Built into every order."
      />
      <HowItWorks />
      <PricingNote />
      <ClosingCta />
    </>
  );
}
