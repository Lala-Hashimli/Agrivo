import { ProtectedDashboard } from "../../components/dashboard/ProtectedDashboard";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { ADMIN_DASHBOARD } from "../../components/dashboard/dashboardConfig";

export default function AdminDashboardPage() {
  return (
    <ProtectedDashboard allowedRoles={["admin"]}>
      <DashboardLayout config={ADMIN_DASHBOARD} />
    </ProtectedDashboard>
  );
}
