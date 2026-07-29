"use client";

/**
 * components/storefront/whatsapp-fab.tsx — WhatsApp Floating Action Button
 *
 * Fixed bottom-left at all breakpoints. Hidden on mobile specifically on
 * product pages, where a full-width sticky "Enquire on WhatsApp" bar
 * (pdp-mobile-sticky-cta.tsx) already covers the same action — showing
 * both would overlap and duplicate it. --color-whatsapp is a brand-color
 * exception, used ONLY here.
 *
 * The WhatsApp number is a hardcoded constant (src/data/site-config.ts) —
 * there is no admin panel to toggle or edit it.
 *
 * Client Component: required for the motion/react animated entrance
 * (degrades to a simple opacity fade under prefers-reduced-motion,
 * handled automatically by the motion library).
 */

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { formatWhatsAppLink } from "@/lib/utils/format";
import { SITE_CONFIG } from "@/data/site-config";
import { cn } from "@/lib/utils/cn";

export function WhatsAppFab() {
  const pathname = usePathname();
  const isProductPage = pathname?.startsWith("/product/") ?? false;

  const href = formatWhatsAppLink(
    SITE_CONFIG.whatsappNumber,
    "Hi! I have a question about your products.",
  );

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "fixed bottom-5 left-4 z-30 h-14 w-14 items-center justify-center rounded-full shadow-[var(--shadow-lg)] lg:bottom-6 lg:left-6",
        // Product pages already have a full-width sticky "Enquire" bar on
        // mobile (pdp-mobile-sticky-cta.tsx) — showing this FAB there too
        // would overlap it and duplicate the same action.
        isProductPage ? "hidden lg:flex" : "flex",
      )}
      style={{ backgroundColor: "var(--color-whatsapp)" }}
      aria-label="Chat with us on WhatsApp"
    >
      {/* Inline WhatsApp glyph (brand mark) — avoids external icon library mismatch */}
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7 fill-white"
        aria-hidden="true"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.005c5.46 0 9.91-4.45 9.91-9.91C21.93 6.46 17.5 2 12.04 2zm5.78 14.1c-.24.68-1.4 1.3-1.93 1.38-.49.08-1.1.11-1.78-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.08 1-2.37.26-.28.57-.35.76-.35.19 0 .38 0 .54.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.29.14.46.12.63-.07.17-.19.73-.85.93-1.14.19-.29.38-.24.64-.14.26.1 1.66.78 1.95.93.29.14.48.21.55.33.07.12.07.7-.17 1.38z" />
      </svg>
    </motion.a>
  );
}
