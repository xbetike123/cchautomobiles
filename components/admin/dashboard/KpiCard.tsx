import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type KpiCardProps = {
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
  tone?: "default" | "alert" | "positive";
};

export function KpiCard({
  label,
  value,
  hint,
  href,
  tone = "default",
}: KpiCardProps) {
  const inner = (
    <div
      className={cn(
        "group relative h-full rounded-xl border border-hairline bg-white p-5 transition-all",
        href && "hover:-translate-y-px hover:shadow-card",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
          {label}
        </p>
        {href ? (
          <ArrowUpRight
            aria-hidden
            className="size-4 text-text-tertiary opacity-0 transition-opacity group-hover:opacity-100"
          />
        ) : null}
      </div>
      <p
        className={cn(
          "mt-5 font-display text-[40px] font-semibold leading-none tracking-tight",
          tone === "alert" && "text-cch-red",
          tone === "positive" && "text-emerald-600",
          tone === "default" && "text-corporate-black",
        )}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-3 text-xs text-text-tertiary">{hint}</p>
      ) : null}
    </div>
  );
  return href ? (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  ) : (
    inner
  );
}
