"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

import { RequestCarCta } from "@/components/site/RequestCarCta";
import { BRANDS, CONDITIONS, MODELS_BY_BRAND } from "@/lib/data/vehicles";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

type SelectFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (next: string) => void;
  options: Option[];
  disabled?: boolean;
};

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  disabled = false,
}: SelectFieldProps) {
  const selected = options.find((option) => option.value === value);
  const displayLabel = selected?.label ?? options[0]?.label ?? "";

  return (
    <div
      className={cn(
        "group relative flex flex-1 items-center gap-3 rounded-full border border-hairline bg-white px-5 py-3 text-left transition-colors",
        disabled
          ? "cursor-not-allowed opacity-60"
          : "hover:border-cch-red/60 focus-within:border-cch-red/80",
      )}
    >
      <div className="pointer-events-none flex min-w-0 flex-1 flex-col leading-tight">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
          {label}
        </span>
        <span className="truncate text-[14px] font-medium text-corporate-black">
          {displayLabel}
        </span>
      </div>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none ml-auto size-4 shrink-0 text-text-tertiary transition-colors group-hover:text-cch-red"
      />
      <select
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        aria-label={label}
        className="absolute inset-0 size-full cursor-pointer appearance-none rounded-full bg-transparent text-transparent opacity-0 disabled:cursor-not-allowed"
      >
        {options.map((option) => (
          <option key={option.value + option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function HeroSearchForm() {
  const [condition, setCondition] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const modelOptions = useMemo<Option[]>(() => {
    if (!make) {
      return [{ value: "", label: "Pick a make first" }];
    }
    const list = MODELS_BY_BRAND[make] ?? [];
    return [
      { value: "", label: "Any model" },
      ...list.map((m) => ({ value: m, label: m })),
    ];
  }, [make]);

  return (
    <form
      action="/lot"
      method="get"
      className="mt-10 flex w-full max-w-[920px] flex-col gap-3 rounded-[36px] border border-hairline bg-white p-3 md:flex-row md:items-center"
      role="search"
      aria-label="Find a car"
    >
      <SelectField
        label="Condition"
        name="condition"
        value={condition}
        onChange={setCondition}
        options={CONDITIONS}
      />
      <SelectField
        label="Make"
        name="make"
        value={make}
        onChange={(next) => {
          setMake(next);
          setModel("");
        }}
        options={[
          { value: "", label: "Any make" },
          ...BRANDS.map((b) => ({ value: b, label: b })),
        ]}
      />
      <SelectField
        label="Model"
        name="model"
        value={model}
        onChange={setModel}
        options={modelOptions}
        disabled={!make}
      />
      <RequestCarCta className="shrink-0 self-end rounded-full px-6 py-3.5 md:self-auto">
        Request a Car
      </RequestCarCta>
    </form>
  );
}
