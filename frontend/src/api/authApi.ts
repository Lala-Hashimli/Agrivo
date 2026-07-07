import { apiGet, apiPost, clearApiToken, setApiToken } from "./client";

export type ApiUserRole = "buyer" | "farmer" | "logistics" | "admin";

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: ApiUserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: ApiUser;
}

export interface MeResponse {
  success: boolean;
  user: ApiUser;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Exclude<ApiUserRole, "admin">;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const response = await apiPost<AuthResponse>("/auth/register", input, {
    auth: false,
  });

  setApiToken(response.token);
  return response;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await apiPost<AuthResponse>(
    "/auth/login",
    { email, password },
    {
      auth: false,
    },
  );

  setApiToken(response.token);
  return response;
}

export async function getMe(): Promise<ApiUser> {
  const response = await apiGet<MeResponse>("/auth/me");
  return response.user;
}

export function logoutApiUser(): void {
  clearApiToken();
}
