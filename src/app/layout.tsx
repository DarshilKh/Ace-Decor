import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";

import { buildOrganizationJsonLd } from "@/lib/utils/jsonld";
import { SITE_CONFIG } from "@/data/site-config";

import "./globals.css";

// ─────────────────────────────────────────────────────────────────────────────
// Fonts (DESIGN_SYSTEM.md §3)
//
// Cormorant Garamond — display/heading serif conveying premium, warm elegance.
// Inter            — body/UI sans-serif; clean, highly legible at small sizes.
//
// next/font/google inlines font declarations as <style> tags (no external
// request at render time), satisfying the CSP font-src 'self' directive
// set in next.config.ts without needing an external font-src allowlist.
// ─────────────────────────────────────────────────────────────────────────────

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  // Weights used across DESIGN_SYSTEM §3: heading/display roles use 600
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  // preload: true is the default for next/font; explicit for clarity
  preload: true,
  // display: swap prevents FOIT while font loads
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  // Full weight range: body (400), labels (500), buttons/prices (600)
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  preload: true,
  display: "swap",
});

// ─────────────────────────────────────────────────────────────────────────────
// Root Metadata (DESIGN_SYSTEM §1, PRD §15)
//
// Page-level metadata (title, description, OG) is defined per-page/layout
// in each route segment. These are the site-wide fallback defaults.
// Template pattern: "{page title} | ACE DÉCOR"
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  // Title template — individual pages set `title` which fills %s
  title: {
    default: "ACE DÉCOR — Premium Home Décor",
    template: "%s | ACE DÉCOR",
  },
  description:
    "Discover premium home décor — cushion covers, bedsheets, table covers, curtains and more. Scandinavian-inspired elegance for Indian homes.",
  keywords: [
    "home décor India",
    "cushion covers online",
    "premium bedsheets",
    "table covers",
    "AC curtains",
    "AC covers",
    "grass mats",
    "booster covers",
    "ACE DÉCOR",
  ],
  // Canonical base URL for absolute URL resolution (PRD §15.4)
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  alternates: { canonical: "/" },
  // robots — defaults allow indexing; individual pages/layouts can override
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Open Graph defaults — individual PDPs/PLPs set page-specific OG data.
  // The image itself comes from app/opengraph-image.tsx (generated, no
  // asset needed) unless a page overrides it (product pages use their own photo).
  openGraph: {
    type: "website",
    siteName: "ACE DÉCOR",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Viewport — mobile-first (DESIGN_SYSTEM §8)
// ─────────────────────────────────────────────────────────────────────────────

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // themeColor matches --color-primary for mobile browser chrome tinting
  themeColor: "#B8835A",
};

// ─────────────────────────────────────────────────────────────────────────────
// Root Layout
// ─────────────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const organizationJsonLd = buildOrganizationJsonLd({
    siteUrl,
    name: SITE_CONFIG.brandName,
    contactEmail: SITE_CONFIG.contactEmail,
    contactPhone: SITE_CONFIG.contactPhoneDisplay,
  });

  return (
    <html
      lang="en"
      // Font CSS variables injected onto <html> — available to all descendants
      // via var(--font-display) and var(--font-sans) (wired in globals.css @theme)
      className={`${cormorantGaramond.variable} ${inter.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />

        {children}

        {/*
         * Toaster — site-wide toast notification provider
         * Uses `sonner` (not deprecated Shadcn `toast` component — TECHSPEC §20)
         * Placed here at root so toasts are available everywhere in the app.
         *
         * position: "bottom-right" — avoids conflict with the sticky "Enquire
         * on WhatsApp" bar on mobile PDPs (DESIGN_SYSTEM §11.1) and the
         * floating WhatsApp FAB (RULES §16.4 — bottom offset must not
         * obstruct CTAs).
         */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-heading)",
            },
          }}
          richColors
        />
      </body>
    </html>
  );
}
