"use client";

/**
 * components/storefront/mobile-menu.tsx — Mobile Navigation Drawer
 *
 * Mobile-first: this is the primary way most customers browse categories,
 * since the desktop category row is hidden below the `lg` breakpoint.
 *
 * Layout is a fixed 3-row flex column — sticky header, a scrollable middle
 * section, sticky footer — so the WhatsApp CTA and close button are always
 * reachable and no content silently overflows off-screen on short viewports
 * (a real bug in the previous version: header/footer scrolled away with
 * the category list on short phones).
 *
 * Categories render as an image + name grid (not a plain text list) so
 * they're immediately visible and recognisable — a shopper can see what
 * "AC Curtains" looks like before tapping, which reads as more premium
 * than a bare link list and matches the visual card language used
 * everywhere else on the site (category grid, product grid).
 */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";

import { formatWhatsAppLink } from "@/lib/utils/format";
import { SITE_CONFIG } from "@/data/site-config";
import { getCategoryImage } from "@/data/products";

interface NavCategory {
  name: string;
  slug: string;
}

interface MobileMenuProps {
  categories: NavCategory[];
}

export function MobileMenu({ categories }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-heading)] transition-colors duration-200 hover:bg-[var(--color-muted-bg)] lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-[var(--color-overlay)] lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer panel — fixed 3-row flex column: sticky header, scrollable
                middle, sticky footer. min-h-0 on the middle row is required for
                a flex child to actually scroll instead of overflowing its parent. */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex h-dvh w-[90%] max-w-sm flex-col bg-[var(--color-surface)] shadow-[var(--shadow-lg)] lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Sticky header */}
              <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] px-5 py-5">
                <span className="font-display text-xl font-semibold tracking-[0.06em] text-[var(--color-heading)]">
                  ACE DÉCOR
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-heading)] transition-colors duration-200 hover:bg-[var(--color-muted-bg)]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Scrollable middle */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                <Link
                  href="/shop"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--color-muted-bg)] px-4 py-3.5 text-sm font-semibold text-[var(--color-heading)] transition-colors hover:bg-[var(--color-border)]/60"
                >
                  Shop All Products
                  <span aria-hidden="true">→</span>
                </Link>

                <p className="mb-3 mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-body)]">
                  Shop by Category
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category, index) => {
                    const image = getCategoryImage(category.slug);
                    return (
                      <motion.div
                        key={category.slug}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.025 * index }}
                      >
                        <Link
                          href={`/shop/${category.slug}`}
                          onClick={() => setOpen(false)}
                          className="group flex flex-col gap-1.5"
                        >
                          <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-muted-bg)]">
                            {image ? (
                              <Image
                                src={image.url}
                                alt={image.alt}
                                fill
                                sizes="45vw"
                                className="object-cover transition-transform duration-200 group-active:scale-95"
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-[var(--color-muted-bg)] to-[var(--color-border)]" />
                            )}
                          </div>
                          <span className="px-0.5 text-[13px] font-medium leading-snug text-[var(--color-heading)]">
                            {category.name}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="my-6 border-t border-[var(--color-border)]" />

                <Link
                  href="/faq"
                  onClick={() => setOpen(false)}
                  className="block rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-[var(--color-heading)] transition-colors hover:bg-[var(--color-muted-bg)]"
                >
                  FAQ
                </Link>
              </div>

              {/* Sticky footer */}
              <div className="shrink-0 border-t border-[var(--color-border)] p-4">
                <a
                  href={formatWhatsAppLink(
                    SITE_CONFIG.whatsappNumber,
                    "Hello ACE DÉCOR, I'd like to know more about your products.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-[var(--color-primary-hover)]"
                >
                  Enquire on WhatsApp
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
