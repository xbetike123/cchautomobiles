import { FileText } from "lucide-react";
import Link from "next/link";

type QuotesEmptyProps = {
  hasFilters: boolean;
};

export function QuotesEmpty({ hasFilters }: QuotesEmptyProps) {
  return (
    <section className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-hairline bg-white px-6 py-14 text-center">
      <span
        aria-hidden
        className="grid size-12 place-items-center rounded-full bg-surface-tint text-text-tertiary"
      >
        <FileText className="size-5" />
      </span>
      <div>
        <p className="font-display text-[15px] font-semibold text-corporate-black">
          {hasFilters ? "No quotes match these filters" : "No quotes sent yet"}
        </p>
        <p className="mt-1 text-[13px] text-text-secondary">
          {hasFilters
            ? "Try clearing a filter or widening your search."
            : "Quotes appear here as soon as you send one to a client."}
        </p>
      </div>
      {hasFilters ? (
        <Link
          href="/admin/quotes"
          className="mt-2 inline-flex items-center rounded-full bg-corporate-black px-3.5 py-1.5 text-[12.5px] font-medium text-white hover:bg-corporate-black/85"
        >
          Clear filters
        </Link>
      ) : (
        <Link
          href="/admin/quotes/new"
          className="mt-2 inline-flex items-center rounded-full bg-cch-red px-3.5 py-1.5 text-[12.5px] font-semibold text-white shadow-[0_6px_14px_rgba(230,57,70,0.25)] hover:bg-cch-red-hover"
        >
          Build a new quote
        </Link>
      )}
    </section>
  );
}
