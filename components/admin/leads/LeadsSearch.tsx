import { Search, X } from "lucide-react";
import Link from "next/link";

import { buildHref } from "@/lib/admin/url";

type LeadsSearchProps = {
  current: Record<string, string | undefined>;
};

export function LeadsSearch({ current }: LeadsSearchProps) {
  const { q, ...preserved } = current;
  const clearHref = buildHref("/admin/leads", preserved, { q: null });

  return (
    <form
      action="/admin/leads"
      method="get"
      className="relative flex w-full max-w-xs items-center"
    >
      {Object.entries(preserved).map(([key, value]) =>
        value ? (
          <input key={key} type="hidden" name={key} value={value} />
        ) : null,
      )}
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3 size-4 text-text-tertiary"
      />
      <input
        type="search"
        name="q"
        defaultValue={q ?? ""}
        placeholder="Search name, code, brand…"
        className="h-9 w-full rounded-full border border-hairline bg-white pl-9 pr-9 text-[13px] text-corporate-black placeholder:text-text-tertiary focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
      />
      {q ? (
        <Link
          href={clearHref}
          aria-label="Clear search"
          className="absolute right-2 grid size-6 place-items-center rounded-full text-text-tertiary hover:bg-surface-tint hover:text-corporate-black"
        >
          <X className="size-3.5" />
        </Link>
      ) : null}
    </form>
  );
}
