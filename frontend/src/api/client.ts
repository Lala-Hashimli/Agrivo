const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
const AUTH_TOKEN_KEY = "agrivo_auth_token";

if (import.meta.env.DEV) {
  console.info("[Agrivo API] base URL:", API_BASE_URL);
  console.info("[Agrivo API] data mode:", import.meta.env.VITE_DATA_MODE ?? "mock");
}

export class ApiClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

export function getApiToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setApiToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearApiToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;

  const requestHeaders = new Headers(headers);

  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getApiToken();
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiClientError(
      "Backend is not available. Please make sure the server is running on port 5000.",
      0,
    );
  }

  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "success" in payload &&
    (payload as { success?: unknown }).success === false
  ) {
    const message =
      "message" in payload && typeof (payload as { message?: unknown }).message === "string"
        ? (payload as { message: string }).message
        : "Request failed.";
    throw new ApiClientError(message, response.status);
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof (payload as { message?: unknown }).message === "string"
        ? (payload as { message: string }).message
        : `Request failed with status ${response.status}`;

    throw new ApiClientError(message, response.status);
  }

  return payload as T;
}

export { API_BASE_URL };

export function apiGet<T>(path: string, options: RequestOptions = {}) {
  return apiRequest<T>(path, { ...options, method: "GET" });
}

export function apiPost<T>(path: string, body?: unknown, options: RequestOptions = {}) {
  return apiRequest<T>(path, { ...options, method: "POST", body });
}

export function apiPut<T>(path: string, body?: unknown, options: RequestOptions = {}) {
  return apiRequest<T>(path, { ...options, method: "PUT", body });
}

export function apiPatch<T>(path: string, body?: unknown, options: RequestOptions = {}) {
  return apiRequest<T>(path, { ...options, method: "PATCH", body });
}

export function apiDelete<T>(path: string, options: RequestOptions = {}) {
  return apiRequest<T>(path, { ...options, method: "DELETE" });
}
