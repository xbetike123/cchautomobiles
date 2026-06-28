"use client";

import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  options: Option[];
  value: string[];
  onChange: (next: string[]) => void;
  ariaLabel: string;
  hasError?: boolean;
};

export function ChipMultiSelect({
  options,
  value,
  onChange,
  ariaLabel,
  hasError,
}: Props) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "flex flex-wrap gap-2",
        hasError && "rounded-md ring-1 ring-cch-red/60 p-1",
      )}
    >
      {options.map((option) => {
        const isActive = value.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => {
              onChange(
                isActive
                  ? value.filter((v) => v !== option.value)
                  : [...value, option.value],
              );
            }}
            className={cn(
              "rounded-chip border px-4 py-2 text-[13px] font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cch-red",
              isActive
                ? "border-cch-red bg-cch-red text-white"
                : "border-hairline bg-white text-corporate-black hover:border-corporate-black",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
