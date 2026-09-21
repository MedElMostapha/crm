import { AppSidebar } from "@/components/layout/app-sidebar";
import { Navbar } from "@/components/layout/navbar";
import { requireAuth } from "@/lib/session";
import { getNotifications } from "@/actions/notifications";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const notificationsResult = await getNotifications();
  const notifications = notificationsResult.success
    ? notificationsResult.data
    : [];

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <Navbar notifications={notifications} />
        <main className="flex-1 p-4 lg:p-8">
          <div className="mx-auto max-w-7xl animate-[fade-in-up_0.4s_ease-out]">{children}</div>
        </main>
      </div>
    </div>
  );
}
