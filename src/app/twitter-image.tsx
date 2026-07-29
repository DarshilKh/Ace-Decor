import { ImageResponse } from "next/og";

/**
 * app/twitter-image.tsx — Default Twitter/X Card Image
 *
 * Next.js only auto-wires twitter:image meta when this file convention
 * exists (opengraph-image.tsx alone isn't picked up for Twitter Cards) —
 * mirrors opengraph-image.tsx exactly so previews match across platforms.
 */

export const alt = "ACE DÉCOR — Premium Home Décor";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
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
