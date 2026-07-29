/**
 * components/storefront/pdp-trust-row.tsx — PDP "Why Shop With Us" Row
 *
 * DESIGN_SYSTEM §16 item 9: "Why Shop With Us trust row — text + icon
 * only, no flashy badges". Updated for the catalog + WhatsApp-enquiry
 * model — "Secure Checkout" no longer applies (there is no checkout).
 *
 * Distinct from components/storefront/trust-strip.tsx (the landing page's
 * full-width 4-item section) — this is a compact 3-item inline row sized
 * for the buy-box column, not a standalone page section.
 */

import { MessageCircle, RotateCcw, Sparkles } from "lucide-react";

const PDP_TRUST_ITEMS = [
  { icon: MessageCircle, label: "Quick WhatsApp Response" },
  { icon: RotateCcw, label: "Easy Returns" },
  { icon: Sparkles, label: "Quality Assured" },
] as const;

export function PdpTrustRow() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-body)]">
      {PDP_TRUST_ITEMS.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <item.icon className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
          {item.label}
        </span>
      ))}
    </div>
  );
}
