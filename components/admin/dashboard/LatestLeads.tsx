import { ArrowRight } from "lucide-react";
import Link from "next/link";

import {
  LEAD_STATUS_LABEL,
  LEAD_TRACK_LABEL,
  formatRelativeTime,
} from "@/lib/admin/format";
import type { Lead, LeadTrack } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type LatestLeadsProps = {
  leads: Lead[];
  totalCount: number;
  now: string;
};

const TRACK_TONE: Record<LeadTrack, string> = {
  in_stock: "border-corporate-black/15 bg-white text-corporate-black/75",
  source_to_order: "border-cch-red/40 bg-cch-red-soft text-cch-red",
  unclassified: "border-corporate-black/10 bg-white text-text-tertiary",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getLeadHint(lead: Lead): string {
  const pieces: string[] = [];
  if (lead.carCode) {
    pieces.push(lead.carCode);
  } else if (lead.preferredBrand) {
    pieces.push(
      `${lead.preferredBrand}${lead.preferredModel ? ` ${lead.preferredModel}` : ""}`,
    );
  } else {
    pieces.push("Browsing");
  }
  if (lead.destinationCity) pieces.push(lead.destinationCity);
  pieces.push(LEAD_STATUS_LABEL[lead.status]);
  return pieces.join(" · ");
}

export function LatestLeads({ leads, totalCount, now }: LatestLeadsProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-hairline bg-white">
      <header className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-4">
        <div className="flex items-center gap-2.5">
          <h2 className="font-display text-[15px] font-semibold tracking-tight text-corporate-black">
            Latest Car Requests
          </h2>
          <span className="inline-flex items-center rounded-full bg-corporate-black/5 px-2 py-0.5 text-[11px] font-medium tabular-nums text-corporate-black/70">
            {leads.length}
          </span>
        </div>
        <span className="hidden text-[10.5px] font-medium uppercase tracking-[0.16em] text-text-tertiary sm:inline-block">
          Live
        </span>
      </header>
      <ul className="flex-1 divide-y divide-hairline">
        {leads.map((lead) => (
          <li key={lead.id}>
            <Link
              href={`/admin/leads/${lead.id}`}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-tint"
            >
              <span
                aria-hidden
                className="relative grid size-9 place-items-center rounded-full bg-corporate-black/5 text-[11.5px] font-semibold uppercase tracking-wide text-corporate-black/75"
              >
                {getInitials(lead.name)}
                {lead.status === "new" ? (
                  <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-cch-red ring-2 ring-white" />
                ) : null}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[14px] font-medium text-corporate-black">
                    {lead.name}
                  </p>
                  <span
                    className={cn(
                      "hidden shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide md:inline-flex",
                      TRACK_TONE[lead.track],
                    )}
                  >
                    {LEAD_TRACK_LABEL[lead.track]}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[12px] text-text-secondary">
                  {getLeadHint(lead)}
                </p>
              </div>
              <span className="shrink-0 text-[11.5px] tabular-nums text-text-tertiary">
                {formatRelativeTime(lead.createdAt, now)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/admin/leads"
        className="flex items-center justify-between border-t border-hairline px-5 py-3 text-[12.5px] font-medium text-cch-red transition-colors hover:bg-surface-tint hover:text-cch-red-hover"
      >
        <span>View all Car Requests</span>
        <span className="flex items-center gap-1.5">
          <span className="tabular-nums text-text-tertiary">{totalCount}</span>
          <ArrowRight className="size-3.5" />
        </span>
      </Link>
    </section>
  );
}
