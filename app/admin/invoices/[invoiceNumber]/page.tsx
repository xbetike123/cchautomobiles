import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { InvoiceActions } from "@/components/admin/invoices/InvoiceActions";
import {
  INVOICE_KIND_LABEL,
  INVOICE_STATUS_LABEL,
  formatNgn,
  formatUsd,
} from "@/lib/admin/format";
import {
  getChildBalanceInvoice,
  getInvoiceById,
  getInvoiceByNumber,
} from "@/lib/admin/queries/invoices";
import type { InvoiceKind, InvoiceStatus } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const KIND_TONE: Record<InvoiceKind, string> = {
  deposit: "bg-sky-50 text-sky-700 border-sky-200",
  balance: "bg-cch-red-soft text-cch-red border-cch-red/30",
  single: "bg-corporate-black/5 text-corporate-black border-hairline",
};

// CCH receives payment by bank transfer only. These details are printed on
// every invoice. Replace placeholder strings with real account info via
// /admin/settings once that surface is wired.
const CCH_BANK_ACCOUNTS = [
  {
    currency: "USD",
    bankName: "Bank of China · Guangzhou",
    accountName: "Naiyuan Mart Ltd.",
    accountNumber: "XXXX-XXXX-XXXX-XXXX",
    swift: "BKCHCNBJ",
    note: "International USD wires.",
  },
  {
    currency: "NGN",
    bankName: "Guaranty Trust Bank",
    accountName: "Naiyuan Mart Ltd.",
    accountNumber: "0000000000",
    swift: "GTBINGLA",
    note: "Local Naira transfers.",
  },
] as const;

const STATUS_TONE: Record<InvoiceStatus, string> = {
  draft: "bg-corporate-black/5 text-text-secondary",
  sent: "bg-sky-100 text-sky-700",
  paid: "bg-emerald-100 text-emerald-700",
  overdue: "bg-cch-red-soft text-cch-red",
  refunded: "bg-corporate-black/8 text-corporate-black",
  void: "bg-corporate-black/5 text-text-tertiary",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string | null): string {
  if (!value) return "—";
  return dateFormatter.format(new Date(value));
}

function amountLabelForKind(kind: InvoiceKind): string {
  if (kind === "deposit") return "Deposit due";
  if (kind === "balance") return "Balance due";
  return "Amount due";
}

type PageProps = {
  params: Promise<{ invoiceNumber: string }>;
};

