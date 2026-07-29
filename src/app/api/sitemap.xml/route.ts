/**
 * GET /api/sitemap.xml — Static XML Sitemap
 *
 * Fully static: product/category slugs come from src/data/products.ts —
 * no database, no cache invalidation needed since the site only changes
 * on redeploy.
 */

import { NextResponse } from "next/server";

import { getAllCategories, getAllListings } from "@/data/products";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type SitemapUrl = {
  loc: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// XML builder
// ─────────────────────────────────────────────────────────────────────────────

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSitemapXml(urls: SitemapUrl[]): string {
  const urlEntries = urls
    .map((u) => {
      const parts = [`    <loc>${escapeXml(u.loc)}</loc>`];
      if (u.changefreq) parts.push(`    <changefreq>${u.changefreq}</changefreq>`);
      if (u.priority !== undefined) parts.push(`    <priority>${u.priority.toFixed(1)}</priority>`);
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://acedecor.in").replace(/\/$/, "");
  const categories = getAllCategories();
  const listings = getAllListings();

  const urls: SitemapUrl[] = [
    { loc: `${siteUrl}/`, changefreq: "monthly", priority: 1.0 },
    { loc: `${siteUrl}/shop`, changefreq: "monthly", priority: 0.9 },
    { loc: `${siteUrl}/faq`, changefreq: "yearly", priority: 0.5 },
    { loc: `${siteUrl}/policies/shipping`, changefreq: "yearly", priority: 0.3 },
    { loc: `${siteUrl}/policies/returns`, changefreq: "yearly", priority: 0.3 },
    { loc: `${siteUrl}/policies/privacy`, changefreq: "yearly", priority: 0.3 },
    { loc: `${siteUrl}/policies/terms`, changefreq: "yearly", priority: 0.3 },

    ...categories.map((c) => ({
      loc: `${siteUrl}/shop/${c.slug}`,
      changefreq: "monthly" as const,
      priority: 0.8,
    })),

    ...listings.map((l) => ({
      loc: `${siteUrl}/product/${l.slug}`,
      changefreq: "monthly" as const,
      priority: 0.7,
    })),
  ];

  const xml = buildSitemapXml(urls);

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
