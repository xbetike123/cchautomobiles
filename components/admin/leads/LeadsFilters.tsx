import Link from "next/link";

import { LEAD_STATUS_LABEL, LEAD_TRACK_LABEL } from "@/lib/admin/format";
import type { LeadStatus, LeadTrack } from "@/lib/admin/types";
import { buildHref } from "@/lib/admin/url";
import { cn } from "@/lib/utils";

type LeadsFiltersProps = {
  current: Record<string, string | undefined>;
  statusCounts: Record<LeadStatus | "all", number>;
};

const STATUS_TABS: Array<LeadStatus | "all"> = [
  "all",
  "new",
  "contacted",
  "quoted",
  "negotiating",
  "reserved",
  "closed_won",
  "closed_lost",
];

const TRACK_TABS: Array<LeadTrack | "all"> = [
  "all",
  "in_stock",
  "source_to_order",
  "unclassified",
];

const HAS_CODE_TABS: Array<{ value: "all" | "yes" | "no"; label: string }> = [
  { value: "all", label: "All" },
  { value: "yes", label: "With code" },
  { value: "no", label: "Without code" },
];

function isActive(currentValue: string | undefined, tab: string) {
  if (tab === "all") return !currentValue;
  return currentValue === tab;
}

export function LeadsFilters({ current, statusCounts }: LeadsFiltersProps) {
  const buildStatusHref = (status: LeadStatus | "all") =>
    buildHref("/admin/leads", current, {
      status: status === "all" ? null : status,
    });

  const buildTrackHref = (track: LeadTrack | "all") =>
    buildHref("/admin/leads", current, {
      track: track === "all" ? null : track,
    });

  const buildHasCodeHref = (value: "all" | "yes" | "no") =>
    buildHref("/admin/leads", current, {
      hasCode: value === "all" ? null : value,
    });

  return (
    <div className="rounded-xl border border-hairline bg-white">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-hairline px-4 py-2.5">
        {STATUS_TABS.map((tab) => {
          const active = isActive(current.status, tab);
          const label =
            tab === "all" ? "All" : LEAD_STATUS_LABEL[tab as LeadStatus];
          const count =
            tab === "all" ? statusCounts.all : statusCounts[tab as LeadStatus];
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

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-text-tertiary">
            Track
          </span>
          <div className="flex flex-wrap gap-1">
            {TRACK_TABS.map((tab) => {
              const active = isActive(current.track, tab);
              const label =
                tab === "all" ? "All" : LEAD_TRACK_LABEL[tab as LeadTrack];
              return (
                <Link
                  key={tab}
                  href={buildTrackHref(tab)}
                  className={cn(
                    "inline-flex rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium transition-colors",
                    active
                      ? "border-cch-red bg-cch-red-soft text-cch-red"
                      : "border-hairline text-text-secondary hover:bg-surface-tint hover:text-corporate-black",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-text-tertiary">
            Code
          </span>
          <div className="flex flex-wrap gap-1">
            {HAS_CODE_TABS.map((tab) => {
              const active = isActive(current.hasCode, tab.value);
              return (
                <Link
                  key={tab.value}
                  href={buildHasCodeHref(tab.value)}
                  className={cn(
                    "inline-flex rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium transition-colors",
                    active
                      ? "border-corporate-black bg-corporate-black text-white"
                      : "border-hairline text-text-secondary hover:bg-surface-tint hover:text-corporate-black",
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
