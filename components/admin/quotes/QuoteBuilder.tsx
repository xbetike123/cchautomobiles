"use client";

import {
  AlertTriangle,
  Download,
  FileText,
  Mail,
  Save,
  UserPlus,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { QuoteSummary } from "@/components/admin/quotes/QuoteSummary";
import { formatUsd } from "@/lib/admin/format";
import type { Inventory, Lead } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

// Shipping, clearing, and export license are entered per order — they vary
// by destination port, vehicle size, and current regulations. No defaults.
const QUOTE_VALID_DAYS = 7;
// Locked at quote time so the customer's NGN figure doesn't drift between
// the quote and the corresponding deposit invoice.
const DEFAULT_NGN_RATE = 1620;

type Mode = "matched" | "manual";

type QuoteBuilderProps = {
  initialLead: Lead | null;
  initialInventory: Inventory | null;
  leads: Lead[];
  inventory: Inventory[];
};

export function QuoteBuilder({
  initialLead,
  initialInventory,
  leads: initialLeads,
  inventory,
}: QuoteBuilderProps) {
  // Leads live in state so a quote can be built for a brand-new client
  // added right here, without leaving the page. Newly added leads are
  // session-local until a persistence layer exists (see addNewLead).
  const [leads, setLeads] = useState<Lead[]>(initialLeads);

  // Default-select the first lead so the builder opens with previewable
  // mock data (see the mock pricing defaults below).
  const [selectedLeadId, setSelectedLeadId] = useState<string>(
    initialLead?.id ?? initialLeads[0]?.id ?? "",
  );

  const selectedLead = useMemo(
    () => leads.find((l) => l.id === selectedLeadId) ?? null,
    [leads, selectedLeadId],
  );

  // When a lead is picked, try to match its car code to inventory.
  const matchedInventory = useMemo(() => {
    if (!selectedLead?.carCode) return null;
    return inventory.find((i) => i.carCode === selectedLead.carCode) ?? null;
  }, [inventory, selectedLead]);

  const [mode, setMode] = useState<Mode>(
    initialInventory ? "matched" : "manual",
  );

  // Manual car fields (used when mode === "manual" or no match).
  // Pre-filled with mock values so the page opens with a previewable quote.
  const [manualBrand, setManualBrand] = useState<string>("BYD");
  const [manualModel, setManualModel] = useState<string>("Atto 3");
  const [manualYear, setManualYear] = useState<string>("2026");
  const [manualCondition, setManualCondition] = useState<"new" | "used">(
    "new",
  );
  const [manualBaseUsd, setManualBaseUsd] = useState<string>("18900");

  // Pricing inputs — pre-filled with mock values for the preview.
  const [shippingUsd, setShippingUsd] = useState<string>("2400");
  const [clearingUsd, setClearingUsd] = useState<string>("1800");
  const [clearingTbc, setClearingTbc] = useState<boolean>(false);
  const [exportLicenseUsd, setExportLicenseUsd] = useState<string>("1500");

  const [exchangeRateNgn, setExchangeRateNgn] = useState<string>(
    String(DEFAULT_NGN_RATE),
  );

  const [personalNote, setPersonalNote] = useState<string>("");

  // ---- Inline "new lead" form ----
  const [showNewLead, setShowNewLead] = useState<boolean>(false);
  const [newLead, setNewLead] = useState({
    name: "",
    whatsapp: "",
    email: "",
    destinationCity: "",
    destinationCountry: "",
    carCode: "",
  });
  const newLeadCounter = useRef(0);

  const newLeadValid = newLead.name.trim() !== "" && newLead.whatsapp.trim() !== "";

  const resetNewLead = () => {
    setNewLead({
      name: "",
      whatsapp: "",
      email: "",
      destinationCity: "",
      destinationCountry: "",
      carCode: "",
    });
  };

  // Create a lead from the inline form, add it to the list, and select it.
  // Session-local for now — wire to a server action once lead persistence
  // exists. All non-essential Lead fields default to empty/unclassified.
  const addNewLead = () => {
    if (!newLeadValid) return;
    newLeadCounter.current += 1;
    const lead: Lead = {
      id: `lead-new-${newLeadCounter.current}`,
      createdAt: new Date().toISOString(),
      name: newLead.name.trim(),
      whatsapp: newLead.whatsapp.trim(),
      email: newLead.email.trim(),
      carCode: newLead.carCode.trim() || null,
      preferredBrand: null,
      preferredModel: null,
      screenshotUrls: [],
      budgetMinUsd: null,
      budgetMaxUsd: null,
      timeline: null,
      conditionPreference: null,
      bodyTypePreferences: [],
      destinationCity: newLead.destinationCity.trim() || null,
      destinationCountry: newLead.destinationCountry.trim() || null,
      notes: null,
      status: "new",
      track: "unclassified",
      sourceDeadline: null,
      waitResponse: "pending",
      waitResponseAt: null,
      autoReplySentAt: null,
      assignedTo: null,
      closedLostReason: null,
      closedWonInventoryId: null,
    };
    setLeads((prev) => [lead, ...prev]);
    setSelectedLeadId(lead.id);
    resetNewLead();
    setShowNewLead(false);
  };

  // Resolve the "active" car for the quote based on the current mode.
  const activeCar = useMemo(() => {
    if (mode === "matched" && matchedInventory) {
      return {
        carCode: matchedInventory.carCode,
        carName: `${matchedInventory.year} ${matchedInventory.brand} ${matchedInventory.model}`,
        condition: matchedInventory.condition,
        photo: matchedInventory.heroImageUrl,
        basePriceUsd: matchedInventory.priceUsdFob,
      };
    }
    return {
      carCode: "—",
      carName:
        [manualYear, manualBrand, manualModel].filter(Boolean).join(" ") ||
        "Untitled",
      condition: manualCondition,
      photo: null,
      basePriceUsd: Number(manualBaseUsd) || 0,
    };
  }, [
    matchedInventory,
    mode,
    manualBrand,
    manualModel,
    manualYear,
    manualCondition,
    manualBaseUsd,
  ]);

  const basePrice = activeCar.basePriceUsd;
  const shippingValue = Number(shippingUsd) || 0;
  const clearingValue = clearingTbc ? 0 : Number(clearingUsd) || 0;
  const exportLicenseValue = Number(exportLicenseUsd) || 0;
  const totalUsd =
    basePrice + shippingValue + clearingValue + exportLicenseValue;
  const rateValue = Number(exchangeRateNgn) || 0;

  const validUntil = useMemo(() => {
    const d = new Date("2026-05-16T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + QUOTE_VALID_DAYS);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "Africa/Lagos",
    });
  }, []);

  const missingFields: string[] = [];
  if (!selectedLead) missingFields.push("a lead");
  if (activeCar.basePriceUsd <= 0) missingFields.push("the FOB price");
  if (shippingValue <= 0) missingFields.push("shipping cost");
  if (!clearingTbc && clearingValue <= 0) missingFields.push("clearing cost");
  if (exportLicenseValue <= 0) missingFields.push("export license cost");
  if (rateValue <= 0) missingFields.push("the NGN exchange rate");

  const canGenerate = missingFields.length === 0;

  const activeYear =
    mode === "matched" && matchedInventory
      ? matchedInventory.year
      : Number(manualYear) || new Date().getUTCFullYear();

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Render the live form state to a PDF via the preview route and open it
  // in a new tab. This is the same QuoteDocument that the real send uses,
  // so it's an accurate preview of the customer-facing PDF.
  const generatePdf = async () => {
    if (!canGenerate || isGenerating) return;
    setIsGenerating(true);
    setPdfError(null);
    try {
      const res = await fetch("/admin/preview/quote-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selectedLead?.id,
          clientName: selectedLead?.name,
          clientWhatsapp: selectedLead?.whatsapp,
          destinationCity: selectedLead?.destinationCity ?? null,
          carCode: activeCar.carCode,
          carName: activeCar.carName,
          carYear: activeYear,
          carCondition: activeCar.condition,
          photoUrls: activeCar.photo ? [activeCar.photo] : [],
          basePriceUsd: basePrice,
          shippingUsd: shippingValue,
          clearingUsd: clearingTbc ? null : clearingValue,
          serviceFeeUsd: exportLicenseValue,
          totalUsd,
          exchangeRateNgn: rateValue > 0 ? rateValue : null,
          personalNote: personalNote || null,
          validUntil,
        }),
      });
      if (!res.ok) throw new Error(`Preview failed (${res.status})`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      // Revoke after a beat so the new tab has time to load the blob.
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error) {
      console.error("[QuoteBuilder] PDF preview failed:", error);
      setPdfError(
        error instanceof Error ? error.message : "Could not render the PDF.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const fireAction = (label: string) => {
    if (!canGenerate) return;
    console.log(label, {
      leadId: selectedLead?.id,
      mode,
      car: activeCar,
      totalUsd,
      shippingUsd: shippingValue,
      clearingUsd: clearingTbc ? null : clearingValue,
      exportLicenseUsd: exportLicenseValue,
      exchangeRateNgn: rateValue,
      personalNote,
      validUntil,
    });
    window.alert(`${label} — see console for payload`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* ---------- LEFT: form ---------- */}
      <div className="space-y-4">
        {/* Client */}
        <section className="overflow-hidden rounded-xl border border-hairline bg-white">
          <header className="flex items-center justify-between border-b border-hairline px-5 py-3.5">
            <div>
              <h2 className="font-display text-[14px] font-semibold tracking-tight text-corporate-black">
                Client
              </h2>
              <p className="mt-0.5 text-[11.5px] text-text-tertiary">
                Pick which lead this quote is for
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowNewLead((v) => !v)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors",
                  showNewLead
                    ? "border-cch-red/30 bg-cch-red/10 text-cch-red"
                    : "border-hairline bg-white text-text-secondary hover:bg-surface-tint hover:text-corporate-black",
                )}
              >
                <UserPlus className="size-3.5" />
                New lead
              </button>
              <span className="rounded-full bg-corporate-black/5 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-corporate-black/70">
                Step 1
              </span>
            </div>
          </header>

          {showNewLead ? (
            <div className="border-b border-hairline bg-surface-tint/60 px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[12px] font-semibold text-corporate-black">
                  Add a new lead
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewLead(false);
                    resetNewLead();
                  }}
                  className="inline-flex size-6 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-corporate-black/5 hover:text-corporate-black"
                  aria-label="Cancel new lead"
                >
                  <X className="size-3.5" />
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <NewLeadField
                  label="Name"
                  required
                  placeholder="e.g. Funmi Adeyemi"
                  value={newLead.name}
                  onChange={(v) => setNewLead((p) => ({ ...p, name: v }))}
                />
                <NewLeadField
                  label="WhatsApp"
                  required
                  placeholder="e.g. +234 802 000 0000"
                  value={newLead.whatsapp}
                  onChange={(v) => setNewLead((p) => ({ ...p, whatsapp: v }))}
                />
                <NewLeadField
                  label="Email"
                  type="email"
                  placeholder="e.g. funmi@email.com"
                  value={newLead.email}
                  onChange={(v) => setNewLead((p) => ({ ...p, email: v }))}
                />
                <NewLeadField
                  label="Car code (optional)"
                  placeholder="e.g. CCH-1039"
                  value={newLead.carCode}
                  onChange={(v) => setNewLead((p) => ({ ...p, carCode: v }))}
                />
                <NewLeadField
                  label="Destination city"
                  placeholder="e.g. Lagos"
                  value={newLead.destinationCity}
                  onChange={(v) =>
                    setNewLead((p) => ({ ...p, destinationCity: v }))
                  }
                />
                <NewLeadField
                  label="Destination country"
                  placeholder="e.g. Nigeria"
                  value={newLead.destinationCountry}
                  onChange={(v) =>
                    setNewLead((p) => ({ ...p, destinationCountry: v }))
                  }
                />
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewLead(false);
                    resetNewLead();
                  }}
                  className="rounded-full px-3 py-1.5 text-[12px] font-medium text-text-secondary transition-colors hover:text-corporate-black"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addNewLead}
                  disabled={!newLeadValid}
                  className="inline-flex items-center gap-1.5 rounded-full bg-cch-red px-3.5 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-cch-red-hover disabled:cursor-not-allowed disabled:bg-cch-red/40"
                >
                  <UserPlus className="size-3.5" />
                  Add &amp; select
                </button>
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 px-5 py-4 md:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                Lead
              </span>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="h-9 rounded-md border border-hairline bg-white px-3 text-[13px] text-corporate-black focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
              >
                <option value="">— Choose a lead —</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name}
                    {lead.carCode ? ` · ${lead.carCode}` : ""}
                    {lead.destinationCity ? ` · ${lead.destinationCity}` : ""}
                  </option>
                ))}
              </select>
            </label>

            {selectedLead ? (
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                  Contact
                </span>
                <div className="rounded-md border border-hairline bg-surface-tint px-3 py-2 text-[12.5px] text-corporate-black">
                  <p className="font-medium">{selectedLead.name}</p>
                  <p className="mt-0.5 text-text-secondary">
                    {selectedLead.whatsapp} · {selectedLead.email}
                  </p>
                  {selectedLead.destinationCity ? (
                    <p className="mt-0.5 text-text-tertiary">
                      Destination: {selectedLead.destinationCity},{" "}
                      {selectedLead.destinationCountry ?? "—"}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* Vehicle */}
        <section className="overflow-hidden rounded-xl border border-hairline bg-white">
          <header className="flex items-center justify-between border-b border-hairline px-5 py-3.5">
            <div>
              <h2 className="font-display text-[14px] font-semibold tracking-tight text-corporate-black">
                Vehicle
              </h2>
              <p className="mt-0.5 text-[11.5px] text-text-tertiary">
                {mode === "matched"
                  ? "Pulled from inventory"
                  : "Entered manually (source-to-order)"}
              </p>
            </div>
            <div className="flex rounded-full bg-corporate-black/5 p-0.5 text-[11.5px] font-medium">
              <button
                type="button"
                onClick={() => setMode("matched")}
                disabled={!matchedInventory}
                className={cn(
                  "rounded-full px-3 py-1 transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                  mode === "matched"
                    ? "bg-white text-corporate-black shadow-[0_1px_0_rgba(15,23,42,0.06)]"
                    : "text-text-secondary hover:text-corporate-black",
                )}
              >
                Matched
              </button>
              <button
                type="button"
                onClick={() => setMode("manual")}
                className={cn(
                  "rounded-full px-3 py-1 transition-colors",
                  mode === "manual"
                    ? "bg-white text-corporate-black shadow-[0_1px_0_rgba(15,23,42,0.06)]"
                    : "text-text-secondary hover:text-corporate-black",
                )}
              >
                Manual
              </button>
            </div>
          </header>

          {mode === "matched" && matchedInventory ? (
            <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
              <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-surface-warm">
                {matchedInventory.heroImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={matchedInventory.heroImageUrl}
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : null}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-corporate-black">
                  {matchedInventory.year} {matchedInventory.brand}{" "}
                  {matchedInventory.model}
                </p>
                <p className="mt-0.5 text-[12px] text-text-secondary">
                  <span className="font-medium text-corporate-black/75">
                    {matchedInventory.carCode}
                  </span>
                  {" · "}
                  {matchedInventory.condition === "new" ? "New" : "Used"}
                  {matchedInventory.bodyType
                    ? ` · ${matchedInventory.bodyType}`
                    : ""}
                </p>
                {matchedInventory.batteryHealthPct ? (
                  <p className="mt-0.5 text-[11.5px] text-text-tertiary">
                    Battery health {matchedInventory.batteryHealthPct}%
                    {matchedInventory.mileageKm
                      ? ` · ${matchedInventory.mileageKm.toLocaleString()} km`
                      : ""}
                  </p>
                ) : null}
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[10.5px] font-medium uppercase tracking-wide text-text-tertiary">
                  FOB Guangzhou
                </p>
                <p className="mt-1 font-display text-[18px] font-semibold tabular-nums text-corporate-black">
                  {formatUsd(matchedInventory.priceUsdFob)}
                </p>
              </div>
            </div>
          ) : null}

          {mode === "manual" ? (
            <div className="grid gap-4 px-5 py-4 md:grid-cols-2">
              {selectedLead && !matchedInventory ? (
                <div className="md:col-span-2 inline-flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-[12px] text-amber-700">
                  <AlertTriangle className="size-3.5 shrink-0" />
                  <span>
                    No matching inventory for this lead — enter the car you
                    plan to source.
                  </span>
                </div>
              ) : null}
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                  Year
                </span>
                <input
                  type="number"
                  min="2015"
                  max="2030"
                  value={manualYear}
                  onChange={(e) => setManualYear(e.target.value)}
                  className="h-9 rounded-md border border-hairline bg-white px-3 text-[13px] tabular-nums focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                  Condition
                </span>
                <select
                  value={manualCondition}
                  onChange={(e) =>
                    setManualCondition(e.target.value as "new" | "used")
                  }
                  className="h-9 rounded-md border border-hairline bg-white px-3 text-[13px] focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                  Brand
                </span>
                <input
                  type="text"
                  placeholder="e.g. BYD"
                  value={manualBrand}
                  onChange={(e) => setManualBrand(e.target.value)}
                  className="h-9 rounded-md border border-hairline bg-white px-3 text-[13px] focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                  Model
                </span>
                <input
                  type="text"
                  placeholder="e.g. Atto 3"
                  value={manualModel}
                  onChange={(e) => setManualModel(e.target.value)}
                  className="h-9 rounded-md border border-hairline bg-white px-3 text-[13px] focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                  FOB Guangzhou price (USD)
                </span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-text-tertiary">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="18900"
                    value={manualBaseUsd}
                    onChange={(e) => setManualBaseUsd(e.target.value)}
                    className="h-9 w-full rounded-md border border-hairline bg-white pl-7 pr-3 text-[13px] tabular-nums focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
                  />
                </div>
              </label>
            </div>
          ) : null}
        </section>

        {/* Pricing */}
        <section className="overflow-hidden rounded-xl border border-hairline bg-white">
          <header className="flex items-center justify-between border-b border-hairline px-5 py-3.5">
            <div>
              <h2 className="font-display text-[14px] font-semibold tracking-tight text-corporate-black">
                Pricing
              </h2>
              <p className="mt-0.5 text-[11.5px] text-text-tertiary">
                Land it at the destination, all-in
              </p>
            </div>
            <span className="rounded-full bg-corporate-black/5 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-corporate-black/70">
              Step 3
            </span>
          </header>
          <div className="divide-y divide-hairline">
            {/* Base */}
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <div>
                <p className="text-[13px] font-medium text-corporate-black">
                  FOB Guangzhou
                </p>
                <p className="text-[11.5px] text-text-tertiary">
                  Base price of the vehicle
                </p>
              </div>
              <span className="font-display text-[15px] font-semibold tabular-nums text-corporate-black">
                {formatUsd(basePrice)}
              </span>
            </div>

            {/* Shipping */}
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <div>
                <p className="text-[13px] font-medium text-corporate-black">
                  Ocean shipping
                </p>
                <p className="text-[11.5px] text-text-tertiary">
                  Quoted by the freight forwarder per car
                </p>
              </div>
              <PriceInput
                value={shippingUsd}
                onChange={setShippingUsd}
                placeholder="e.g. 2200"
                required
              />
            </div>

            {/* Clearing */}
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <div>
                <p className="text-[13px] font-medium text-corporate-black">
                  Clearing & duties
                </p>
                <label className="mt-1 inline-flex items-center gap-1.5 text-[11.5px] text-text-tertiary">
                  <input
                    type="checkbox"
                    checked={clearingTbc}
                    onChange={(e) => setClearingTbc(e.target.checked)}
                    className="size-3.5 rounded border-hairline text-cch-red focus:ring-cch-red/30"
                  />
                  Confirm at landing
                </label>
              </div>
              {clearingTbc ? (
                <span className="text-[12px] italic text-text-tertiary">
                  To be confirmed
                </span>
              ) : (
                <PriceInput
                  value={clearingUsd}
                  onChange={setClearingUsd}
                  placeholder="e.g. 1800"
                  required
                />
              )}
            </div>

            {/* Export license */}
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <div>
                <p className="text-[13px] font-medium text-corporate-black">
                  Export license
                </p>
                <p className="text-[11.5px] text-text-tertiary">
                  China export permit + paperwork
                </p>
              </div>
              <PriceInput
                value={exportLicenseUsd}
                onChange={setExportLicenseUsd}
                placeholder="e.g. 1500"
                required
              />
            </div>

            {/* FX rate */}
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <div>
                <p className="text-[13px] font-medium text-corporate-black">
                  Exchange rate
                </p>
                <p className="text-[11.5px] text-text-tertiary">
                  NGN per USD · locked on this quote
                </p>
              </div>
              <div className="relative w-32">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11.5px] font-medium uppercase tracking-wide text-text-tertiary">
                  ₦
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="1"
                  value={exchangeRateNgn}
                  placeholder="1620"
                  onChange={(e) => setExchangeRateNgn(e.target.value)}
                  className={cn(
                    "h-9 w-full rounded-md border bg-white pl-7 pr-3 text-right text-[13px] font-medium tabular-nums placeholder:text-text-tertiary placeholder:font-normal focus:outline-none focus:ring-2",
                    rateValue <= 0
                      ? "border-cch-red/30 focus:border-cch-red focus:ring-cch-red/15"
                      : "border-hairline focus:border-cch-red focus:ring-cch-red/15",
                  )}
                />
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between gap-4 bg-surface-tint px-5 py-4">
              <div>
                <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                  Total landed
                </p>
                <p className="mt-1 text-[11.5px] text-text-secondary tabular-nums">
                  {rateValue > 0
                    ? `≈ ₦${Math.round(totalUsd * rateValue).toLocaleString("en-NG")} at ₦${rateValue.toLocaleString("en-NG")}/USD`
                    : "Set the FX rate to see the Naira total"}
                </p>
              </div>
              <span className="font-display text-[28px] font-semibold leading-none tabular-nums text-corporate-black">
                {formatUsd(totalUsd)}
              </span>
            </div>
          </div>
        </section>

        {/* Personal note */}
        <section className="overflow-hidden rounded-xl border border-hairline bg-white">
          <header className="flex items-center justify-between border-b border-hairline px-5 py-3.5">
            <div>
              <h2 className="font-display text-[14px] font-semibold tracking-tight text-corporate-black">
                Personal note
              </h2>
              <p className="mt-0.5 text-[11.5px] text-text-tertiary">
                Appears above the totals in the PDF (optional)
              </p>
            </div>
          </header>
          <div className="px-5 py-4">
            <textarea
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              rows={4}
              maxLength={400}
              placeholder={`Hi ${selectedLead?.name?.split(" ")[0] ?? "there"}, here's a fresh quote on the car we discussed…`}
              className="w-full rounded-md border border-hairline bg-white px-3 py-2 text-[13px] leading-relaxed text-corporate-black placeholder:text-text-tertiary focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
            />
            <p className="mt-1 text-right text-[11px] text-text-tertiary tabular-nums">
              {personalNote.length}/400
            </p>
          </div>
        </section>
      </div>

      {/* ---------- RIGHT: live summary + actions ---------- */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <QuoteSummary
          lead={selectedLead}
          car={activeCar}
          basePrice={basePrice}
          shippingUsd={shippingValue}
          clearingUsd={clearingTbc ? null : clearingValue}
          exportLicenseUsd={exportLicenseValue}
          totalUsd={totalUsd}
          exchangeRateNgn={rateValue > 0 ? rateValue : null}
          validUntil={validUntil}
        />
        <div className="mt-3 space-y-2">
          <button
            type="button"
            disabled={!canGenerate || isGenerating}
            onClick={generatePdf}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cch-red px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(230,57,70,0.25)] transition-colors hover:bg-cch-red-hover disabled:cursor-not-allowed disabled:bg-cch-red/40 disabled:shadow-none"
          >
            <FileText className="size-4" />
            {isGenerating ? "Rendering…" : "Preview PDF"}
          </button>
          <button
            type="button"
            disabled={!canGenerate}
            onClick={() => fireAction("Generate and email PDF")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-hairline bg-white px-4 py-2.5 text-[13px] font-semibold text-corporate-black transition-colors hover:bg-surface-tint disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Mail className="size-4" />
            Generate &amp; email PDF
          </button>
          <button
            type="button"
            disabled={!canGenerate || isGenerating}
            onClick={generatePdf}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-hairline bg-white px-4 py-2.5 text-[13px] font-semibold text-corporate-black transition-colors hover:bg-surface-tint disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="size-4" />
            Generate &amp; download PDF
          </button>
          <button
            type="button"
            disabled={!canGenerate}
            onClick={() => fireAction("Save as draft")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-medium text-text-secondary transition-colors hover:bg-surface-tint hover:text-corporate-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="size-3.5" />
            Save as draft
          </button>
        </div>
        {!canGenerate ? (
          <div className="mt-3 flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2 text-[11.5px] text-amber-700">
            <FileText className="mt-px size-3.5 shrink-0" />
            <span>
              Missing: {missingFields.join(", ")}.
            </span>
          </div>
        ) : null}
        {pdfError ? (
          <div className="mt-3 flex items-start gap-2 rounded-md bg-cch-red/10 px-3 py-2 text-[11.5px] text-cch-red">
            <AlertTriangle className="mt-px size-3.5 shrink-0" />
            <span>{pdfError}</span>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function NewLeadField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "email";
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
        {label}
        {required ? <span className="text-cch-red"> *</span> : null}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-hairline bg-white px-3 text-[13px] text-corporate-black placeholder:text-text-tertiary focus:border-cch-red focus:outline-none focus:ring-2 focus:ring-cch-red/15"
      />
    </label>
  );
}

function PriceInput({
  value,
  onChange,
  placeholder,
  required = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const missing = required && (!value || Number(value) <= 0);
  return (
    <div className="relative w-32">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-text-tertiary">
        $
      </span>
      <input
        type="number"
        min="0"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-9 w-full rounded-md border bg-white pl-7 pr-3 text-right text-[13px] font-medium tabular-nums placeholder:text-text-tertiary placeholder:font-normal focus:outline-none focus:ring-2",
          missing
            ? "border-cch-red/30 focus:border-cch-red focus:ring-cch-red/15"
            : "border-hairline focus:border-cch-red focus:ring-cch-red/15",
        )}
      />
    </div>
  );
}
