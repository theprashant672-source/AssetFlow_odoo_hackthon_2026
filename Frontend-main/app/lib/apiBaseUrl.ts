export function normalizeApiBaseUrl(value: string): string {
  return value.trim().replace(/\/+$/, "").replace(/\/api$/, "");
}
