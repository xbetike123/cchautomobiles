import type { Metadata } from "next";

import { FaqHero } from "@/components/faq/FaqHero";
import { FaqList } from "@/components/faq/FaqList";
import { ClosingCta } from "@/components/marketing/solutions/ClosingCta";

export const metadata: Metadata = {
  title: "FAQ — CCH Automobile",
  description:
    "Answers to common questions about ordering, payment, inspection, shipping, and documentation when importing clean Chinese vehicles directly from our Guangzhou lot.",
};

export default function FaqPage() {
  return (
    <>
      <FaqHero />
      <FaqList />
      <ClosingCta />
    </>
  );
}
