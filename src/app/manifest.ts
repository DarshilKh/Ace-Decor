import type { MetadataRoute } from "next";

/**
 * app/manifest.ts — Web App Manifest
 *
 * Next.js serves this at /manifest.webmanifest automatically. Improves
 * "add to home screen" behavior on mobile and is a positive signal for
 * some SEO/rich-result tooling. Icons reference the same programmatically
 * generated favicon as icon.tsx/apple-icon.tsx.
 */

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ACE DÉCOR — Premium Home Décor",
    short_name: "ACE DÉCOR",
    description:
      "Premium home décor — cushion covers, bedsheets, table covers, curtains and more, for the modern Indian home.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F5",
    theme_color: "#B8835A",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
