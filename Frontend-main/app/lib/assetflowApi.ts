import { resolveApiBase } from "./apiBaseUrl";

export const ASSETFLOW_API_BASE = resolveApiBase();

export function apiUrl(path: string): string {
  return `${ASSETFLOW_API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
