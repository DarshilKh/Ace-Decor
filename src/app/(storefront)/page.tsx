/**
 * Landing Page — / (storefront root)
 *
 * Four sections in order: Hero, Shop by Category (3x3 grid), Best Sellers,
 * Trust Strip. Fully static — no database, no Server Action data fetch.
 *
 * "Best Sellers" shows 8 hand-picked listings (there's no real sales/order
 * data to rank by in a site with no backend) — see getBestSellers() in
 * src/data/products.ts for the exact selection.
 */

import type { Metadata } from "next";

import { getBestSellers, toCardData } from "@/data/products";
import { HeroSection } from "@/components/storefront/hero-section";
import { CategoryGrid } from "@/components/storefront/category-grid";
import { FeaturedProducts } from "@/components/storefront/featured-products";
import { TrustStrip } from "@/components/storefront/trust-strip";

export const metadata: Metadata = {
  title: "ACE DÉCOR — Premium Home Décor for Every Room",
  description:
    "Discover premium home décor — cushion covers, bedsheets, table covers, curtains and more. Scandinavian-inspired elegance for Indian homes.",
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  const bestSellers = getBestSellers().map(toCardData);

  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts products={bestSellers} />
      <TrustStrip />
    </>
  );
}
