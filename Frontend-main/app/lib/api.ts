"use client";

import { normalizeApiBaseUrl } from "./apiBaseUrl";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  mobile?: string;
  assignedStates?: string[];
};

type ApiOk<T> = { success: true; data: T };
type ApiFail = { success: false; message: string };

const TOKEN_KEY = "novaassets:token";

function apiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
  const base = normalizeApiBaseUrl(raw ?? "");

  // Use explicit env config when provided.
  if (base) return base;

  if (typeof window !== "undefined") {
    // Use the current frontend origin and let Next.js proxy /api requests to the backend.
    return window.location.origin;
  }

  return "http://localhost:5000";
}

function joinUrl(base: string, pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  // sessionStorage is scoped to this tab only: it is never adopted by other
  // tabs, so logging in on one tab can't silently log in a different tab.
  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T>(
  pathname: string,
  init: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const url = joinUrl(apiBaseUrl(), pathname);
  const headers = new Headers(init.headers);
  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;

  if (!headers.has("Content-Type") && init.body && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  const useAuth = init.auth !== false;
  if (useAuth) {
    const token = getAuthToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, { ...init, headers });

  let json: ApiOk<T> | ApiFail | null = null;
  try {
    json = (await res.json()) as ApiOk<T> | ApiFail;
  } catch {
    // ignore
  }

  if (!res.ok) {
    const message = (json && "message" in json && json.message) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  if (!json || !("success" in json)) {
    throw new Error("Unexpected response from server");
  }

  if (json.success === false) {
    throw new Error(json.message || "Request failed");
  }

  return json.data;
}

function withQuery(pathname: string, params?: Record<string, string | number | undefined>) {
  if (!params) return pathname;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    qs.set(k, String(v));
  }
  const suffix = qs.toString();
  return suffix ? `${pathname}?${suffix}` : pathname;
}

export async function apiGet<T>(pathname: string, params?: Record<string, string | number | undefined>): Promise<T> {
  return apiRequest<T>(withQuery(pathname, params), { method: "GET" });
}

export async function apiPost<T>(
  pathname: string,
  body: unknown,
  opts: { auth?: boolean } = {}
): Promise<T> {
  return apiRequest<T>(pathname, { method: "POST", auth: opts.auth, body: JSON.stringify(body) });
}

export async function apiPut<T>(pathname: string, body: unknown): Promise<T> {
  return apiRequest<T>(pathname, { method: "PUT", body: JSON.stringify(body) });
}

export async function apiDelete<T>(pathname: string): Promise<T> {
  return apiRequest<T>(pathname, { method: "DELETE" });
}

export async function apiLogin(email: string, password: string): Promise<AuthUser> {
  const data = await apiRequest<{ token: string; user: AuthUser }>("/api/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ identifier: email, password }),
  });
  setAuthToken(data.token);
  return data.user;
}

export async function apiSendOtp(input: { identifier: string; role?: string }): Promise<{
  challengeId: string;
  identifier: string;
  role?: string;
  otp: string;
  expiresAt: string;
  message: string;
}> {
  return apiRequest("/api/auth/otp/send", {
    method: "POST",
    auth: false,
    body: JSON.stringify(input),
  });
}

export async function apiVerifyOtp(input: {
  identifier: string;
  role?: string;
  challengeId: string;
  otp: string;
}): Promise<AuthUser> {
  const data = await apiRequest<{ token: string; user: AuthUser }>("/api/auth/otp/verify", {
    method: "POST",
    auth: false,
    body: JSON.stringify(input),
  });
  setAuthToken(data.token);
  return data.user;
}

export async function apiRegister(input: {
  name: string;
  email: string;
  mobile: string;
  role: string;
  password: string;
}): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/auth/register", {
    method: "POST",
    auth: false,
    body: JSON.stringify(input),
  });
}

export async function apiMe(): Promise<AuthUser> {
  return apiRequest<AuthUser>("/api/auth/me");
}
