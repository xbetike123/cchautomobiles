import { AdminHeader } from "@/components/admin/AdminHeader";
import { ParentCompanies } from "@/components/admin/settings/ParentCompanies";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";
import { listParentCompanies } from "@/lib/admin/queries/companies";
import { getSettings } from "@/lib/admin/queries/settings";

export default async function AdminSettingsPage() {
  const [settings, companies] = await Promise.all([
    getSettings(),
    listParentCompanies(),
  ]);

  return (
    <>
      <AdminHeader
        eyebrow="Configuration"
        title="Settings"
        description="Company details, exchange rates, pricing defaults, and operations contact."
      />
      <div className="flex-1 space-y-5 px-6 py-6">
        <ParentCompanies companies={companies} />
        <SettingsForm settings={settings} />
      </div>
    </>
  );
}
