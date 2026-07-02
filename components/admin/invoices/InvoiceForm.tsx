"use client";

import { Check, Save } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { InvoiceKind, InvoiceStatus } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "refunded", label: "Refunded" },
  { value: "void", label: "Void" },
];

// Payment is always bank transfer. Buyers wire USD or NGN; the rate is captured
// per-invoice below so it shows on the rendered invoice.
const PAYMENT_METHOD = "Bank transfer";
const DEFAULT_NGN_RATE = 1620;

type Mode = "single" | "pair";

function inputClass(extra?: string) {
  return cn(
    "h-11 w-full rounded-lg border border-hairline bg-white px-4 text-[14px] text-corporate-black placeholder:text-text-tertiary focus:border-corporate-black/40 focus:outline-none focus:ring-2 focus:ring-corporate-black/10",
    extra,
  );
}

function selectClass() {
  return cn(
    inputClass(),
    "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%23999%22><path d=%22M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414z%22/></svg>')] bg-[length:16px_16px] bg-[position:right_12px_center] bg-no-repeat pr-10",
  );
}

function Field({
  label,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
        {label}
        {required ? <span className="ml-1 text-cch-red">*</span> : null}
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function UsdInput({
  value,
  onChange,
  step = 100,
  required,
}: {
  value: string;
  onChange: (next: string) => void;
  step?: number;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-text-tertiary">
        $
      </span>
      <input
        required={required}
        type="number"
        inputMode="decimal"
        min={0}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass("pl-8")}
      />
    </div>
  );
}

function nextInvoiceNumberBase(): string {
  // Mock generator: real impl reads max(invoice_number) from Supabase.
  const stamp = String(Math.floor(Math.random() * 900) + 100);
  return `INV-2${stamp}`;
}

export function InvoiceForm() {
  const [mode, setMode] = useState<Mode>("pair");
  const [invoiceNumberBase, setInvoiceNumberBase] = useState(nextInvoiceNumberBase());
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [carDescription, setCarDescription] = useState("");
  const [carCode, setCarCode] = useState("");

  // Single-mode amount.
  const [amountUsd, setAmountUsd] = useState("");

  // Pair-mode breakdown: deposit + balance sum to vehicle total.
  const [depositUsd, setDepositUsd] = useState("1500");
  const [vehicleTotalUsd, setVehicleTotalUsd] = useState("");

  const [status, setStatus] = useState<InvoiceStatus>("draft");
  const [issuedAt, setIssuedAt] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [dueAt, setDueAt] = useState(() => {
    const due = new Date();
    due.setUTCDate(due.getUTCDate() + 14);
    return due.toISOString().slice(0, 10);
  });
  const [exchangeRateNgn, setExchangeRateNgn] = useState(String(DEFAULT_NGN_RATE));
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const balanceUsd = useMemo(() => {
    const total = Number(vehicleTotalUsd || 0);
    const deposit = Number(depositUsd || 0);
    return Math.max(0, total - deposit);
  }, [vehicleTotalUsd, depositUsd]);

  const depositInvoiceNumber = `${invoiceNumberBase}-D`;
  const balanceInvoiceNumber = `${invoiceNumberBase}-B`;
  const primaryInvoiceNumber =
    mode === "pair" ? depositInvoiceNumber : invoiceNumberBase;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const baseRecord = {
      clientName,
      clientEmail: clientEmail || null,
      carCode: carCode || null,
      carDescription: carDescription || null,
      status,
      issuedAt: `${issuedAt}T00:00:00Z`,
      dueAt: dueAt ? `${dueAt}T00:00:00Z` : null,
      paymentMethod: PAYMENT_METHOD,
      exchangeRateNgn: Number(exchangeRateNgn) || null,
      notes: notes || null,
    };

    if (mode === "pair") {
      // The deposit invoice is the parent; the balance invoice links back to it.
      // Real server action will return the deposit's id and assign it as
      // parentInvoiceId on the balance row.
      const depositPayload = {
        ...baseRecord,
        invoiceNumber: depositInvoiceNumber,
        kind: "deposit" as InvoiceKind,
        parentInvoiceId: null,
        amountUsd: Number(depositUsd),
      };
      const balancePayload = {
        ...baseRecord,
        invoiceNumber: balanceInvoiceNumber,
        kind: "balance" as InvoiceKind,
        parentInvoiceId: "__pending_deposit_id__",
        amountUsd: balanceUsd,
        // Balance is typically due a few weeks after the deposit. Caller can
        // override on the detail page.
        notes: notes || "Issue once deposit clears.",
      };
      console.log("[admin/invoices] create pair", {
        deposit: depositPayload,
        balance: balancePayload,
      });
    } else {
      const payload = {
        ...baseRecord,
        invoiceNumber: invoiceNumberBase,
        kind: "single" as InvoiceKind,
        parentInvoiceId: null,
        amountUsd: Number(amountUsd),
      };
      console.log("[admin/invoices] create single", payload);
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitting(false);
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="rounded-card-lg border border-emerald-200 bg-emerald-50 p-8 text-center shadow-card">
        <div className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="size-6" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-[18px] font-semibold text-corporate-black">
          {mode === "pair" ? "Invoice pair queued" : "Invoice queued"}
        </h2>
        <p className="mt-1 text-[13.5px] text-text-secondary">
          {mode === "pair" ? (
            <>
              {depositInvoiceNumber} (deposit) and {balanceInvoiceNumber}{" "}
              (balance) for {clientName} were logged. Persist to Supabase runs
              once the billing layer is wired.
            </>
          ) : (
            <>
              {invoiceNumberBase} for {clientName} was logged. Persist to
              Supabase runs once the billing layer is wired.
            </>
          )}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/admin/invoices/${primaryInvoiceNumber}`}
            className="inline-flex items-center rounded-full bg-cch-red px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_14px_rgba(230,57,70,0.25)] hover:bg-cch-red-hover"
          >
            View invoice
          </Link>
          <Link
            href="/admin/invoices"
            className="inline-flex items-center rounded-full border border-hairline bg-white px-5 py-2.5 text-[13px] font-semibold text-corporate-black hover:bg-corporate-black hover:text-white"
          >
            All invoices
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-12">
      <Section
        title="Mode"
        description="Vehicle sales issue a deposit + balance pair. One-shot charges (retainer, shipping uplift, refund) use Single."
      >
        <div className="md:col-span-2">
          <div className="inline-flex rounded-full border border-hairline bg-surface-tint p-1 text-[13px] font-medium">
            <ModeButton
              active={mode === "pair"}
              label="Deposit + Balance pair"
              onClick={() => setMode("pair")}
            />
            <ModeButton
              active={mode === "single"}
              label="Single invoice"
              onClick={() => setMode("single")}
            />
          </div>
        </div>
      </Section>

      <Section title="Invoice" description="Identity and dates.">
        <Field
          label={mode === "pair" ? "Invoice number base" : "Invoice number"}
          hint={
            mode === "pair"
              ? `Generates ${depositInvoiceNumber} + ${balanceInvoiceNumber}.`
              : undefined
          }
          required
        >
          <input
            required
            value={invoiceNumberBase}
            onChange={(event) => setInvoiceNumberBase(event.target.value)}
            placeholder="INV-2087"
            className={inputClass()}
          />
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as InvoiceStatus)}
            className={selectClass()}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Issued">
          <input
            type="date"
            value={issuedAt}
            onChange={(event) => setIssuedAt(event.target.value)}
            className={inputClass()}
          />
        </Field>
        <Field
          label={mode === "pair" ? "Deposit due" : "Due"}
          hint={
            mode === "pair"
              ? "Balance due date can be edited on the balance invoice after creation."
              : undefined
          }
        >
          <input
            type="date"
            value={dueAt}
            onChange={(event) => setDueAt(event.target.value)}
            className={inputClass()}
          />
        </Field>
      </Section>

      <Section title="Client" description="Where the invoice is billed.">
        <Field label="Client name" required>
          <input
            required
            value={clientName}
            onChange={(event) => setClientName(event.target.value)}
            placeholder="e.g. Adaeze Okonkwo"
            className={inputClass()}
          />
        </Field>
        <Field
          label="Email"
          hint="Optional. Used for invoice copies and reminders."
        >
          <input
            type="email"
            value={clientEmail}
            onChange={(event) => setClientEmail(event.target.value)}
            placeholder="name@example.com"
            className={inputClass()}
          />
        </Field>
      </Section>

      <Section
        title="Vehicle"
        description="What is this invoice for? Leave car fields blank for retainers or fees."
      >
        <Field label="Car description">
          <input
            value={carDescription}
            onChange={(event) => setCarDescription(event.target.value)}
            placeholder="2026 BYD Atto 3 · New"
            className={inputClass()}
          />
        </Field>
        <Field label="Car code" hint="Optional CCH-#### tie-back">
          <input
            value={carCode}
            onChange={(event) => setCarCode(event.target.value)}
            placeholder="CCH-1042"
            className={inputClass()}
          />
        </Field>
      </Section>

      {mode === "pair" ? (
        <Section
          title="Amounts"
          description="Vehicle total splits into the deposit invoice and the balance invoice."
        >
          <Field label="Vehicle total (USD)" required>
            <UsdInput
              required
              value={vehicleTotalUsd}
              onChange={setVehicleTotalUsd}
              step={100}
            />
          </Field>
          <Field label="Deposit invoice amount (USD)" required>
            <UsdInput required value={depositUsd} onChange={setDepositUsd} step={100} />
          </Field>
          <Field
            label="Balance invoice amount (USD)"
            hint="Auto-calculated. Shown on the balance invoice."
          >
            <input
              readOnly
              value={`$${balanceUsd.toLocaleString("en-US")}`}
              className={cn(inputClass(), "bg-surface-tint text-text-secondary")}
            />
          </Field>
          <Field
            label="Exchange rate (NGN per USD)"
            hint="Rate locked on both invoices. Printed alongside totals."
            required
          >
            <input
              required
              type="number"
              inputMode="decimal"
              min={0}
              step={1}
              value={exchangeRateNgn}
              onChange={(event) => setExchangeRateNgn(event.target.value)}
              className={inputClass()}
            />
          </Field>
          <Field
            label="Payment method"
            hint="Buyers wire payment to the USD or Naira account printed on the invoice."
            className="md:col-span-2"
          >
            <input
              readOnly
              value={PAYMENT_METHOD}
              className={cn(inputClass(), "bg-surface-tint text-corporate-black")}
            />
          </Field>
        </Section>
      ) : (
        <Section title="Amount" description="One-shot charge.">
          <Field label="Amount (USD)" required>
            <UsdInput required value={amountUsd} onChange={setAmountUsd} step={50} />
          </Field>
          <Field
            label="Exchange rate (NGN per USD)"
            hint="Rate locked on this invoice. Printed alongside totals."
            required
          >
            <input
              required
              type="number"
              inputMode="decimal"
              min={0}
              step={1}
              value={exchangeRateNgn}
              onChange={(event) => setExchangeRateNgn(event.target.value)}
              className={inputClass()}
            />
          </Field>
          <Field
            label="Payment method"
            hint="Buyers wire payment to the USD or Naira account printed on the invoice."
            className="md:col-span-2"
          >
            <input
              readOnly
              value={PAYMENT_METHOD}
              className={cn(inputClass(), "bg-surface-tint text-corporate-black")}
            />
          </Field>
        </Section>
      )}

      <Section title="Purchase Terms">
        <Field
          label="Purchase terms shown on invoice"
          className="md:col-span-2"
        >
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Enter payment timing, delivery conditions, or other purchase terms."
            rows={4}
            className={cn(inputClass(), "h-auto resize-y py-3 leading-[1.5]")}
          />
        </Field>
      </Section>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-end gap-3 border-t border-hairline bg-white/85 px-4 py-4 backdrop-blur-md md:-mx-6 md:px-6">
        <Link
          href="/admin/invoices"
          className="inline-flex items-center rounded-full border border-hairline bg-white px-5 py-2.5 text-[13px] font-semibold text-corporate-black transition-colors hover:bg-corporate-black hover:text-white"
        >
          Cancel
        </Link>
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
          {submitting
            ? "Saving"
            : mode === "pair"
              ? "Save deposit + balance"
              : "Save invoice"}
        </button>
      </div>
    </form>
  );
}

function ModeButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-4 py-1.5 transition-colors",
        active
          ? "bg-white text-corporate-black shadow-[0_2px_6px_rgba(15,23,42,0.06)]"
          : "text-text-secondary hover:text-corporate-black",
      )}
    >
      {label}
    </button>
  );
}
