import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { getCurrentAdmin } from "@/lib/admin/auth";

const TODAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
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
  const todayLabel = TODAY_FORMATTER.format(new Date());

  return (
    <div className="flex min-h-screen bg-surface-tint">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopBar profile={profile} todayLabel={todayLabel} />
        {children}
      </div>
    </div>
  );
}
