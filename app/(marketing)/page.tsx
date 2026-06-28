import { CarentoBrands } from "@/components/home/CarentoBrands";
import { CarentoBrowseByType } from "@/components/home/CarentoBrowseByType";
import { CarentoCarReview } from "@/components/home/CarentoCarReview";
import { CarentoFaq } from "@/components/home/CarentoFaq";
import { CarentoHero } from "@/components/home/CarentoHero";
import { CarentoHowItWorks } from "@/components/home/CarentoHowItWorks";
import { CarentoInspection } from "@/components/home/CarentoInspection";
import { CarentoSearchedCars } from "@/components/home/CarentoSearchedCars";
import { CarentoWhatsAppCta } from "@/components/home/CarentoWhatsAppCta";

export default function HomePage() {
  return (
    <>
      <CarentoHero />
      <CarentoBrands />
      <CarentoSearchedCars />
      <CarentoBrowseByType />
      <CarentoInspection />
      <CarentoHowItWorks />
      <CarentoWhatsAppCta />
      <CarentoCarReview />
      <CarentoFaq />
    </>
  );
}
