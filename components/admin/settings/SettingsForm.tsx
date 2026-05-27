"use client";

import { Check, RefreshCcw, Save } from "lucide-react";
import { useState } from "react";

import type { AdminSettings, CurrencyRate } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type Props = {
  settings: AdminSettings;
};

function inputClass(extra?: string) {
  return cn(
    "h-11 w-full rounded-lg border border-hairline bg-white px-4 text-[14px] text-corporate-black placeholder:text-text-tertiary focus:border-corporate-black/40 focus:outline-none focus:ring-2 focus:ring-corporate-black/10",
    extra,
  );
}

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="text-[11.5px] text-text-tertiary">{hint}</span>
      ) : null}
    </label>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-hairline bg-white p-6 shadow-card md:p-7">
      <header className="mb-5">
        <h2 className="text-[15px] font-semibold tracking-tight text-corporate-black">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-[13px] text-text-secondary">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

function UsdField({
  label,
  hint,
  value,
  onChange,
  step = 50,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (next: number) => void;
  step?: number;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-text-tertiary">
          $
        </span>
        <input
          type="number"
          inputMode="decimal"
          step={step}
          min={0}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className={inputClass("pl-8")}
        />
      </div>
    </Field>
  );
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function SettingsForm({ settings }: Props) {
  const [legalName, setLegalName] = useState(settings.legalName);
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [guangzhouAddress, setGuangzhouAddress] = useState(
    settings.guangzhouAddress,
  );
  const [lagosAddress, setLagosAddress] = useState(
    settings.lagosAddress ?? "",
  );
  const [timezone, setTimezone] = useState(settings.timezone);

  const [shippingUsd, setShippingUsd] = useState(settings.shippingUsd);
  const [clearingUsd, setClearingUsd] = useState(settings.clearingUsd);
  const [exportLicenseUsd, setExportLicenseUsd] = useState(
    settings.exportLicenseUsd,
  );
  const [cchServiceFeeUsd, setCchServiceFeeUsd] = useState(
    settings.cchServiceFeeUsd,
  );

  const [operationsEmail, setOperationsEmail] = useState(
    settings.operationsEmail ?? "",
  );
  const [whatsappOperationsNumber, setWhatsappOperationsNumber] = useState(
    settings.whatsappOperationsNumber ?? "",
  );
  const [sourceToOrderSlaHours, setSourceToOrderSlaHours] = useState(
    settings.sourceToOrderSlaHours,
  );
  const [waitResponseTimeoutHours, setWaitResponseTimeoutHours] = useState(
    settings.waitResponseTimeoutHours,
  );

  const [currencies, setCurrencies] = useState<CurrencyRate[]>(
    settings.currencies.map((c) => ({ ...c })),
  );

  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const updateCurrencyRate = (code: string, next: number) => {
    setCurrencies((prev) =>
      prev.map((c) => (c.code === code ? { ...c, ratePerUsd: next } : c)),
    );
  };

  const handleRefreshRates = () => {
    // Stub: a real wiring would call an FX provider, then update `currencies`
    // + `ratesUpdatedAt` server-side.
    const stamp = new Date().toISOString();
    setCurrencies((prev) =>
      prev.map((c) => ({ ...c, updatedAt: stamp, source: "manual" as const })),
    );
    console.log("refresh rates (stub)", stamp);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const payload: AdminSettings = {
      ...settings,
      companyName,
      legalName,
      guangzhouAddress,
      lagosAddress: lagosAddress || null,
      timezone,
      shippingUsd: Number(shippingUsd),
      clearingUsd: Number(clearingUsd),
      exportLicenseUsd: Number(exportLicenseUsd),
      cchServiceFeeUsd: Number(cchServiceFeeUsd),
      operationsEmail: operationsEmail || null,
      whatsappOperationsNumber: whatsappOperationsNumber || null,
      sourceToOrderSlaHours: Number(sourceToOrderSlaHours),
      waitResponseTimeoutHours: Number(waitResponseTimeoutHours),
      currencies,
      ratesUpdatedAt: new Date().toISOString(),
    };

    // Wire to a server action when the settings write layer ships.
    console.log("[admin/settings] save", payload);

    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitting(false);
    setSavedAt(new Date().toISOString());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-24">
      <Section
        title="Company"
        description="Used in invoices, exports, and the public footer."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Trading name">
            <input
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              className={inputClass()}
            />
          </Field>
          <Field label="Legal name">
            <input
              value={legalName}
              onChange={(event) => setLegalName(event.target.value)}
              className={inputClass()}
            />
          </Field>
          <Field label="Guangzhou address" className="md:col-span-2">
            <input
              value={guangzhouAddress}
              onChange={(event) => setGuangzhouAddress(event.target.value)}
              className={inputClass()}
            />
          </Field>
          <Field
            label="Lagos representative address"
            hint="Optional. Leave blank if no local presence yet."
            className="md:col-span-2"
          >
            <input
              value={lagosAddress}
              onChange={(event) => setLagosAddress(event.target.value)}
              placeholder="e.g. 14 Marina, Lagos Island"
              className={inputClass()}
            />
          </Field>
          <Field label="Operations timezone">
            <input
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              placeholder="Africa/Lagos"
              className={inputClass()}
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Exchange rates"
        description="One USD equals the amount shown. Used to render local-currency landed cost on the public site and on invoices."
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[12px] text-text-tertiary">
            Last updated{" "}
            <span className="font-medium text-corporate-black">
              {formatDate(settings.ratesUpdatedAt)}
            </span>
          </p>
          <button
            type="button"
            onClick={handleRefreshRates}
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white px-3 py-1.5 text-[12px] font-medium text-corporate-black transition-colors hover:bg-corporate-black hover:text-white"
          >
            <RefreshCcw className="size-3.5" aria-hidden="true" />
            Stamp as refreshed
          </button>
        </div>
        <div className="overflow-hidden rounded-lg border border-hairline">
          <table className="w-full text-[13.5px]">
            <thead className="bg-surface-tint text-[10.5px] font-medium uppercase tracking-[0.14em] text-text-tertiary">
              <tr>
                <th className="px-4 py-2.5 text-left">Currency</th>
                <th className="px-4 py-2.5 text-right">1 USD =</th>
                <th className="px-4 py-2.5 text-left">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline bg-white">
              {currencies.map((currency) => (
                <tr key={currency.code}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-corporate-black">
                      {currency.code}{" "}
                      <span className="text-text-tertiary">
                        · {currency.symbol}
                      </span>
                    </p>
                    <p className="text-[12px] text-text-secondary">
                      {currency.label}
                    </p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[12px] text-text-tertiary">
                        {currency.symbol}
                      </span>
                      <input
                        type="number"
                        inputMode="decimal"
                        step={currency.code === "CNY" ? "0.01" : "1"}
                        min={0}
                        value={currency.ratePerUsd}
                        onChange={(event) =>
                          updateCurrencyRate(
                            currency.code,
                            Number(event.target.value),
                          )
                        }
                        className="h-9 w-28 rounded-md border border-hairline bg-white px-2 text-right text-[13px] tabular-nums focus:border-corporate-black/40 focus:outline-none focus:ring-2 focus:ring-corporate-black/10"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-[12px] text-text-tertiary">
                    {formatDate(currency.updatedAt)}
                    <p className="text-[11px] uppercase tracking-[0.1em] text-text-tertiary/70">
                      {currency.source}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Charges"
        description="Default flat charges added to every quote and invoice. Override per deal when needed."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UsdField
            label="Shipping"
            hint="Roll-on roll-off Guangzhou → destination port."
            value={shippingUsd}
            onChange={setShippingUsd}
            step={50}
          />
          <UsdField
            label="Clearing"
            hint="Local clearing agent fee at the destination."
            value={clearingUsd}
            onChange={setClearingUsd}
            step={25}
          />
          <UsdField
            label="Export license"
            hint="Chinese export documentation and customs clearance."
            value={exportLicenseUsd}
            onChange={setExportLicenseUsd}
            step={25}
          />
          <UsdField
            label="CCH service fee"
            hint="Inspection, paperwork, and coordination."
            value={cchServiceFeeUsd}
            onChange={setCchServiceFeeUsd}
            step={50}
          />
        </div>
      </Section>

      <Section
        title="Operations contact"
        description="Where leads, alerts, and reminders are routed."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Operations email"
            hint="Used for invoice copies and fallback notifications."
          >
            <input
              type="email"
              value={operationsEmail}
              onChange={(event) => setOperationsEmail(event.target.value)}
              placeholder="hello@chinesecarshub.com"
              className={inputClass()}
            />
          </Field>
          <Field
            label="WhatsApp operations number"
            hint="Digits only, including country code. No leading +."
          >
            <input
              value={whatsappOperationsNumber}
              onChange={(event) =>
                setWhatsappOperationsNumber(event.target.value)
              }
              placeholder="8619802019509"
              className={inputClass()}
            />
          </Field>
          <Field
            label="Source-to-order SLA (hours)"
            hint="Lead is flagged as alert when this timer is within 12h."
          >
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={sourceToOrderSlaHours}
              onChange={(event) =>
                setSourceToOrderSlaHours(Number(event.target.value))
              }
              className={inputClass()}
            />
          </Field>
          <Field
            label="Wait-response timeout (hours)"
            hint="If the can-you-wait email goes unread this long, lead enters the wait queue."
          >
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={waitResponseTimeoutHours}
              onChange={(event) =>
                setWaitResponseTimeoutHours(Number(event.target.value))
              }
              className={inputClass()}
            />
          </Field>
        </div>
      </Section>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-hairline bg-white/85 px-4 py-4 backdrop-blur-md md:-mx-6 md:px-6">
        <div className="flex items-center gap-2 text-[12px] text-text-tertiary">
          {savedAt ? (
            <>
              <Check className="size-3.5 text-emerald-600" aria-hidden="true" />
              <span>Saved {dateFormatter.format(new Date(savedAt))}</span>
            </>
          ) : (
            <span>Changes apply across admin tools and the public site.</span>
          )}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full bg-cch-red px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(230,57,70,0.28)] transition-all hover:bg-cch-red-hover",
            submitting && "cursor-progress opacity-70",
          )}
        >
          {submitting ? (
            <span
              aria-hidden="true"
              className="size-3.5 animate-spin rounded-full border-2 border-white/50 border-t-white"
            />
          ) : (
            <Save className="size-3.5" aria-hidden="true" />
          )}
          {submitting ? "Saving" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
