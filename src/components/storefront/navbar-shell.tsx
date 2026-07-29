"use client";

/**
 * components/storefront/navbar-shell.tsx — Premium Navbar Shell (Client)
 *
 * Two-tier sticky header for the luxury home-décor storefront:
 *   Tier 1 — brand row: ACE DÉCOR wordmark centered as the visual focal
 *            point, mobile menu trigger + search on the sides.
 *   Tier 2 — category row (desktop only): centered nav links with an
 *            animated underline hover/active state.
 *
 * Sticky with a smooth hide/reveal animation: the header slides away when
 * scrolling down past the fold and reappears immediately on any upward
 * scroll, keeping navigation available without permanently occupying
 * screen space — a common pattern on premium retail sites.
 */

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

import { cn } from "@/lib/utils/cn";
import { getAllCategories } from "@/data/products";
import { MobileMenu } from "./mobile-menu";

const CATEGORIES = getAllCategories();

export function NavbarShell() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = lastScrollY.current;
    const scrollingDown = current > previous;
    const pastThreshold = current > 96;

    setHidden(scrollingDown && pastThreshold);
    lastScrollY.current = current;
  });

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--color-surface)]/75"
    >
      {/* Tier 1 — Brand row */}
      <div className="container-content grid h-20 grid-cols-[auto_1fr_auto] items-center gap-4 lg:h-24">
        {/* Left: mobile menu trigger */}
        <div className="flex items-center">
          <MobileMenu categories={CATEGORIES} />
        </div>

        {/* Center: wordmark — the visual focal point */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="group flex flex-col items-center leading-none"
            aria-label="ACE DÉCOR — Home"
          >
            <span className="font-display text-2xl font-semibold tracking-[0.08em] text-[var(--color-heading)] transition-colors duration-200 group-hover:text-[var(--color-primary)] lg:text-4xl">
              ACE DÉCOR
            </span>
            <span className="mt-0.5 hidden text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--color-body)] sm:block">
              Premium Home Décor
            </span>
          </Link>
        </div>

        {/* Right: search */}
        <div className="flex items-center justify-end gap-1">
          <Link
            href="/shop"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-heading)] transition-colors duration-200 hover:bg-[var(--color-muted-bg)] hover:text-[var(--color-primary)]"
            aria-label="Search products"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Tier 2 — Category row (desktop only) */}
      <nav
        className="hidden border-t border-[var(--color-border)]/70 lg:block"
        aria-label="Main"
      >
        <div className="container-content flex min-h-12 flex-wrap items-center justify-center gap-x-1 gap-y-1 py-1.5">
          <NavLink href="/shop" isActive={pathname === "/shop"}>
            Shop All
          </NavLink>
          {CATEGORIES.map((category) => (
            <NavLink
              key={category.slug}
              href={`/shop/${category.slug}`}
              isActive={pathname === `/shop/${category.slug}`}
            >
              {category.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </motion.header>
  );
}

function NavLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative px-4 py-2 text-[13px] font-medium uppercase tracking-wide text-[var(--color-heading)] transition-colors duration-200",
        isActive ? "text-[var(--color-primary)]" : "hover:text-[var(--color-primary)]",
      )}
    >
      {children}
      <span
        className={cn(
          "pointer-events-none absolute inset-x-4 -bottom-px h-px origin-center bg-[var(--color-primary)] transition-transform duration-300 ease-out",
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
        aria-hidden="true"
      />
    </Link>
  );
}
