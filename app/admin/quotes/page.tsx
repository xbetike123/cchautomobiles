import { AdminHeader } from "@/components/admin/AdminHeader";
import { NewQuoteButton } from "@/components/admin/quotes/NewQuoteButton";
import { QuotesEmpty } from "@/components/admin/quotes/QuotesEmpty";
import { QuotesFilters } from "@/components/admin/quotes/QuotesFilters";
import { QuotesSearch } from "@/components/admin/quotes/QuotesSearch";
import { QuotesTable } from "@/components/admin/quotes/QuotesTable";
import {
  getQuotes,
  getQuotesStatusCounts,
} from "@/lib/admin/queries/quotes";
import type { QuoteStatus } from "@/lib/admin/types";

const STATUS_VALUES: readonly QuoteStatus[] = [
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
  "superseded",
];

type RawSearchParams = {
  [key: string]: string | string[] | undefined;
};

type PageProps = {
  searchParams: Promise<RawSearchParams>;
};

function asString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value ?? undefined;
}

function asStatus(value: string | undefined): QuoteStatus | undefined {
  return STATUS_VALUES.includes(value as QuoteStatus)
    ? (value as QuoteStatus)
    : undefined;
}

export default async function QuotesPage({ searchParams }: PageProps) {
  const NOW_REFERENCE = new Date().toISOString();
  const raw = await searchParams;

  const status = asStatus(asString(raw.status));
  const q = asString(raw.q);

  const current = { status, q } as Record<string, string | undefined>;

  const [quotes, statusCounts] = await Promise.all([
    getQuotes({ status, q }),
    getQuotesStatusCounts(),
  ]);

  const hasFilters = Boolean(status || q);
  const filterKey = `${status ?? ""}|${q ?? ""}`;

  return (
    <>
      <AdminHeader
        eyebrow="Outbox"
        title="Car Quotes"
        description="Quotes sent to clients with totals, status, and resend tools."
        actions={<NewQuoteButton />}
      />
      <div className="flex-1 px-6 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-[13px] text-text-secondary">
              <span className="font-semibold text-corporate-black tabular-nums">
                {quotes.length}
              </span>
              <span className="text-text-tertiary">
                {" "}
                {quotes.length === 1 ? "quote" : "quotes"}
              </span>
            </p>
            {hasFilters ? (
              <span className="inline-flex items-center rounded-full bg-cch-red-soft px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-cch-red">
                Filtered
              </span>
            ) : null}
          </div>
          <QuotesSearch current={current} />
        </div>

        <QuotesFilters current={current} statusCounts={statusCounts} />

        <div className="mt-4">
          {quotes.length === 0 ? (
            <QuotesEmpty hasFilters={hasFilters} />
          ) : (
            <QuotesTable
              key={filterKey}
              quotes={quotes}
              now={NOW_REFERENCE}
            />
          )}
        </div>
      </div>
    </>
  );
}
