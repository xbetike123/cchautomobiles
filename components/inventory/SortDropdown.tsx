"use client";

import { ArrowDownUp, ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type SortOption = { value: string; label: string };

const SORT_OPTIONS: SortOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "battery-desc", label: "Best battery health" },
];

export function SortDropdown() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const current = searchParams.get("sort") ?? "newest";
  const label =
    SORT_OPTIONS.find((o) => o.value === current)?.label ?? "Newest first";

  const onChange = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "newest") params.delete("sort");
    else params.set("sort", next);
    params.delete("page");
    const qs = params.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  };

  return (
    <div className="relative inline-flex h-10 min-w-[200px] items-center gap-2 rounded-full border border-hairline bg-white px-4 text-[13px] font-medium text-corporate-black shadow-[0_1px_0_rgba(15,23,42,0.04)] hover:border-corporate-black/30 focus-within:border-corporate-black/40">
      <ArrowDownUp
        aria-hidden="true"
        className="size-3.5 shrink-0 text-text-tertiary"
      />
      <span className="text-text-tertiary">Sort</span>
      <span className="truncate text-corporate-black">{label}</span>
      <ChevronDown
        aria-hidden="true"
        className="ml-auto size-3.5 shrink-0 text-text-tertiary"
      />
      <select
        value={current}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Sort inventory"
        className="absolute inset-0 size-full cursor-pointer appearance-none rounded-full bg-transparent opacity-0"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
