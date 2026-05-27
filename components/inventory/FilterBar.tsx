"use client";

import { ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

type FilterBarProps = {
  brands: string[];
  bodyTypes: string[];
};

function buildHref(
  pathname: string,
  current: URLSearchParams,
  updates: Record<string, string | null>,
): string {
  const next = new URLSearchParams(current);
  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
  }
  // Reset to page 1 whenever filters change.
  if (Object.keys(updates).some((k) => k !== "page")) {
    next.delete("page");
  }
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

const CONDITION_OPTIONS: Option[] = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
];

function Select({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (next: string) => void;
}) {
  const selected = options.find((o) => o.value === value) ?? options[0];
  return (
    <div className="relative inline-flex h-10 min-w-[150px] items-center gap-2 rounded-full border border-hairline bg-white px-4 text-[13px] font-medium text-corporate-black shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-colors hover:border-corporate-black/30 focus-within:border-corporate-black/40">
      <span className="text-text-tertiary">{label}</span>
      <span className="truncate text-corporate-black">{selected.label}</span>
      <ChevronDown
        aria-hidden="true"
        className="ml-auto size-3.5 shrink-0 text-text-tertiary"
      />
      <select
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="absolute inset-0 size-full cursor-pointer appearance-none rounded-full bg-transparent opacity-0"
      >
        {options.map((option) => (
          <option key={option.value || "any"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FilterBar({ brands, bodyTypes }: FilterBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const params = new URLSearchParams(searchParams.toString());
  const condition = params.get("condition") ?? "";
  const brand = params.get("brand") ?? "";
  const body = params.get("body") ?? "";

  const hasFilters = Boolean(condition || brand || body);

  const navigate = useCallback(
    (updates: Record<string, string | null>) => {
      const href = buildHref(pathname, searchParams, updates);
      startTransition(() => {
        router.push(href, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center gap-1 rounded-full border border-hairline bg-white p-1 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
        {CONDITION_OPTIONS.map((option) => {
          const active = option.value === condition;
          return (
            <Link
              key={option.value || "all"}
              href={buildHref(pathname, searchParams, {
                condition: option.value || null,
              })}
              scroll={false}
              className={cn(
                "inline-flex items-center rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                active
                  ? "bg-cch-red text-white shadow-[0_6px_14px_rgba(230,57,70,0.28)]"
                  : "text-text-secondary hover:text-corporate-black",
              )}
            >
              {option.label}
            </Link>
          );
        })}
      </div>

      <Select
        label="Make"
        name="brand"
        value={brand}
        onChange={(next) => navigate({ brand: next || null })}
        options={[
          { value: "", label: "Any" },
          ...brands.map((b) => ({ value: b, label: b })),
        ]}
      />

      <Select
        label="Body"
        name="body"
        value={body}
        onChange={(next) => navigate({ body: next || null })}
        options={[
          { value: "", label: "Any" },
          ...bodyTypes.map((b) => ({ value: b, label: b })),
        ]}
      />

      {hasFilters ? (
        <Link
          href={pathname}
          scroll={false}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium text-cch-red transition-colors hover:bg-cch-red-soft"
        >
          <X className="size-3.5" aria-hidden="true" />
          Clear filters
        </Link>
      ) : null}
    </div>
  );
}
