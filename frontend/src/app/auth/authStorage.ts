export type UserRole = "buyer" | "farmer" | "logistics" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

const AUTH_STORAGE_KEY = "agrivo_auth_user";

export function getAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as AuthUser;
    if (!user?.email || !user?.role) return null;
    return {
      ...user,
      id: user.id || `user_legacy_${user.email}`,
      name: user.name || user.email.split("@")[0] || "Agrivo User",
    };
  } catch {
    return null;
  }
}

export function setAuthUser(user: AuthUser): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearAuthUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isFarmerUser(): boolean {
  const user = getAuthUser();
  return user?.role === "farmer" || user?.role === "admin";
}

export function isLoggedIn(): boolean {
  return getAuthUser() !== null;
}
