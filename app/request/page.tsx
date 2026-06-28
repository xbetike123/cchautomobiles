import type { Metadata } from "next";
import { submitQuoteRequest } from "@/app/request/actions";
import { RequestForm } from "@/components/request/RequestForm";
import { env } from "@/lib/env";
import { getCarBySlug } from "@/lib/queries/inventory";

export const metadata: Metadata = {
  title: "Request a car — CCH Automobile",
  description:
    "Tell us what you're looking for. We send a shortlist from this week's Guangzhou lot within 24 hours, on WhatsApp or by email.",
};

type SearchParams = Promise<{ car?: string }>;

export default async function RequestPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { car: carSlug } = await searchParams;
  const car = carSlug ? await getCarBySlug(carSlug) : null;
  const aboutCar = car
    ? {
        slug: car.slug,
        label: `${car.year} ${car.brand} ${car.model}`,
        year: car.year,
        brand: car.brand,
        model: car.model,
        condition: car.condition === "new" ? ("new" as const) : ("used" as const),
        bodyType: car.body_type,
        priceUsdFob: car.price_usd_fob,
        heroImageUrl:
          car.hero_image_url ?? "/placeholders/inventory-card.svg",
      }
    : null;

  const headerLabel = aboutCar ? "Request this car" : "Request form";
  const headerTitle = aboutCar
    ? "Send us your details."
    : "Let’s Find the Right Car for You";
  const headerBody = aboutCar
    ? `We’ll come back within 24 hours with full pricing and shipping to your port on WhatsApp or by email.`
    : `Tell us what you’re looking for and we’ll send you the best available vehicle options, detailed specifications, pricing, and export information within 24 hours.`;

  return (
    <main className="mx-auto max-w-[640px] px-6 py-16 md:py-24">
      <div className="mb-12 text-center">
        <div className="mx-auto h-6 w-[2px] bg-cch-red" aria-hidden />
        <p className="mt-4 text-meta text-cch-red">{headerLabel}</p>
        <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-corporate-black md:text-[44px]">
          {headerTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-[460px] text-[15px] leading-relaxed text-text-secondary">
          {headerBody}
        </p>
      </div>
      <RequestForm
        submit={submitQuoteRequest}
        whatsappContact={env.WHATSAPP_OPERATIONS_NUMBER ?? null}
        aboutCar={aboutCar}
      />
    </main>
  );
}
