/**
 * components/storefront/pdp-buy-box.tsx — PDP Buy Box
 *
 * Price (with 50%-off strike-through), the single "Enquire on WhatsApp"
 * CTA, share, and the trust row. Each colour/size is its own product page
 * in this catalog (no variant picker), so — unlike earlier iterations of
 * this component — there's no client-side selection state to manage. This
 * is a plain Server Component; only ShareButton underneath is a Client
 * Component (Web Share API).
 */

import { Button } from "@/components/ui/button";
import { ShareButton } from "./share-button";
import { PdpTrustRow } from "./pdp-trust-row";
import { formatPrice, formatWhatsAppLink } from "@/lib/utils/format";
import { SITE_CONFIG } from "@/data/site-config";
import type { Listing } from "@/data/products";

interface PdpBuyBoxProps {
  listing: Listing;
  shareUrl: string;
}

export function PdpBuyBox({ listing, shareUrl }: PdpBuyBoxProps) {
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
    <div className="flex flex-col gap-5">
      {/* Price with 50% off strike-through */}
      <div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl font-semibold text-[var(--color-heading)]">
            {formatPrice(listing.price)}
          </span>
          <span className="text-base text-[var(--color-body)] line-through">
            {formatPrice(listing.originalPrice)}
          </span>
          <span className="rounded-[var(--radius-sm)] bg-[var(--color-primary)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--color-primary)]">
            {listing.discountPercent}% OFF
          </span>
        </div>
        <p className="mt-0.5 text-xs text-[var(--color-body)]">
          {SITE_CONFIG.gstNote}
        </p>
      </div>

      {/* Enquire on WhatsApp + Share */}
      <div className="flex gap-3">
        <Button asChild variant="primary" size="lg" className="flex-1 gap-2">
          <a href={enquiryHref} target="_blank" rel="noopener noreferrer">
            <WhatsAppGlyph className="h-4 w-4 shrink-0 fill-current" />
            Enquire on WhatsApp
          </a>
        </Button>
        <ShareButton title={listing.name} url={shareUrl} />
      </div>

      {/* Short description */}
      <p className="text-sm leading-relaxed text-[var(--color-body)]">
        {listing.shortDescription}
      </p>

      {/* Why Shop With Us */}
      <PdpTrustRow />
    </div>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.005c5.46 0 9.91-4.45 9.91-9.91C21.93 6.46 17.5 2 12.04 2zm5.78 14.1c-.24.68-1.4 1.3-1.93 1.38-.49.08-1.1.11-1.78-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.08 1-2.37.26-.28.57-.35.76-.35.19 0 .38 0 .54.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.29.14.46.12.63-.07.17-.19.73-.85.93-1.14.19-.29.38-.24.64-.14.26.1 1.66.78 1.95.93.29.14.48.21.55.33.07.12.07.7-.17 1.38z" />
    </svg>
  );
}
