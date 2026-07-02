import { Calendar, MapPin, User } from "lucide-react";

import { formatUsd } from "@/lib/admin/format";
import type { InventoryCondition, Lead } from "@/lib/admin/types";

type QuoteSummaryProps = {
  lead: Lead | null;
  car: {
    carCode: string;
    carName: string;
    condition: InventoryCondition;
    photo: string | null;
    basePriceUsd: number;
  };
  basePrice: number;
  shippingUsd: number | null;
  clearingUsd: number | null;
  purchaseTaxUsd: number;
  exportLicenseUsd: number;
  totalUsd: number;
  validUntil: string;
};

export function QuoteSummary({
  lead,
  car,
  basePrice,
  shippingUsd,
  clearingUsd,
  purchaseTaxUsd,
  exportLicenseUsd,
  totalUsd,
  validUntil,
}: QuoteSummaryProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-hairline bg-white shadow-card">
      <header className="border-b border-hairline px-5 py-3.5">
        <p className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-text-tertiary">
          Preview
        </p>
        <h2 className="mt-1 font-display text-[15px] font-semibold tracking-tight text-corporate-black">
          Quote summary
        </h2>
      </header>

      <div className="border-b border-hairline px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-surface-warm">
            {car.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={car.photo}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            ) : null}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-medium text-corporate-black">
              {car.carName}
            </p>
            <p className="mt-0.5 truncate text-[11.5px] text-text-secondary">
              <span className="font-medium text-corporate-black/75">
                {car.carCode}
              </span>
              {" · "}
              {car.condition === "new" ? "New" : "Used"}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-hairline px-5 py-3 text-[11.5px] text-text-secondary">
        <p className="flex items-center gap-1.5">
          <User aria-hidden className="size-3 text-text-tertiary" />
          {lead?.name ?? "No client selected"}
        </p>
        {lead?.destinationCity ? (
          <p className="mt-1 flex items-center gap-1.5">
            <MapPin aria-hidden className="size-3 text-text-tertiary" />
            {lead.destinationCity}
            {lead.destinationCountry ? `, ${lead.destinationCountry}` : ""}
          </p>
        ) : null}
        <p className="mt-1 flex items-center gap-1.5">
          <Calendar aria-hidden className="size-3 text-text-tertiary" />
          Valid until {validUntil}
        </p>
      </div>

      <div className="divide-y divide-hairline">
        <SummaryRow label="FOB Guangzhou" value={formatUsd(basePrice)} />
        <SummaryRow
          label="Ocean shipping"
          value={shippingUsd === null ? "Not included" : formatUsd(shippingUsd)}
          muted={shippingUsd === null}
        />
        <SummaryRow
          label="Clearing & duties"
          value={clearingUsd === null ? "TBC" : formatUsd(clearingUsd)}
          muted={clearingUsd === null}
        />
        <SummaryRow label="Purchase tax" value={formatUsd(purchaseTaxUsd)} />
        <SummaryRow label="Export license" value={formatUsd(exportLicenseUsd)} />
      </div>

      <div className="bg-surface-tint px-5 py-3.5">
        <div className="flex items-end justify-between gap-3">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
            Total
          </p>
          <p className="font-display text-[22px] font-semibold leading-none tabular-nums text-corporate-black">
            {formatUsd(totalUsd)}
          </p>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-2.5 text-[12.5px]">
      <span className="text-text-secondary">{label}</span>
      <span
        className={
          muted
            ? "italic text-text-tertiary"
            : "font-medium tabular-nums text-corporate-black"
        }
      >
        {value}
      </span>
    </div>
  );
}
