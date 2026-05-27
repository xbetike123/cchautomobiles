import { AdminHeader } from "@/components/admin/AdminHeader";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";
import { getSettings } from "@/lib/admin/queries/settings";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <>
      <AdminHeader
        eyebrow="Configuration"
        title="Settings"
        description="Company details, exchange rates, pricing defaults, and operations contact."
      />
      <div className="flex-1 px-6 py-6">
        <SettingsForm settings={settings} />
      </div>
    </>
  );
}
