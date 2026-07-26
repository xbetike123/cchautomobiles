import { AttentionList } from "@/components/admin/dashboard/AttentionList";
import { DashboardWelcome } from "@/components/admin/dashboard/DashboardWelcome";
import { KpiCard } from "@/components/admin/dashboard/KpiCard";
import { LatestInventory } from "@/components/admin/dashboard/LatestInventory";
import { LatestLeads } from "@/components/admin/dashboard/LatestLeads";
import { RevenueCard } from "@/components/admin/dashboard/RevenueCard";
import { getCurrentAdmin } from "@/lib/admin/auth";
import { formatRelativeTime } from "@/lib/admin/format";
import {
  getDashboardKpis,
  getDeadlinesApproaching,
  getInventoryTotal,
  getLatestInventory,
  getLatestLeads,
  getLeadsTotal,
  getRevenueThisMonth,
  getWaitResponsesPending,
} from "@/lib/admin/queries/dashboard";

const LAGOS_HOUR_FORMATTER = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  hour12: false,
  timeZone: "Africa/Lagos",
});

export default async function AdminDashboardPage() {
  const now = new Date().toISOString();
  const lagosHour = Number(LAGOS_HOUR_FORMATTER.format(new Date()));

  const [
    profile,
    kpis,
    revenue,
    latestLeads,
    leadsTotal,
    latestInventory,
    inventoryTotal,
    deadlines,
    waitPending,
  ] = await Promise.all([
    getCurrentAdmin(),
    getDashboardKpis(),
    getRevenueThisMonth(),
    getLatestLeads(),
    getLeadsTotal(),
    getLatestInventory(),
    getInventoryTotal(),
    getDeadlinesApproaching(),
    getWaitResponsesPending(),
  ]);

  return (
    <>
      <div className="flex-1 px-8 py-8">
        <DashboardWelcome
          profile={profile}
          hour={lagosHour}
          newLeadsThisWeek={kpis.newLeadsThisWeek}
          deadlinesIn12h={deadlines.length}
          waitResponsesPending={waitPending.length}
        />
        <div className="mt-6">
          <RevenueCard data={revenue} href="/admin/leads?status=closed_won" />
        </div>

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="New leads this week"
            value={kpis.newLeadsThisWeek}
            hint="Since Monday, Africa/Lagos"
            href="/admin/leads?status=new"
          />
          <KpiCard
            label="Cars on the lot"
            value={kpis.carsOnTheLot}
            hint="Available to quote right now"
            href="/admin/inventory?status=on_the_lot"
          />
          <KpiCard
            label="Quotes sent this week"
            value={kpis.quotesSentThisWeek}
            hint="Across all destinations"
            href="/admin/quotes"
          />
          <KpiCard
            label="Reserved this month"
            value={kpis.reservedThisMonth}
            hint="Deposit received, awaiting balance"
            href="/admin/leads?status=reserved"
          />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <LatestLeads
            leads={latestLeads}
            totalCount={leadsTotal}
            now={now}
          />
          <LatestInventory
            inventory={latestInventory}
            totalCount={inventoryTotal}
            now={now}
          />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AttentionList
            title="Deadlines approaching"
            subtitle="Source-to-order leads within 12h of their 48h SLA"
            emptyLabel="Nothing within 12 hours."
            leads={deadlines}
            now={now}
            tone="alert"
            hintFor={(lead) =>
              `Deadline ${
                lead.sourceDeadline
                  ? formatRelativeTime(lead.sourceDeadline, now)
                  : "—"
              } · ${lead.preferredBrand ?? "—"}${lead.preferredModel ? ` ${lead.preferredModel}` : ""}`
            }
          />
          <AttentionList
            title="Wait responses pending"
            subtitle="No click on the can-you-wait email after 24h"
            emptyLabel="All caught up."
            leads={waitPending}
            now={now}
            hintFor={(lead) =>
              `Auto-reply sent ${
                lead.autoReplySentAt
                  ? formatRelativeTime(lead.autoReplySentAt, now)
                  : "—"
              }`
            }
          />
        </section>
      </div>
    </>
  );
}
