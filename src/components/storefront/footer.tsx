/**
 * components/storefront/footer.tsx — Storefront Footer
 *
 * Mobile-first: single-column stack on phones (previous version's
 * grid-cols-2 produced an awkward, unbalanced 3-row layout on mobile with
 * one lone column at the end), 2 columns on tablet, a full 5-column
 * layout on desktop with a dedicated "Get in Touch" block. Server
 * Component — no interactivity needed.
 */

import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

import { SITE_CONFIG } from "@/data/site-config";
import { formatWhatsAppLink } from "@/lib/utils/format";

const FOOTER_LINKS = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "Cushion Covers", href: "/shop/cushion-covers" },
    { label: "Bedsheets", href: "/shop/elastic-bedsheets" },
    { label: "Table Covers", href: "/shop/table-covers" },
  ],
  help: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping Policy", href: "/policies/shipping" },
    { label: "Return Policy", href: "/policies/returns" },
    { label: "Contact Us", href: "/faq#contact" },
  ],
  company: [
    { label: "Privacy Policy", href: "/policies/privacy" },
    { label: "Terms & Conditions", href: "/policies/terms" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();
  const whatsappHref = formatWhatsAppLink(
    SITE_CONFIG.whatsappNumber,
    "Hi! I have a question about your products.",
  );

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-muted-bg)]">
      <div className="container-content py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-display text-2xl font-semibold text-[var(--color-heading)]"
            >
              ACE DÉCOR
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--color-body)]">
              Premium home décor for the modern Indian home. Scandinavian-inspired
              elegance, thoughtfully curated.
            </p>

            {/* Get in touch */}
            <div className="mt-6 flex flex-col gap-2.5">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-body)] transition-colors hover:text-[var(--color-primary)]"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {SITE_CONFIG.contactPhoneDisplay}
              </a>
             
               
            </div>
          </div>

          {/* Link groups */}
          <div className="grid grid-cols-2 gap-8 sm:col-span-2 sm:gap-6 lg:col-span-3 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-heading)]">Shop</h3>
              <ul className="mt-3 space-y-2.5">
                {FOOTER_LINKS.shop.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-body)] transition-colors hover:text-[var(--color-primary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--color-heading)]">Help</h3>
              <ul className="mt-3 space-y-2.5">
                {FOOTER_LINKS.help.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-body)] transition-colors hover:text-[var(--color-primary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-semibold text-[var(--color-heading)]">Company</h3>
              <ul className="mt-3 space-y-2.5">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-body)] transition-colors hover:text-[var(--color-primary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--color-border)] pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-[var(--color-body)]">
            © {year} ACE DÉCOR. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-body)]">
            {SITE_CONFIG.gstNote}
          </p>
        </div>
      </div>
    </footer>
  );
}
