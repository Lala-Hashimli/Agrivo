import type { AuthUser, UserRole } from "./authStorage";
import { clearAuthUser, setAuthUser } from "./authStorage";
import { findUserByEmail, createRegisteredUser, toAuthUser } from "./userRegistry";
import { isApiMode } from "../../config/dataMode";
import * as authApi from "../../api/authApi";

export type AuthResult =
  | { success: true; user: AuthUser }
  | { success: false; error: string };

export type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  agreeTerms: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getDashboardHashForRole(role: UserRole): string {
  switch (role) {
    case "buyer":
      return "dashboard/buyer";
    case "farmer":
      return "dashboard/farmer";
    case "logistics":
      return "dashboard/logistics";
    case "admin":
      return "dashboard/admin";
    default:
      return "dashboard/buyer";
  }
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const trimmedEmail = email.trim();

  if (!trimmedEmail || !password) {
    return { success: false, error: "Invalid email or password." };
  }

  if (isApiMode) {
    try {
      const response = await authApi.login(trimmedEmail, password);
      if (import.meta.env.DEV) {
        console.info("[Auth] API login success:", response.user.email, response.user.role);
      }
      const authUser: AuthUser = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone ?? undefined,
        role: response.user.role,
      };
      setAuthUser(authUser);
      return { success: true, user: authUser };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("[Auth] API login failed:", error);
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed. Please try again.",
      };
    }
  }

  const user = findUserByEmail(trimmedEmail);

  if (!user || user.password !== password) {
    return { success: false, error: "Invalid email or password." };
  }

  const authUser = toAuthUser(user);
  setAuthUser(authUser);
  return { success: true, user: authUser };
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();

  if (!name) {
    return { success: false, error: "Full name is required." };
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    return { success: false, error: "A valid email address is required." };
  }

  if (!phone) {
    return { success: false, error: "Phone number is required." };
  }

  if (!input.password) {
    return { success: false, error: "Password is required." };
  }

  if (input.password !== input.confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }

  if (!input.role || input.role === "admin") {
    return { success: false, error: "Please select a valid account type." };
  }

  if (!input.agreeTerms) {
    return { success: false, error: "You must accept the terms to register." };
  }

  if (isApiMode) {
    try {
      const response = await authApi.register({
        name,
        email,
        phone,
        password: input.password,
        role: input.role === "admin" ? "buyer" : input.role,
      });
      const authUser: AuthUser = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone ?? undefined,
        role: response.user.role,
      };
      setAuthUser(authUser);
      if (import.meta.env.DEV) {
        console.info("[Auth] API register success:", response.user.email, response.user.role);
      }
      return { success: true, user: authUser };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("[Auth] API register failed:", error);
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed. Please try again.",
      };
    }
  }

  try {
    const user = createRegisteredUser({
      name,
      email,
      phone,
      password: input.password,
      role: input.role,
    });
    const authUser = toAuthUser(user);
    setAuthUser(authUser);
    return { success: true, user: authUser };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed. Please try again.",
    };
  }
}

export function logout(): void {
  if (isApiMode) {
    authApi.logoutApiUser();
  }
  clearAuthUser();
}