export default async function AdminInvoiceDetailPage({ params }: PageProps) {
  const { invoiceNumber } = await params;
  const decoded = decodeURIComponent(invoiceNumber);
  const invoice = await getInvoiceByNumber(decoded);
  if (!invoice) notFound();

  // Resolve the matching half of the pair (deposit ↔ balance) so we can link
  // back and forth from the detail header.
  const [parentInvoice, childBalance] = await Promise.all([
    invoice.kind === "balance" && invoice.parentInvoiceId
      ? getInvoiceById(invoice.parentInvoiceId)
      : Promise.resolve(null),
    invoice.kind === "deposit" ? getChildBalanceInvoice(invoice.id) : Promise.resolve(null),
  ]);

  return (
    <>
      <AdminHeader
        eyebrow={`Billing · ${invoice.invoiceNumber}`}
        title={invoice.clientName}
        description={invoice.carDescription ?? "Custom charge"}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/invoices"
              className="hidden items-center gap-1.5 rounded-full border border-hairline bg-white px-3.5 py-2 text-[12.5px] font-medium text-corporate-black transition-colors hover:bg-corporate-black hover:text-white sm:inline-flex"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Back
            </Link>
            <InvoiceActions
              invoiceNumber={invoice.invoiceNumber}
              clientName={invoice.clientName}
              status={invoice.status}
            />
          </div>
        }
      />

      <div className="flex-1 px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <section className="rounded-xl border border-hairline bg-white p-6 shadow-card md:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                      Invoice
                    </p>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.1em]",
                        KIND_TONE[invoice.kind],
                      )}
                    >
                      {INVOICE_KIND_LABEL[invoice.kind]}
                    </span>
                  </div>
                  <p className="mt-1 font-display text-[24px] font-semibold tabular-nums text-corporate-black">
                    {invoice.invoiceNumber}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium",
                    STATUS_TONE[invoice.status],
                  )}
                >
                  {INVOICE_STATUS_LABEL[invoice.status]}
                </span>
              </div>

              {parentInvoice ? (
                <Link
                  href={`/admin/invoices/${parentInvoice.invoiceNumber}`}
                  className="mt-4 flex items-start justify-between gap-3 rounded-lg border border-hairline bg-surface-tint/60 px-4 py-3 transition-colors hover:bg-surface-tint"
                >
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-tertiary">
                      Deposit invoice
                    </p>
                    <p className="mt-0.5 text-[13.5px] font-medium tabular-nums text-corporate-black">
                      {parentInvoice.invoiceNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-medium tabular-nums text-corporate-black">
                      {formatUsd(parentInvoice.amountUsd)}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-text-tertiary">
                      {INVOICE_STATUS_LABEL[parentInvoice.status]}
                    </p>
                  </div>
                </Link>
              ) : null}

              {childBalance ? (
                <Link
                  href={`/admin/invoices/${childBalance.invoiceNumber}`}
                  className="mt-4 flex items-start justify-between gap-3 rounded-lg border border-hairline bg-surface-tint/60 px-4 py-3 transition-colors hover:bg-surface-tint"
                >
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-tertiary">
                      Balance invoice
                    </p>
                    <p className="mt-0.5 text-[13.5px] font-medium tabular-nums text-corporate-black">
                      {childBalance.invoiceNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-medium tabular-nums text-corporate-black">
                      {formatUsd(childBalance.amountUsd)}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-text-tertiary">
                      {INVOICE_STATUS_LABEL[childBalance.status]}
                    </p>
                  </div>
                </Link>
              ) : null}

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                <Stat
                  label={amountLabelForKind(invoice.kind)}
                  value={formatUsd(invoice.amountUsd)}
                  emphasis
                />
                <Stat label="Issued" value={formatDate(invoice.issuedAt)} />
                <Stat label="Due" value={formatDate(invoice.dueAt)} />
                <Stat
                  label="Paid"
                  value={invoice.paidAt ? formatDate(invoice.paidAt) : "—"}
                />
                {invoice.exchangeRateNgn ? (
                  <>
                    <Stat
                      label="Rate (1 USD)"
                      value={`₦${invoice.exchangeRateNgn.toLocaleString("en-NG")}`}
                    />
                    <Stat
                      label="Amount in NGN"
                      value={formatNgn(invoice.amountUsd * invoice.exchangeRateNgn)}
                    />
                  </>
                ) : null}
              </dl>
            </section>

            <section className="rounded-xl border border-hairline bg-white p-6 shadow-card md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[15px] font-semibold tracking-tight text-corporate-black">
                    Payment instructions
                  </h2>
                  <p className="mt-1 text-[13px] text-text-secondary">
                    Bank transfer only. Pay into the account that matches your
                    preferred currency.
                  </p>
                </div>
                {invoice.exchangeRateNgn ? (
                  <span className="shrink-0 rounded-full bg-surface-tint px-3 py-1 text-[11.5px] font-medium tabular-nums text-corporate-black">
                    1 USD = ₦{invoice.exchangeRateNgn.toLocaleString("en-NG")}
                  </span>
                ) : null}
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {CCH_BANK_ACCOUNTS.map((acct) => (
                  <div
                    key={acct.currency}
                    className="rounded-lg border border-hairline bg-surface-tint/40 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-tertiary">
                        Account · {acct.currency}
                      </p>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-corporate-black">
                        {acct.currency}
                      </span>
                    </div>
                    <dl className="mt-3 space-y-2 text-[13px]">
                      <BankRow label="Bank" value={acct.bankName} />
                      <BankRow label="Account name" value={acct.accountName} />
                      <BankRow label="Account number" value={acct.accountNumber} mono />
                      <BankRow label="SWIFT" value={acct.swift} mono />
                    </dl>
                    <p className="mt-3 text-[11.5px] text-text-tertiary">
                      {acct.note}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-hairline bg-white p-6 shadow-card md:p-7">
              <h2 className="text-[15px] font-semibold tracking-tight text-corporate-black">
                Vehicle
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Row
                  label="Description"
                  value={invoice.carDescription ?? "—"}
                />
                <Row
                  label="Car code"
                  value={
                    invoice.carCode ? (
                      <Link
                        href={`/admin/inventory/${invoice.carCode}`}
                        className="text-corporate-black underline decoration-hairline underline-offset-4 hover:decoration-corporate-black"
                      >
                        {invoice.carCode}
                      </Link>
                    ) : (
                      "—"
                    )
                  }
                />
                <Row
                  label="Linked lead"
                  value={
                    invoice.leadId ? (
                      <Link
                        href={`/admin/leads/${invoice.leadId}`}
                        className="text-corporate-black underline decoration-hairline underline-offset-4 hover:decoration-corporate-black"
                      >
                        {invoice.leadId}
                      </Link>
                    ) : (
                      "—"
                    )
                  }
                />
                <Row label="Payment method" value={invoice.paymentMethod ?? "—"} />
              </div>
            </section>

            <section className="rounded-xl border border-hairline bg-white p-6 shadow-card md:p-7">
              <h2 className="text-[15px] font-semibold tracking-tight text-corporate-black">
                Internal notes
              </h2>
              <p className="mt-3 text-[13.5px] leading-[1.55] text-corporate-black">
                {invoice.notes ? (
                  invoice.notes
                ) : (
                  <span className="text-text-tertiary">
                    No internal notes recorded.
                  </span>
                )}
              </p>
            </section>
          </div>

          <aside className="flex flex-col gap-4 lg:col-span-4 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-hairline bg-white p-5 shadow-card">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                Bill to
              </p>
              <p className="mt-1 text-[15px] font-medium text-corporate-black">
                {invoice.clientName}
              </p>
              {invoice.clientEmail ? (
                <p className="mt-0.5 break-all text-[12.5px] text-text-secondary">
                  {invoice.clientEmail}
                </p>
              ) : null}
            </div>

            <div className="rounded-xl border border-hairline bg-white p-5 shadow-card">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                Timestamps
              </p>
              <dl className="mt-3 space-y-2 text-[12.5px]">
                <Timeline label="Created" value={formatDate(invoice.createdAt)} />
                <Timeline label="Updated" value={formatDate(invoice.updatedAt)} />
                <Timeline label="Issued" value={formatDate(invoice.issuedAt)} />
                <Timeline label="Due" value={formatDate(invoice.dueAt)} />
                {invoice.paidAt ? (
                  <Timeline label="Paid" value={formatDate(invoice.paidAt)} />
                ) : null}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  emphasis,
  tone,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  tone?: "alert" | "good";
}) {
  return (
    <div>
      <dt className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-text-tertiary">
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1 tabular-nums",
          emphasis
            ? "font-display text-[22px] font-semibold text-corporate-black"
            : "text-[15px] font-medium text-corporate-black",
          tone === "alert" && "text-cch-red",
          tone === "good" && "text-emerald-700",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-tertiary">
        {label}
      </dt>
      <dd className="mt-1 text-[14px] text-corporate-black">{value}</dd>
    </div>
  );
}

function BankRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-tertiary">
        {label}
      </dt>
      <dd
        className={cn(
          "text-corporate-black",
          mono && "font-mono tabular-nums tracking-wider",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function Timeline({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-text-tertiary">{label}</dt>
      <dd className="font-medium text-corporate-black">{value}</dd>
    </div>
  );
}
