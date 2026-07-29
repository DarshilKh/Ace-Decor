/**
 * components/storefront/pdp-mobile-sticky-cta.tsx — Sticky Mobile Buy Bar
 *
 * Fixed to the bottom of the viewport, mobile only (hidden at `lg`, where
 * the buy box in the main column is already visible without scrolling).
 * Keeps price + the WhatsApp CTA reachable while a shopper scrolls through
 * the description/related products lower on the page — a standard premium
 * mobile-commerce pattern. Plain Server Component; no client state needed.
 */

import { formatPrice, formatWhatsAppLink } from "@/lib/utils/format";
import { SITE_CONFIG } from "@/data/site-config";
import type { Listing } from "@/data/products";

interface PdpMobileStickyCtaProps {
  listing: Listing;
  shareUrl: string;
}

export function PdpMobileStickyCta({ listing, shareUrl }: PdpMobileStickyCtaProps) {
  const enquiryHref = formatWhatsAppLink(
    SITE_CONFIG.whatsappNumber,
    [
      `Hello ${SITE_CONFIG.brandName},`,
      "I'm interested in:",
      `Product: ${listing.name}`,
      `Price: ${formatPrice(listing.price)}`,
      `Product Link: ${shareUrl}`,
      "",
      "Please share more details.",
    ].join("\n"),
  );

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[var(--shadow-lg)] backdrop-blur-md lg:hidden"
    >
      <div className="flex flex-col leading-tight">
        <span className="text-base font-semibold text-[var(--color-heading)]">
          {formatPrice(listing.price)}
        </span>
        <span className="text-xs text-[var(--color-body)] line-through">
          {formatPrice(listing.originalPrice)}
        </span>
      </div>
      <a
        href={enquiryHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
      >
        Enquire on WhatsApp
      </a>
    </div>
  );
}
