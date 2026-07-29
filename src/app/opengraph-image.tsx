import { ImageResponse } from "next/og";

/**
 * app/opengraph-image.tsx — Default Open Graph / Twitter Card Image
 *
 * Applies to any page in the app that doesn't define its own OG image
 * (product pages define their own via generateMetadata's openGraph.images,
 * using the actual product photo — this is the fallback for home, shop,
 * faq, and policy pages). Generated programmatically — no external asset —
 * on-brand with the site's Golden Taupe palette.
 */

export const alt = "ACE DÉCOR — Premium Home Décor";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FAF8F5 0%, #F0E9E1 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: 8,
            color: "#2C2C2C",
          }}
        >
          ACE DÉCOR
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 32,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#B8835A",
          }}
        >
          Premium Home Décor
        </div>
      </div>
    ),
    { ...size },
  );
}
