import type { NextConfig } from "next";

// ─────────────────────────────────────────────────────────────────────────────
// Security Headers
// Defined once here — never duplicated per-route.
// ─────────────────────────────────────────────────────────────────────────────

// Content Security Policy directives. Fully static site: no database, no
// external API calls from the browser, no payment iframe. WhatsApp deep
// links (https://wa.me/...) are plain top-level navigations, not fetches
// or frames, so they need no CSP allowance. Fonts loaded via
// next/font/google are inlined as data URIs, so no external font-src is
// needed for FOIT-free font loading.
const isDev = process.env.NODE_ENV === "development";
const CSP_DIRECTIVES = [
  "default-src 'self'",
  // 'unsafe-eval' is required by Next.js in development (Fast Refresh) only.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // Images: self + data URIs only — all product photos are local /public assets
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src 'none'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP_DIRECTIVES },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Next.js Configuration
// ─────────────────────────────────────────────────────────────────────────────

const nextConfig: NextConfig = {
  // ── Images ────────────────────────────────────────────────────────────────
  // All product photography lives in /public/images — no remote image
  // sources at all (no database/CDN), so no remotePatterns are needed.
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 1024, 1280, 1536],
    imageSizes: [16, 32, 64, 128, 160, 256, 384],
    dangerouslyAllowSVG: false,
  },

  // ── Security Headers ───────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },

  // ── TypeScript ─────────────────────────────────────────────────────────────
  // Build fails on type errors — no "fix it after deploy".
  typescript: {
    ignoreBuildErrors: false,
  },

  // ── Logging ────────────────────────────────────────────────────────────────
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
};

export default nextConfig;
