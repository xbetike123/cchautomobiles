import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { getCurrentAdmin } from "@/lib/admin/auth";

const NOW_REFERENCE = "2026-05-16T12:00:00Z";

const TODAY_LABEL = new Date(NOW_REFERENCE).toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "Africa/Lagos",
});

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getCurrentAdmin();

  return (
    <div className="flex min-h-screen bg-surface-tint">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopBar profile={profile} todayLabel={TODAY_LABEL} />
        {children}
      </div>
    </div>
  );
}
