import { ProtectedDashboard } from "../../components/dashboard/ProtectedDashboard";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { LOGISTICS_DASHBOARD } from "../../components/dashboard/dashboardConfig";

export default function LogisticsDashboardPage() {
  return (
    <ProtectedDashboard allowedRoles={["logistics"]}>
      <DashboardLayout config={LOGISTICS_DASHBOARD} />
    </ProtectedDashboard>
  );
}
