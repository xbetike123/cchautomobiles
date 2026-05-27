import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type PaginationProps = {
  total: number;
  perPage: number;
  page: number;
  pathname: string;
  searchParams: URLSearchParams;
};

function pageHref(
  pathname: string,
  searchParams: URLSearchParams,
  page: number,
): string {
  const next = new URLSearchParams(searchParams);
  if (page <= 1) next.delete("page");
  else next.set("page", String(page));
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

function pagesWithEllipsis(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const out: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("…");
  out.push(total);
  return out;
}

export function Pagination({
  total,
  perPage,
  page,
  pathname,
  searchParams,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (totalPages <= 1) return null;

  const current = Math.min(Math.max(1, page), totalPages);
  const items = pagesWithEllipsis(current, totalPages);

  return (
    <nav
      aria-label="Inventory pagination"
      className="flex items-center justify-center gap-1.5"
    >
      <Link
        href={pageHref(pathname, searchParams, current - 1)}
        aria-disabled={current === 1}
        scroll={false}
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-full border border-hairline bg-white text-corporate-black shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-colors hover:border-corporate-black/30",
          current === 1 && "pointer-events-none opacity-40",
        )}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </Link>

      {items.map((item, index) => {
        if (item === "…") {
          return (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="inline-flex size-10 items-center justify-center text-text-tertiary"
            >
              …
            </span>
          );
        }
        const isCurrent = item === current;
        return (
          <Link
            key={item}
            href={pageHref(pathname, searchParams, item)}
            scroll={false}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-full border text-[13px] font-medium transition-colors",
              isCurrent
                ? "border-cch-red bg-cch-red text-white shadow-[0_8px_18px_rgba(230,57,70,0.28)]"
                : "border-hairline bg-white text-corporate-black hover:border-corporate-black/30",
            )}
          >
            {item}
          </Link>
        );
      })}

      <Link
        href={pageHref(pathname, searchParams, current + 1)}
        aria-disabled={current === totalPages}
        scroll={false}
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-full border border-hairline bg-white text-corporate-black shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-colors hover:border-corporate-black/30",
          current === totalPages && "pointer-events-none opacity-40",
        )}
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </Link>
    </nav>
  );
}
