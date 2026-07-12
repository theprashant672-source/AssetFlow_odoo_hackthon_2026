export const ASSETFLOW_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "") || "http://localhost:5000";

export function apiUrl(path: string): string {
  return `${ASSETFLOW_API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
