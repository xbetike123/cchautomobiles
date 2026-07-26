import { AdminHeader } from "@/components/admin/AdminHeader";
import { LeadsEmpty } from "@/components/admin/leads/LeadsEmpty";
import { LeadsFilters } from "@/components/admin/leads/LeadsFilters";
import { LeadsSearch } from "@/components/admin/leads/LeadsSearch";
import { LeadsTable } from "@/components/admin/leads/LeadsTable";
import { getLeads, getLeadStatusCounts } from "@/lib/admin/queries/leads";
import type { LeadStatus, LeadTrack } from "@/lib/admin/types";

const STATUS_VALUES: readonly LeadStatus[] = [
  "new",
  "contacted",
  "quoted",
  "negotiating",
  "reserved",
  "closed_won",
  "closed_lost",
];

const TRACK_VALUES: readonly LeadTrack[] = [
  "in_stock",
  "source_to_order",
  "unclassified",
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

function asStatus(value: string | undefined): LeadStatus | undefined {
  return STATUS_VALUES.includes(value as LeadStatus)
    ? (value as LeadStatus)
    : undefined;
}

function asTrack(value: string | undefined): LeadTrack | undefined {
  return TRACK_VALUES.includes(value as LeadTrack)
    ? (value as LeadTrack)
    : undefined;
}

function asHasCode(value: string | undefined): "yes" | "no" | undefined {
  return value === "yes" || value === "no" ? value : undefined;
}

export default async function LeadsPage({ searchParams }: PageProps) {
  const raw = await searchParams;

  const status = asStatus(asString(raw.status));
  const track = asTrack(asString(raw.track));
  const hasCode = asHasCode(asString(raw.hasCode));
  const q = asString(raw.q);

  const current = {
    status,
    track,
    hasCode,
    q,
  } as Record<string, string | undefined>;

  const [leads, statusCounts] = await Promise.all([
    getLeads({ status, track, hasCode, q }),
    getLeadStatusCounts(),
  ]);
  const hasFilters = Boolean(status || track || hasCode || q);
  const filterKey = `${status ?? ""}|${track ?? ""}|${hasCode ?? ""}|${q ?? ""}`;

  return (
    <>
      <AdminHeader
        eyebrow="Inbox"
        title="Car Requests"
        description="Every inbound request from the public form, in one place."
      />
      <div className="flex-1 px-6 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-[13px] text-text-secondary">
              <span className="font-semibold text-corporate-black tabular-nums">
                {leads.length}
              </span>
              <span className="text-text-tertiary">
                {" "}
                {leads.length === 1 ? "request" : "requests"}
              </span>
            </p>
            {hasFilters ? (
              <span className="inline-flex items-center rounded-full bg-cch-red-soft px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-cch-red">
                Filtered
              </span>
            ) : null}
          </div>
          <LeadsSearch current={current} />
        </div>

        <LeadsFilters current={current} statusCounts={statusCounts} />

        <div className="mt-4">
          {leads.length === 0 ? (
            <LeadsEmpty hasFilters={hasFilters} />
          ) : (
            <LeadsTable key={filterKey} leads={leads} />
          )}
        </div>
      </div>
    </>
  );
}
