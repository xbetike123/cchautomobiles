import {
  ArrowLeft,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { LeadActions } from "@/components/admin/leads/LeadActions";
import {
  LEAD_STATUS_LABEL,
  LEAD_TRACK_LABEL,
  formatBudgetShort,
  formatRelativeTime,
} from "@/lib/admin/format";
import { getLeadById } from "@/lib/admin/queries/leads";
import type { LeadStatus, LeadTrack } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const NOW_REFERENCE = "2026-05-16T12:00:00Z";

const STATUS_DOT: Record<LeadStatus, string> = {
  new: "bg-cch-red",
  contacted: "bg-amber-500",
  quoted: "bg-sky-500",
  negotiating: "bg-indigo-500",
  reserved: "bg-corporate-black",
  closed_won: "bg-emerald-500",
  closed_lost: "bg-corporate-black/30",
};

const TRACK_TONE: Record<LeadTrack, string> = {
  in_stock: "bg-emerald-100 text-emerald-700",
  source_to_order: "bg-cch-red-soft text-cch-red",
  unclassified: "bg-corporate-black/5 text-text-secondary",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminLeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const decoded = decodeURIComponent(id);
  const lead = await getLeadById(decoded);
  if (!lead) notFound();

  const wantsLine = lead.carCode
    ? lead.carCode
    : lead.preferredBrand
      ? `${lead.preferredBrand}${lead.preferredModel ? ` ${lead.preferredModel}` : ""}`
      : "Browsing the lot";

  return (
    <>
      <AdminHeader
        eyebrow={`Inbox · ${lead.id}`}
        title={lead.name}
        description={wantsLine}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/leads"
              className="hidden items-center gap-1.5 rounded-full border border-hairline bg-white px-3.5 py-2 text-[12.5px] font-medium text-corporate-black transition-colors hover:bg-corporate-black hover:text-white sm:inline-flex"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Back
            </Link>
            <LeadActions
              leadId={lead.id}
              leadName={lead.name}
              status={lead.status}
            />
          </div>
        }
      />

      <div className="flex-1 px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <section className="rounded-xl border border-hairline bg-white p-6 shadow-card md:p-7">
              <header className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-[15px] font-semibold tracking-tight text-corporate-black">
                  What they want
                </h2>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                    TRACK_TONE[lead.track],
                  )}
                >
                  {LEAD_TRACK_LABEL[lead.track]}
                </span>
              </header>
              <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Row
                  label="Preferred make / model"
                  value={
                    lead.preferredBrand
                      ? `${lead.preferredBrand}${lead.preferredModel ? ` ${lead.preferredModel}` : ""}`
                      : "Open"
                  }
                />
                <Row
                  label="Car code (if from lot)"
                  value={
                    lead.carCode ? (
                      <Link
                        href={`/admin/inventory/${lead.carCode}`}
                        className="text-corporate-black underline decoration-hairline underline-offset-4 hover:decoration-corporate-black"
                      >
                        {lead.carCode}
                      </Link>
                    ) : (
                      "—"
                    )
                  }
                />
                <Row
                  label="Condition preference"
                  value={
                    lead.conditionPreference === "new"
                      ? "New only"
                      : lead.conditionPreference === "used"
                        ? "Used only"
                        : lead.conditionPreference === "either"
                          ? "Open to either"
                          : "—"
                  }
                />
                <Row
                  label="Budget"
                  value={formatBudgetShort(
                    lead.budgetMinUsd,
                    lead.budgetMaxUsd,
                  )}
                />
                <Row label="Timeline" value={lead.timeline ?? "—"} />
                <Row
                  label="Body types"
                  value={
                    lead.bodyTypePreferences.length > 0
                      ? lead.bodyTypePreferences.join(", ")
                      : "—"
                  }
                />
                <Row
                  label="Destination"
                  value={
                    [lead.destinationCity, lead.destinationCountry]
                      .filter(Boolean)
                      .join(", ") || "—"
                  }
                />
                <Row
                  label="Assigned to"
                  value={lead.assignedTo ?? "Unassigned"}
                />
              </dl>
            </section>

            {lead.screenshotUrls.length > 0 ? (
              <section className="rounded-xl border border-hairline bg-white p-6 shadow-card md:p-7">
                <header className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-[15px] font-semibold tracking-tight text-corporate-black">
                    Attached references
                  </h2>
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-tertiary">
                    {lead.screenshotUrls.length}{" "}
                    {lead.screenshotUrls.length === 1 ? "image" : "images"}
                  </span>
                </header>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {lead.screenshotUrls.map((url, idx) => (
                    <li
                      key={`${url}-${idx}`}
                      className="relative aspect-[4/3] overflow-hidden rounded-md border border-hairline bg-surface-warm"
                    >
                      <Image
                        src={url}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 200px, 50vw"
                        className="object-cover"
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="rounded-xl border border-hairline bg-white p-6 shadow-card md:p-7">
              <h2 className="text-[15px] font-semibold tracking-tight text-corporate-black">
                Client notes
              </h2>
              <p className="mt-3 whitespace-pre-line text-[13.5px] leading-[1.55] text-corporate-black">
                {lead.notes ? (
                  lead.notes
                ) : (
                  <span className="text-text-tertiary">
                    No notes submitted with this request.
                  </span>
                )}
              </p>
            </section>
          </div>

          <aside className="flex flex-col gap-4 lg:col-span-4 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl border border-hairline bg-white p-5 shadow-card">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                Status
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-corporate-black">
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      STATUS_DOT[lead.status],
                    )}
                  />
                  {LEAD_STATUS_LABEL[lead.status]}
                </span>
                <span className="text-[12px] text-text-tertiary">
                  · Received{" "}
                  {formatRelativeTime(lead.createdAt, NOW_REFERENCE)}
                </span>
              </div>

              {lead.track === "source_to_order" && lead.sourceDeadline ? (
                <div className="mt-4 rounded-lg border border-cch-red/30 bg-cch-red-soft/60 px-3 py-2">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-cch-red">
                    Source-to-order deadline
                  </p>
                  <p className="mt-1 text-[12.5px] font-medium text-cch-red">
                    {formatRelativeTime(lead.sourceDeadline, NOW_REFERENCE)}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-hairline bg-white p-5 shadow-card">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                Contact
              </p>
              <ul className="mt-3 space-y-2.5 text-[13px]">
                <li>
                  <Link
                    href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-corporate-black hover:text-cch-red"
                  >
                    <MessageSquare
                      className="mt-0.5 size-3.5 shrink-0 text-text-tertiary"
                      aria-hidden="true"
                    />
                    <span className="break-all">{lead.whatsapp}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`mailto:${lead.email}`}
                    className="flex items-start gap-2 text-corporate-black hover:text-cch-red"
                  >
                    <Mail
                      className="mt-0.5 size-3.5 shrink-0 text-text-tertiary"
                      aria-hidden="true"
                    />
                    <span className="break-all">{lead.email}</span>
                  </Link>
                </li>
                {lead.destinationCity ? (
                  <li className="flex items-start gap-2 text-corporate-black">
                    <MapPin
                      className="mt-0.5 size-3.5 shrink-0 text-text-tertiary"
                      aria-hidden="true"
                    />
                    <span>
                      {[lead.destinationCity, lead.destinationCountry]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </li>
                ) : null}
                <li className="flex items-start gap-2 text-text-tertiary">
                  <Phone
                    className="mt-0.5 size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>Voice on request</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-hairline bg-white p-5 shadow-card">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                Timeline
              </p>
              <dl className="mt-3 space-y-2 text-[12.5px]">
                <Timeline label="Received" value={dateFormatter.format(new Date(lead.createdAt))} />
                <Timeline
                  label="Auto-reply"
                  value={
                    lead.autoReplySentAt
                      ? dateFormatter.format(new Date(lead.autoReplySentAt))
                      : "—"
                  }
                />
                <Timeline
                  label="Wait response"
                  value={
                    lead.waitResponse === "pending"
                      ? "Pending"
                      : lead.waitResponse === "can_wait"
                        ? "Can wait"
                        : lead.waitResponse === "cannot_wait"
                          ? "Cannot wait"
                          : "No response"
                  }
                />
                {lead.sourceDeadline ? (
                  <Timeline
                    label="Deadline"
                    value={dateFormatter.format(new Date(lead.sourceDeadline))}
                  />
                ) : null}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </>
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

function Timeline({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-text-tertiary">{label}</dt>
      <dd className="font-medium text-corporate-black">{value}</dd>
    </div>
  );
}
