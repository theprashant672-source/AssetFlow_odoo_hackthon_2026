export function normalizeApiBaseUrl(value: string): string {
  return value.trim().replace(/\/+$/, "").replace(/\/api$/, "");
}

// Deployed backend (Vercel). Used when NEXT_PUBLIC_API_BASE_URL is not set.
export const DEPLOYED_API_BASE = "https://asset-flow-odoo-hackthon-2026.vercel.app";

export function resolveApiBase(): string {
  const fromEnv = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL ?? "");
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") return DEPLOYED_API_BASE;
  return "http://localhost:5000";
}
