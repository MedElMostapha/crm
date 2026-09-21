import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/features/profile/profile-form";
import { requireAuth } from "@/lib/session";

export default async function SettingsPage() {
  const session = await requireAuth();
  const user = session.user;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your account details and security."
      />
      <ProfileForm name={user.name} email={user.email} />
    </div>
  );
}