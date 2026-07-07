import { Home, LogOut } from "lucide-react";
import type { AuthUser } from "../../auth/authStorage";
import { getDashboardRoleLabel } from "./dashboardConfig";

function getUserInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function DashboardSidebarFooter({
  user,
  onBackHome,
  onLogout,
}: {
  user: AuthUser | null;
  onBackHome: () => void;
  onLogout: () => void;
}) {
  const roleLabel = user ? getDashboardRoleLabel(user.role) : "User";
  const initials = user ? getUserInitials(user.name) : "A";

  return (
    <div className="agrivo-dashboard-sidebar-footer">
      {user ? (
        <div className="agrivo-dashboard-user-card">
          <div className="agrivo-dashboard-user-card__avatar" aria-hidden>
            {initials || "A"}
          </div>
          <div className="agrivo-dashboard-user-card__info">
            <p className="agrivo-dashboard-user-card__name">{user.name}</p>
            <p className="agrivo-dashboard-user-card__role">{roleLabel}</p>
          </div>
          <span className="agrivo-dashboard-user-card__status" title="Active" aria-hidden />
        </div>
      ) : null}

      <button type="button" className="agrivo-dashboard-nav-item" onClick={onBackHome}>
        <Home className="h-4 w-4 shrink-0" />
        <span>Back to website</span>
      </button>

      <button type="button" className="agrivo-dashboard-logout-btn" onClick={onLogout}>
        <LogOut className="h-4 w-4 shrink-0" />
        <span>Logout</span>
      </button>
    </div>
  );
}
