import { ImageResponse } from "next/og";

/**
 * app/icon.tsx — Favicon
 *
 * Generated programmatically (no external image asset) — a simple "AD"
 * monogram in the brand's Golden Taupe on a cream background, matching
 * src/app/globals.css's --color-primary / --color-background.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF8F5",
          borderRadius: 6,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#B8835A",
            letterSpacing: -1,
          }}
        >
          AD
        </span>
      </div>
    ),
    { ...size },
  );
}
