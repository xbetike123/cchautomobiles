import { ArrowRight } from "lucide-react";

import { RequestCarCta } from "@/components/site/RequestCarCta";
import type { InventoryRow } from "@/lib/queries/inventory";

type Props = {
  car: InventoryRow;
};

export function LandedCostCta({ car }: Props) {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-content px-6 py-12 md:py-16">
        <div className="overflow-hidden rounded-card-lg border border-hairline bg-white p-8 shadow-[var(--shadow-card)] md:p-10">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-meta text-cch-red">Landed cost</p>
              <h2 className="mt-3 font-display text-[24px] font-semibold leading-tight tracking-tight text-corporate-black md:text-[30px]">
                Get the all-in landed cost for your port.
              </h2>
              <p className="mt-3 max-w-[640px] text-[14.5px] leading-relaxed text-text-secondary">
                Final pricing depends on your destination, the week&rsquo;s
                shipping schedule, and the duty band on the day of arrival.
                Send us your port and we&rsquo;ll come back within 24 hours
                with a real, country-specific quote — Nigeria, Ghana, Benin,
                Senegal, or anywhere we ship.
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-3 md:items-end">
              <RequestCarCta
                className="rounded-full px-6 py-3"
                params={{ car: car.slug }}
              >
                Request Landed Cost
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </RequestCarCta>
              <p className="text-[11.5px] uppercase tracking-[0.12em] text-text-tertiary md:text-right">
                Reply within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
