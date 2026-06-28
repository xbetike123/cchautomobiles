import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CarHero } from "@/components/inventory/CarHero";
import { FullSpecs } from "@/components/inventory/FullSpecs";
import { Gallery } from "@/components/inventory/Gallery";
import { LandedCostCta } from "@/components/inventory/LandedCostCta";
import { PriceCard } from "@/components/inventory/PriceCard";
import { SpecTable } from "@/components/inventory/SpecTable";
import { Walkaround } from "@/components/inventory/Walkaround";
import { getCarBySlug } from "@/lib/queries/inventory";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) {
    return {
      title: "Car not found · CCH Automobile",
      description: "This vehicle is no longer on the CCH lot.",
    };
  }
  const title = `${car.year} ${car.brand} ${car.model} · CCH Automobile`;
  const description = `${car.condition === "new" ? "New from the factory" : "First-owner used"}. Inspected and filmed on the CCH lot in Guangzhou. FOB from $${car.price_usd_fob.toLocaleString("en-US")}.`;
  return { title, description };
}

export default async function CarDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) notFound();

  return (
    <>
      <CarHero car={car} />

      <section className="bg-background">
        <div className="mx-auto max-w-content px-6 py-10 md:py-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h1 className="font-display text-[28px] font-semibold leading-tight tracking-[-0.02em] text-corporate-black md:text-[36px]">
                {car.brand} {car.model}
              </h1>
              <p className="mt-2 text-[15px] text-text-secondary">
                {car.year}
                {car.body_type ? ` · ${car.body_type}` : ""}
                {car.condition === "used" && car.owner_count != null
                  ? ` · ${car.owner_count} prior owner${car.owner_count === 1 ? "" : "s"}`
                  : ""}
              </p>

              <div className="mt-8">
                <SpecTable car={car} />
              </div>
            </div>

            <div className="lg:col-span-4">
              <PriceCard car={car} />
            </div>
          </div>
        </div>
      </section>

      <Walkaround car={car} />
      <Gallery car={car} />
      <FullSpecs car={car} />
      <LandedCostCta car={car} />
    </>
  );
}
