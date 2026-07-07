import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthUser } from "./authStorage";
import { getAuthUser } from "./authStorage";
import {
  getDashboardHashForRole,
  login as loginUser,
  logout as logoutUser,
  register as registerUser,
  type AuthResult,
  type RegisterInput,
} from "./authService";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (input: RegisterInput) => Promise<AuthResult>;
  logout: () => void;
  getDashboardRoute: () => string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getAuthUser());

  useEffect(() => {
    const syncAuth = () => {
      setUser(getAuthUser());
    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener("agrivo-auth-changed", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("agrivo-auth-changed", syncAuth);
    };
  }, []);

  const notifyAuthChanged = useCallback(() => {
    window.dispatchEvent(new Event("agrivo-auth-changed"));
    setUser(getAuthUser());
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginUser(email, password);
      if (result.success) {
        notifyAuthChanged();
      }
      return result;
    },
    [notifyAuthChanged],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const result = await registerUser(input);
      if (result.success) {
        notifyAuthChanged();
      }
      return result;
    },
    [notifyAuthChanged],
  );

  const logout = useCallback(() => {
    logoutUser();
    notifyAuthChanged();
  }, [notifyAuthChanged]);

  const getDashboardRoute = useCallback(() => {
    if (!user) return "login";
    return getDashboardHashForRole(user.role);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
      getDashboardRoute,
    }),
    [user, login, register, logout, getDashboardRoute],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
