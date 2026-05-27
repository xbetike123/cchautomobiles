import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { formatRelativeTime } from "@/lib/admin/format";
import type { Lead } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type AttentionListProps = {
  title: string;
  subtitle?: string;
  emptyLabel: string;
  leads: Lead[];
  now: string;
  hintFor: (lead: Lead) => string;
  tone?: "default" | "alert";
};

export function AttentionList({
  title,
  subtitle,
  emptyLabel,
  leads,
  now,
  hintFor,
  tone = "default",
}: AttentionListProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-hairline bg-white">
      <header className="flex items-center justify-between border-b border-hairline px-5 py-4">
        <div>
          <h2 className="font-display text-[15px] font-semibold tracking-tight text-corporate-black">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-text-tertiary">{subtitle}</p>
          ) : null}
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums",
            leads.length === 0
              ? "bg-corporate-black/4 text-text-tertiary"
              : tone === "alert"
                ? "bg-cch-red text-white"
                : "bg-corporate-black text-white",
          )}
        >
          {leads.length}
        </span>
      </header>
      {leads.length === 0 ? (
        <div className="flex items-center gap-3 px-5 py-6 text-sm text-text-tertiary">
          <CheckCircle2
            aria-hidden
            className="size-4 shrink-0 text-emerald-600"
          />
          <span>{emptyLabel}</span>
        </div>
      ) : (
        <ul className="divide-y divide-hairline">
          {leads.map((lead) => (
            <li key={lead.id}>
              <Link
                href={`/admin/leads/${lead.id}`}
                className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-surface-tint"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-medium text-corporate-black">
                    {lead.name}
                  </p>
                  <p className="mt-0.5 truncate text-[11.5px] text-text-secondary">
                    {hintFor(lead)}
                  </p>
                </div>
                <span className="shrink-0 text-[11.5px] tabular-nums text-text-tertiary">
                  {formatRelativeTime(lead.createdAt, now)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
