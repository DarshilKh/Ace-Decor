/**
 * app/not-found.tsx — Custom 404 Page
 *
 * Root-level so it reliably catches both explicit notFound() calls (e.g.
 * an unknown product/category slug) and any genuinely unmatched URL,
 * regardless of route group. Self-contained (doesn't rely on the
 * (storefront) layout) so it renders correctly no matter where the
 * mismatch occurred.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-6 text-center">
      <Link href="/" className="font-display text-2xl font-semibold tracking-[0.06em] text-[var(--color-heading)]">
        ACE DÉCOR
      </Link>

      <p className="mt-10 font-display text-6xl font-semibold text-[var(--color-primary)]">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-[var(--color-heading)]">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-2 max-w-sm text-sm text-[var(--color-body)]">
        The page you&apos;re looking for may have moved or no longer exists. Let&apos;s
        get you back to browsing.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="primary" size="lg">
          <Link href="/shop">Shop All Products</Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
