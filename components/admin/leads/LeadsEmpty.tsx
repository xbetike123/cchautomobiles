import { Inbox } from "lucide-react";
import Link from "next/link";

type LeadsEmptyProps = {
  hasFilters: boolean;
};

export function LeadsEmpty({ hasFilters }: LeadsEmptyProps) {
  return (
    <section className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-hairline bg-white px-6 py-14 text-center">
      <span
        aria-hidden
        className="grid size-12 place-items-center rounded-full bg-surface-tint text-text-tertiary"
      >
        <Inbox className="size-5" />
      </span>
      <div>
        <p className="font-display text-[15px] font-semibold text-corporate-black">
          {hasFilters ? "No requests match these filters" : "No car requests yet"}
        </p>
        <p className="mt-1 text-[13px] text-text-secondary">
          {hasFilters
            ? "Try clearing a filter or widening your search."
            : "New requests will appear here as soon as a client submits the form."}
        </p>
      </div>
      {hasFilters ? (
        <Link
          href="/admin/leads"
          className="mt-2 inline-flex items-center rounded-full bg-corporate-black px-3.5 py-1.5 text-[12.5px] font-medium text-white hover:bg-corporate-black/85"
        >
          Clear filters
        </Link>
      ) : null}
    </section>
  );
}
