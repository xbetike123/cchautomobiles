"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type CountryCode = {
  code: string;
  country: string;
  dial: string;
};

// West and central Africa first (CCH's primary delivery destinations), then a
// few common others. Operator can extend in one place.
export const COUNTRY_CODES: CountryCode[] = [
  { code: "NG", country: "Nigeria", dial: "+234" },
  { code: "GH", country: "Ghana", dial: "+233" },
  { code: "CI", country: "Côte d'Ivoire", dial: "+225" },
  { code: "SN", country: "Senegal", dial: "+221" },
  { code: "BJ", country: "Benin", dial: "+229" },
  { code: "TG", country: "Togo", dial: "+228" },
  { code: "CM", country: "Cameroon", dial: "+237" },
  { code: "BF", country: "Burkina Faso", dial: "+226" },
  { code: "ML", country: "Mali", dial: "+223" },
  { code: "NE", country: "Niger", dial: "+227" },
  { code: "GN", country: "Guinea", dial: "+224" },
  { code: "LR", country: "Liberia", dial: "+231" },
  { code: "SL", country: "Sierra Leone", dial: "+232" },
  { code: "GM", country: "Gambia", dial: "+220" },
  { code: "KE", country: "Kenya", dial: "+254" },
  { code: "TZ", country: "Tanzania", dial: "+255" },
  { code: "UG", country: "Uganda", dial: "+256" },
  { code: "RW", country: "Rwanda", dial: "+250" },
  { code: "ZA", country: "South Africa", dial: "+27" },
  { code: "EG", country: "Egypt", dial: "+20" },
  { code: "MA", country: "Morocco", dial: "+212" },
  { code: "CN", country: "China", dial: "+86" },
  { code: "GB", country: "United Kingdom", dial: "+44" },
  { code: "US", country: "United States", dial: "+1" },
];

type Props = {
  value: string;
  onChange: (dial: string) => void;
  className?: string;
};

export function CountryCodeSelect({ value, onChange, className }: Props) {
  return (
    <div className={cn("relative", className)}>
      <select
        aria-label="Country dialing code"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[58px] w-full appearance-none rounded-md border border-hairline bg-white pl-3 pr-9 text-[14px] font-medium text-corporate-black focus:border-corporate-black focus:outline-none"
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.code} value={c.dial}>
            {c.dial} {c.country}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-text-tertiary"
      />
    </div>
  );
}
