import { CarentoBrands } from "@/components/home/CarentoBrands";
import { CarentoBrowseByType } from "@/components/home/CarentoBrowseByType";
import { CarentoCarReview } from "@/components/home/CarentoCarReview";
import { CarentoFaq } from "@/components/home/CarentoFaq";
import { CarentoHero } from "@/components/home/CarentoHero";
import { CarentoHowItWorks } from "@/components/home/CarentoHowItWorks";
import { CarentoInspection } from "@/components/home/CarentoInspection";
import { CarentoRequestForm } from "@/components/home/CarentoRequestForm";
import { CarentoSearchedCars } from "@/components/home/CarentoSearchedCars";
import { CarentoWhatsAppCta } from "@/components/home/CarentoWhatsAppCta";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function fetchBrandOptions() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("brands_sourced")
    .select("name")
    .eq("active", true)
    .order("order_index", { ascending: true });
  if (error) {
    console.error("[home] failed to load brands_sourced", error);
    return [] as string[];
  }
  return data.map((row) => row.name);
}

export default async function HomePage() {
  const brandOptions = await fetchBrandOptions();

  return (
    <>
      <CarentoHero />
      <CarentoBrands />
      <CarentoSearchedCars />
      <CarentoBrowseByType />
      <CarentoInspection />
      <CarentoHowItWorks />
      <CarentoRequestForm brandOptions={brandOptions} />
      <CarentoWhatsAppCta />
      <CarentoCarReview />
      <CarentoFaq />
    </>
  );
}
