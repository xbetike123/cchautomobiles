import type { Metadata } from "next";

import { FounderHero } from "@/components/about/FounderHero";
import { InspectionPromise } from "@/components/about/InspectionPromise";
import { OfficeGallery } from "@/components/about/OfficeGallery";
import { OurStory } from "@/components/about/OurStory";
import { ClosingCta } from "@/components/marketing/solutions/ClosingCta";

export const metadata: Metadata = {
  title: "About — CCH Automobile",
  description:
    "CCH Automobile is the automobile division of Naiyuan Mart Ltd. We help Nigerians source clean, unaccidented electric vehicles directly from China — with inspection, verification, and full reporting before payment.",
};

export default function AboutPage() {
  return (
    <>
      <FounderHero />
      <OurStory />
      <InspectionPromise />
      <OfficeGallery />
      <ClosingCta />
    </>
  );
}
