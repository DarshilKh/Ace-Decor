import { ImageResponse } from "next/og";

/**
 * app/apple-icon.tsx — Apple Touch Icon
 *
 * Shown when a user adds the site to their iOS home screen. Generated
 * programmatically, matching icon.tsx's design at the larger size Apple
 * expects.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        <span
          style={{
            fontSize: 76,
            fontWeight: 700,
            color: "#B8835A",
            letterSpacing: -3,
          }}
        >
          AD
        </span>
      </div>
    ),
    { ...size },
  );
}
