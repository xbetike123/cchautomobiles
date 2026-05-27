"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

import type { InventoryRow } from "@/lib/queries/inventory";

type Port = {
  value: string;
  label: string;
  country: string;
  oceanShipping: number;
  customsDutyPct: number;
  ecowasLevyPct: number;
  nacLevyPct: number;
  terminalHandling: number;
  clearingAgent: number;
};

// Placeholder rate table. Real per-port rates and tests land in Task 4.3.
const PORTS: Port[] = [
  {
    value: "lagos-apapa",
    label: "Lagos Apapa",
    country: "Nigeria",
    oceanShipping: 1500,
    customsDutyPct: 0.35,
    ecowasLevyPct: 0.005,
    nacLevyPct: 0.02,
    terminalHandling: 300,
    clearingAgent: 400,
  },
  {
    value: "lagos-tin-can",
    label: "Lagos Tin Can",
    country: "Nigeria",
    oceanShipping: 1450,
    customsDutyPct: 0.35,
    ecowasLevyPct: 0.005,
    nacLevyPct: 0.02,
    terminalHandling: 320,
    clearingAgent: 400,
  },
  {
    value: "tema",
    label: "Tema",
    country: "Ghana",
    oceanShipping: 1800,
    customsDutyPct: 0.35,
    ecowasLevyPct: 0.005,
    nacLevyPct: 0,
    terminalHandling: 280,
    clearingAgent: 380,
  },
  {
    value: "cotonou",
    label: "Cotonou",
    country: "Benin",
    oceanShipping: 1300,
    customsDutyPct: 0.30,
    ecowasLevyPct: 0.005,
    nacLevyPct: 0,
    terminalHandling: 240,
    clearingAgent: 350,
  },
  {
    value: "dakar",
    label: "Dakar",
    country: "Senegal",
    oceanShipping: 2200,
    customsDutyPct: 0.20,
    ecowasLevyPct: 0.005,
    nacLevyPct: 0,
    terminalHandling: 260,
    clearingAgent: 360,
  },
];

const INSURANCE_PCT = 0.01;
const CCH_SERVICE_FEE = 600;

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type Props = {
  car: InventoryRow;
};

export function LandedCostCalculator({ car }: Props) {
  const [portValue, setPortValue] = useState(PORTS[0].value);
  const port = PORTS.find((p) => p.value === portValue) ?? PORTS[0];

  const lines = useMemo(() => {
    const fob = car.price_usd_fob;
    const insurance = Math.round(fob * INSURANCE_PCT);
    const cif = fob + port.oceanShipping + insurance;
    const customs = Math.round(cif * port.customsDutyPct);
    const ecowas = Math.round(cif * port.ecowasLevyPct);
    const nac = Math.round(cif * port.nacLevyPct);

    return [
      { label: "FOB Guangzhou", value: fob, hint: "Price of the car on our lot" },
      {
        label: "Ocean shipping",
        value: port.oceanShipping,
        hint: `Roll-on roll-off to ${port.label}`,
      },
      {
        label: "Marine insurance",
        value: insurance,
        hint: `${(INSURANCE_PCT * 100).toFixed(1)}% of FOB`,
      },
      {
        label: `Customs duty (${port.country})`,
        value: customs,
        hint: `${(port.customsDutyPct * 100).toFixed(0)}% of CIF`,
      },
      ...(port.ecowasLevyPct > 0
        ? [
            {
              label: "ECOWAS levy",
              value: ecowas,
              hint: `${(port.ecowasLevyPct * 100).toFixed(2)}% of CIF`,
            },
          ]
        : []),
      ...(port.nacLevyPct > 0
        ? [
            {
              label: "NAC levy",
              value: nac,
              hint: `${(port.nacLevyPct * 100).toFixed(0)}% of CIF · Nigeria only`,
            },
          ]
        : []),
      {
        label: "Terminal handling",
        value: port.terminalHandling,
        hint: "Port charges at arrival",
      },
      {
        label: "Clearing agent",
        value: port.clearingAgent,
        hint: "Local agent fee",
      },
      {
        label: "CCH service fee",
        value: CCH_SERVICE_FEE,
        hint: "Inspection, paperwork, coordination",
      },
    ];
  }, [car.price_usd_fob, port]);

  const total = lines.reduce((sum, line) => sum + line.value, 0);

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-content px-6 py-12 md:py-16">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-[22px] font-semibold leading-tight tracking-tight text-corporate-black md:text-[26px]">
              Total landed cost
            </h2>
            <p className="mt-2 max-w-[640px] text-[14px] text-text-secondary">
              An estimate of the all-in cost to land this car at your chosen
              port. Final numbers depend on shipping schedule and duty band on
              the day of arrival.
            </p>
          </div>

          <div className="relative inline-flex h-11 min-w-[220px] items-center gap-2 rounded-full border border-hairline bg-white px-4 text-[13.5px] font-medium text-corporate-black shadow-[0_1px_0_rgba(15,23,42,0.04)] focus-within:border-corporate-black/40 hover:border-corporate-black/30">
            <span className="text-text-tertiary">Port</span>
            <span className="truncate">{port.label}</span>
            <ChevronDown
              aria-hidden="true"
              className="ml-auto size-3.5 shrink-0 text-text-tertiary"
            />
            <select
              aria-label="Destination port"
              value={portValue}
              onChange={(event) => setPortValue(event.target.value)}
              className="absolute inset-0 cursor-pointer appearance-none rounded-full bg-transparent opacity-0"
            >
              {PORTS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label} · {p.country}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-card-lg border border-hairline bg-white">
          <dl>
            {lines.map((line) => (
              <div
                key={line.label}
                className="flex items-baseline justify-between gap-4 border-b border-hairline px-6 py-3.5 last:border-b-0"
              >
                <div>
                  <dt className="text-[14px] font-medium text-corporate-black">
                    {line.label}
                  </dt>
                  <p className="mt-0.5 text-[12px] text-text-tertiary">
                    {line.hint}
                  </p>
                </div>
                <dd className="text-[14px] font-medium tabular-nums text-corporate-black">
                  {usdFormatter.format(line.value)}
                </dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-4 bg-surface-tint/60 px-6 py-4">
              <dt className="text-[13px] font-medium uppercase tracking-[0.1em] text-text-tertiary">
                Estimated total · {port.label}
              </dt>
              <dd className="font-display text-[24px] font-semibold tabular-nums text-cch-red">
                {usdFormatter.format(total)}
              </dd>
            </div>
          </dl>
        </div>

        <p className="mt-4 text-[12px] text-text-tertiary">
          Rates are working estimates. CCH operations will confirm the final
          quote per the week&apos;s shipping schedule.
        </p>
      </div>
    </section>
  );
}
