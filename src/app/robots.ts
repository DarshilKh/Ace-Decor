/**
 * app/robots.ts — Static robots.txt
 *
 * Fully static, public site — there is no admin panel or authenticated
 * area left to disallow.
 */

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://acedecor.in").replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/api/sitemap.xml`,
  };
}
