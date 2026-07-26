import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { QuoteActions } from "@/components/admin/quotes/QuoteActions";
import {
  QUOTE_STATUS_LABEL,
  formatRelativeTime,
  formatUsd,
} from "@/lib/admin/format";
import { getQuoteById } from "@/lib/admin/queries/quotes";
import type { QuoteStatus } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<QuoteStatus, string> = {
  draft: "bg-corporate-black/5 text-text-secondary",
  sent: "bg-sky-100 text-sky-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-cch-red-soft text-cch-red",
  expired: "bg-amber-100 text-amber-700",
  superseded: "bg-corporate-black/5 text-text-tertiary",
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

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminQuoteDetailPage({ params }: PageProps) {
  const NOW_REFERENCE = new Date().toISOString();
  const { id } = await params;
  const decoded = decodeURIComponent(id);
  const quote = await getQuoteById(decoded);
  if (!quote) notFound();

  const lineItems = [
    { label: "Base price", value: quote.basePriceUsd },
    { label: "Shipping", value: quote.shippingUsd },
    quote.clearingUsd != null
      ? { label: "Clearing", value: quote.clearingUsd }
      : null,
    { label: "Export licence", value: quote.serviceFeeUsd },
  ].filter((line): line is { label: string; value: number } => line !== null);

  return (
    <>
      <AdminHeader
        eyebrow={`Quote · ${quote.id}`}
        title={`${quote.carName} for ${quote.clientName}`}
        description={`${quote.carCondition === "new" ? "New" : "Used"} · ${quote.carCode}`}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/quotes"
              className="hidden items-center gap-1.5 rounded-full border border-hairline bg-white px-3.5 py-2 text-[12.5px] font-medium text-corporate-black transition-colors hover:bg-corporate-black hover:text-white sm:inline-flex"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Back
            </Link>
            <QuoteActions
              quoteId={quote.id}
              carName={quote.carName}
              status={quote.status}
            />
          </div>
        }
      />

      <div className="flex-1 px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <section className="overflow-hidden rounded-xl border border-hairline bg-white shadow-card">
              {quote.photoUrls.length > 0 ? (
                <div className="relative aspect-[16/9] w-full bg-surface-warm">
                  <Image
                    src={quote.photoUrls[0]}
                    alt={quote.carName}
                    fill
                    sizes="(min-width: 1024px) 800px, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : null}
              <div className="p-6 md:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                      Vehicle
                    </p>
                    <p className="mt-1 font-display text-[20px] font-semibold tracking-tight text-corporate-black">
                      {quote.carName}
                    </p>
                    <p className="mt-0.5 text-[13px] text-text-secondary">
                      {quote.carYear} ·{" "}
                      {quote.carCondition === "new" ? "New from factory" : "Used (first-owner)"}{" "}
                      ·{" "}
                      <Link
                        href={`/admin/inventory/${quote.carCode}`}
                        className="text-corporate-black underline decoration-hairline underline-offset-4 hover:decoration-corporate-black"
                      >
                        {quote.carCode}
                      </Link>
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium",
                      STATUS_TONE[quote.status],
                    )}
                  >
                    {QUOTE_STATUS_LABEL[quote.status]}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-hairline bg-white p-6 shadow-card md:p-7">
              <h2 className="text-[15px] font-semibold tracking-tight text-corporate-black">
                Quoted breakdown
              </h2>
              <dl className="mt-4 overflow-hidden rounded-lg border border-hairline">
                {lineItems.map((line) => (
                  <div
                    key={line.label}
                    className="flex items-baseline justify-between gap-4 border-b border-hairline px-5 py-3 last:border-b-0"
                  >
                    <dt className="text-[13.5px] text-corporate-black">
                      {line.label}
                    </dt>
                    <dd className="text-[13.5px] font-medium tabular-nums text-corporate-black">
                      {formatUsd(line.value)}
                    </dd>
                  </div>
                ))}
                <div className="flex items-baseline justify-between gap-4 bg-surface-tint/60 px-5 py-3">
                  <dt className="text-[12px] font-medium uppercase tracking-[0.1em] text-text-tertiary">
                    Total
                  </dt>
                  <dd className="font-display text-[20px] font-semibold tabular-nums text-cch-red">
                    {formatUsd(quote.totalUsd)}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-xl border border-hairline bg-white p-6 shadow-card md:p-7">
              <h2 className="text-[15px] font-semibold tracking-tight text-corporate-black">
                Personal note
              </h2>
              <p className="mt-3 whitespace-pre-line text-[13.5px] leading-[1.55] text-corporate-black">
                {quote.personalNote ? (
                  quote.personalNote
                ) : (
                  <span className="text-text-tertiary">
                    No personal note attached to this quote.
                  </span>
                )}
              </p>
            </section>
          </div>

          <aside className="flex flex-col gap-4 lg:col-span-4 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-hairline bg-white p-5 shadow-card">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                Client
              </p>
              <p className="mt-1 text-[15px] font-medium text-corporate-black">
                {quote.clientName}
              </p>
              {quote.clientWhatsapp ? (
                <p className="mt-0.5 text-[12.5px] text-text-secondary">
                  {quote.clientWhatsapp}
                </p>
              ) : null}
              {quote.destinationCity ? (
                <p className="mt-1 text-[12.5px] text-text-tertiary">
                  {quote.destinationCity}
                </p>
              ) : null}
              <div className="mt-4 border-t border-hairline pt-4">
                <Link
                  href={`/admin/leads/${quote.leadId}`}
                  className="inline-flex items-center justify-center rounded-full border border-hairline bg-white px-4 py-2 text-[12.5px] font-medium text-corporate-black transition-colors hover:bg-corporate-black hover:text-white"
                >
                  Open lead
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-hairline bg-white p-5 shadow-card">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                Timeline
              </p>
              <dl className="mt-3 space-y-2 text-[12.5px]">
                <Timeline label="Sent" value={formatDate(quote.sentAt)} />
                <Timeline
                  label="Sent via"
                  value={
                    quote.sentVia === "email"
                      ? "Email"
                      : quote.sentVia === "whatsapp"
                        ? "WhatsApp"
                        : "Download"
                  }
                />
                <Timeline
                  label="Valid until"
                  value={formatDate(quote.validUntil)}
                />
                <Timeline
                  label="Time on table"
                  value={formatRelativeTime(quote.sentAt, NOW_REFERENCE)}
                />
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </>
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
