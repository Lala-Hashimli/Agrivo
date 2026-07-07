import { ProtectedDashboard } from "../../components/dashboard/ProtectedDashboard";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { FARMER_DASHBOARD } from "../../components/dashboard/dashboardConfig";

export default function FarmerDashboardPage() {
  return (
    <ProtectedDashboard allowedRoles={["farmer"]}>
      <DashboardLayout config={FARMER_DASHBOARD} />
    </ProtectedDashboard>
  );
}
