"use client";

import { ChevronDown, Search, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { cn } from "@/lib/utils";

type Condition = "" | "new" | "used";
type Sort = "newest" | "price-asc" | "price-desc" | "battery-desc";

const TABS: Array<{ label: string; value: Condition }> = [
  { label: "All cars", value: "" },
  { label: "New cars", value: "new" },
  { label: "Used cars", value: "used" },
];

const SORT_LABELS: Record<Sort, string> = {
  newest: "Newest first",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  "battery-desc": "Best battery",
};

type Props = {
  brands: string[];
  bodyTypes: string[];
};

export function CarentoHeroSearch({ brands, bodyTypes }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [condition, setCondition] = useState<Condition>("");
  const [brand, setBrand] = useState("");
  const [body, setBody] = useState("");
  const [sort, setSort] = useState<Sort>("newest");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (condition) params.set("condition", condition);
    if (brand) params.set("brand", brand);
    if (body) params.set("body", body);
    if (sort !== "newest") params.set("sort", sort);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/lot?${qs}` : "/lot");
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-12 rounded-[20px] border border-hairline bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.1)] md:mt-16 md:p-7"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {TABS.map((tab) => {
              const active = tab.value === condition;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setCondition(tab.value)}
                  className={cn(
                    "rounded-full px-5 py-2 text-[13px] transition-colors",
                    active
                      ? "bg-cch-red font-semibold text-white"
                      : "font-medium text-text-secondary hover:text-corporate-black",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <a
            href="/lot"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-text-secondary hover:text-corporate-black"
          >
            <UserRound className="size-4" aria-hidden="true" />
            Browse all cars
          </a>
        </div>

        <div className="flex flex-col gap-3 rounded-[12px] border border-hairline p-3 md:flex-row md:items-stretch md:gap-0 md:p-2">
          <Field label="Brand" divider={false}>
            <NativeSelect
              value={brand}
              onChange={setBrand}
              placeholder="Any brand"
              options={brands}
            />
          </Field>
          <Field label="Body Type" divider>
            <NativeSelect
              value={body}
              onChange={setBody}
              placeholder="Any body"
              options={bodyTypes}
            />
          </Field>
          <Field label="Sort" divider>
            <NativeSelect
              value={sort === "newest" ? "" : sort}
              onChange={(next) => setSort((next || "newest") as Sort)}
              placeholder={SORT_LABELS.newest}
              options={(Object.keys(SORT_LABELS) as Sort[])
                .filter((s) => s !== "newest")
                .map((s) => ({ value: s, label: SORT_LABELS[s] }))}
            />
          </Field>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-cch-red px-7 py-4 text-[13px] font-semibold text-white transition-colors hover:bg-cch-red-hover md:ml-2 md:px-8"
          >
            <Search className="size-4" aria-hidden="true" />
            Find a Vehicle
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  divider,
}: {
  label: string;
  children: React.ReactNode;
  divider: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-1 px-4 py-2 md:px-5",
        divider && "border-t border-hairline md:border-l md:border-t-0",
      )}
    >
      <span className="text-[11px] font-medium text-text-tertiary">{label}</span>
      {children}
    </div>
  );
}

type Option = string | { value: string; label: string };

function NativeSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  options: Option[];
  placeholder: string;
}) {
  const selectedLabel =
    value === ""
      ? placeholder
      : options
          .map((o) => (typeof o === "string" ? { value: o, label: o } : o))
          .find((o) => o.value === value)?.label ?? placeholder;
  return (
    <div className="relative flex items-center justify-between gap-3 text-[13.5px] font-medium text-corporate-black">
      <span className={cn("truncate", value === "" && "text-text-tertiary")}>
        {selectedLabel}
      </span>
      <ChevronDown className="size-4 shrink-0 text-text-tertiary" aria-hidden="true" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 size-full cursor-pointer appearance-none rounded bg-transparent opacity-0"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const opt =
            typeof option === "string"
              ? { value: option, label: option }
              : option;
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
