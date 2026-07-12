import path from "path";
import type { NextConfig } from "next";
import { normalizeApiBaseUrl } from "./app/lib/apiBaseUrl";

const nextConfig: NextConfig = {
  // Fix for Windows case-insensitive filesystem: webpack sometimes resolves
  // the same node_modules directory via two different path casings (e.g.
  // "Frontend" vs "frontend"), causing duplicate Next.js internals to be
  // bundled. Pinning resolve.modules to a single absolute path prevents this.
  webpack(config) {
    config.resolve.modules = [
      path.resolve(__dirname, "node_modules"),
      "node_modules",
    ];
    return config;
  },
  async rewrites() {
    const envTarget = (process.env.API_PROXY_TARGET || process.env.NEXT_PUBLIC_API_BASE_URL || "").trim();

    // Default targets to avoid manual dashboard setup:
    // - Local dev: proxy to local API.
    // - Production/Vercel: proxy to the deployed backend domain.
    const defaultTarget =
      process.env.VERCEL || process.env.NODE_ENV === "production"
        ? "https://backend-liard-eta-86.vercel.app"
        : "http://localhost:5000";

    const target = normalizeApiBaseUrl(envTarget || defaultTarget);

    return [
      // Proxy API calls from the frontend origin to the backend origin.
      // This prevents production builds from calling localhost and avoids CORS issues by
      // keeping browser requests same-origin (`/api/...`).
      {
        source: "/api/:path*",
        destination: `${target}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
