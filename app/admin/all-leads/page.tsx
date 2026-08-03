import { AdminHeader } from "@/components/admin/AdminHeader";
import { AllLeadsTable } from "@/components/admin/all-leads/AllLeadsTable";
import { listAllLeads } from "@/lib/admin/queries/all-leads";

export default async function AdminAllLeadsPage() {
  const leads = await listAllLeads();

  return (
    <>
      <AdminHeader
        eyebrow="Contacts"
        title="All Leads"
        description="Every contact across both funnels — car requests and guide downloads — in one place."
      />
      <div className="flex-1 px-6 py-6">
        <AllLeadsTable leads={leads} />
      </div>
    </>
  );
}
