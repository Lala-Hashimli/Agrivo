import { useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import type { UserRole } from "../../auth/authStorage";
import { getDashboardHashForRole } from "../../auth/authService";

interface ProtectedDashboardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function ProtectedDashboard({ allowedRoles, children }: ProtectedDashboardProps) {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      window.location.hash = "login";
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      window.location.hash = getDashboardHashForRole(user.role);
    }
  }, [allowedRoles, isAuthenticated, user]);

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return children;
}
