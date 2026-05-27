import Link from "next/link";

import { QUOTE_STATUS_LABEL } from "@/lib/admin/format";
import type { QuoteStatus } from "@/lib/admin/types";
import { buildHref } from "@/lib/admin/url";
import { cn } from "@/lib/utils";

type QuotesFiltersProps = {
  current: Record<string, string | undefined>;
  statusCounts: Record<QuoteStatus | "all", number>;
};

const STATUS_TABS: Array<QuoteStatus | "all"> = [
  "all",
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
  "superseded",
];

function isActive(currentValue: string | undefined, tab: string) {
  if (tab === "all") return !currentValue;
  return currentValue === tab;
}

export function QuotesFilters({ current, statusCounts }: QuotesFiltersProps) {
  const buildStatusHref = (status: QuoteStatus | "all") =>
    buildHref("/admin/quotes", current, {
      status: status === "all" ? null : status,
    });

  return (
    <div className="rounded-xl border border-hairline bg-white">
      <div className="flex flex-wrap items-center gap-1.5 px-4 py-2.5">
        {STATUS_TABS.map((tab) => {
          const active = isActive(current.status, tab);
          const label =
            tab === "all" ? "All" : QUOTE_STATUS_LABEL[tab as QuoteStatus];
          const count =
            tab === "all" ? statusCounts.all : statusCounts[tab as QuoteStatus];
          return (
            <Link
              key={tab}
              href={buildStatusHref(tab)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] font-medium transition-colors",
                active
                  ? "bg-corporate-black text-white"
                  : "text-text-secondary hover:bg-surface-tint hover:text-corporate-black",
              )}
            >
              <span>{label}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10.5px] font-medium tabular-nums",
                  active
                    ? "bg-white/15 text-white"
                    : "bg-corporate-black/5 text-text-tertiary",
                )}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
