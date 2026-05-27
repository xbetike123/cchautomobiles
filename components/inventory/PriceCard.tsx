import { Download } from "lucide-react";
import Link from "next/link";

import { PlaceOrderCta } from "@/components/site/PlaceOrderCta";
import type { InventoryRow } from "@/lib/queries/inventory";
import { cn } from "@/lib/utils";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const WHATSAPP_PLACEHOLDER = "https://wa.me/0000000000";

type Props = {
  car: InventoryRow;
};

export function PriceCard({ car }: Props) {
  const price = usdFormatter.format(car.price_usd_fob);
  const title = `${car.year} ${car.brand} ${car.model}`;
  const whatsappHref = `${WHATSAPP_PLACEHOLDER}?text=${encodeURIComponent(
    `Hi CCH, I want to ask about ${title} (FOB ${price}).`,
  )}`;

  return (
    <aside className="rounded-card-lg border border-hairline bg-white p-6 shadow-[var(--shadow-card)] lg:sticky lg:top-24">
      <p className="text-meta text-cch-red">
        {car.condition === "new" ? "New · from factory" : "Used · first owner"}
      </p>
      <p className="mt-3 font-display text-[32px] font-semibold leading-none text-corporate-black">
        {price}
      </p>
      <p className="mt-2 text-[12.5px] text-text-secondary">
        FOB Guangzhou. Add shipping and duties below.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <PlaceOrderCta
          className="w-full rounded-full px-6 py-3"
          prefill={{
            carCode: car.slug,
            carName: title,
            brand: car.brand,
            model: car.model,
          }}
        >
          Place order
        </PlaceOrderCta>
        <Link
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-hairline bg-white px-6 py-3 text-[14px] font-semibold text-corporate-black transition-colors hover:bg-corporate-black hover:text-white"
        >
          Ask on WhatsApp
        </Link>
      </div>

      <div className="mt-6 border-t border-hairline pt-4">
        <Link
          href={car.spec_sheet_pdf_url ?? "#"}
          aria-disabled={!car.spec_sheet_pdf_url}
          className={cn(
            "inline-flex items-center gap-2 text-[13px] font-medium",
            car.spec_sheet_pdf_url
              ? "text-corporate-black hover:text-cch-red"
              : "pointer-events-none text-text-tertiary",
          )}
        >
          <Download className="size-3.5" aria-hidden="true" />
          {car.spec_sheet_pdf_url
            ? "Download spec sheet (PDF)"
            : "Spec sheet on request"}
        </Link>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-hairline pt-4 text-[12px]">
        <div>
          <dt className="text-text-tertiary">Year</dt>
          <dd className="mt-0.5 font-medium text-corporate-black">{car.year}</dd>
        </div>
        <div>
          <dt className="text-text-tertiary">Body</dt>
          <dd className="mt-0.5 font-medium text-corporate-black">
            {car.body_type ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-text-tertiary">
            {car.condition === "used" ? "Mileage" : "Range"}
          </dt>
          <dd className="mt-0.5 font-medium text-corporate-black">
            {car.condition === "used"
              ? car.mileage_km != null
                ? `${car.mileage_km.toLocaleString("en-US")} km`
                : "—"
              : car.range_km != null
                ? `${car.range_km} km`
                : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-text-tertiary">Battery</dt>
          <dd className="mt-0.5 font-medium text-corporate-black">
            {car.condition === "used"
              ? car.battery_health_pct != null
                ? `${car.battery_health_pct}% health`
                : "Report on file"
              : "Factory fresh"}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
