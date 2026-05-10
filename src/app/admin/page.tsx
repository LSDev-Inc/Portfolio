import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminData } from "@/lib/portfolio/queries";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  const data = await getAdminData();

  return <AdminDashboard data={JSON.parse(JSON.stringify(data))} />;
}
