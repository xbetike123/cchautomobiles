import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { formatNgnApprox, formatUsd } from "@/lib/admin/format";
import type { RevenueThisMonth } from "@/lib/admin/queries/dashboard";

type RevenueCardProps = {
  data: RevenueThisMonth;
  href?: string;
};

export function RevenueCard({ data, href }: RevenueCardProps) {
  const { totalUsd, dealCount, avgDealUsd } = data;
  const ngnApprox = totalUsd > 0 ? formatNgnApprox(totalUsd) : null;

  const inner = (
    <div className="group relative overflow-hidden rounded-xl border border-hairline bg-white transition-all hover:-translate-y-px hover:shadow-card">
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1 bg-cch-red"
      />
      <div className="flex flex-col gap-6 px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-text-tertiary">
              Revenue · Month to date
            </p>
            {href ? (
              <ArrowUpRight
                aria-hidden
                className="size-3.5 text-text-tertiary opacity-0 transition-opacity group-hover:opacity-100"
              />
            ) : null}
          </div>
          <p className="mt-3 font-display text-[44px] font-semibold leading-none tracking-tight text-corporate-black">
            {formatUsd(totalUsd)}
          </p>
          {ngnApprox ? (
            <p className="mt-2 text-[13px] tabular-nums text-text-secondary">
              ≈ {ngnApprox}
              <span className="ml-1.5 text-text-tertiary">
                at today&apos;s rate
              </span>
            </p>
          ) : (
            <p className="mt-2 text-[13px] text-text-tertiary">
              No deals closed yet this month
            </p>
          )}
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-x-8 gap-y-1 sm:text-right">
          <div>
            <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
              Deals closed
            </p>
            <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-corporate-black">
              {dealCount}
            </p>
          </div>
          <div>
            <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
              Avg deal
            </p>
            <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-corporate-black">
              {avgDealUsd > 0 ? formatUsd(avgDealUsd) : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}
