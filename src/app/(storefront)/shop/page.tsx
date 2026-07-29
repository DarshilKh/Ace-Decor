/**
 * /shop — All Products PLP
 *
 * Fully static — every listing (all colours/sizes across all 9 categories,
 * 35 total) renders server-side; search/sort are handled client-side (see
 * ShopPageClient) since the whole catalog is small enough to not need
 * server pagination.
 */

import type { Metadata } from "next";

import { getAllListings, toCardData } from "@/data/products";
import { buildItemListJsonLd } from "@/lib/utils/jsonld";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import { ShopPageClient } from "@/components/storefront/shop-page-client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse our full collection of premium home décor — cushion covers, bedsheets, table covers, curtains and more.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  const listings = getAllListings();
  const products = listings.map(toCardData);

  const itemListJsonLd = buildItemListJsonLd(
    listings.map((l) => ({ name: l.name, url: `${SITE_URL}/product/${l.slug}` })),
  );

  return (
    <div className="container-content py-8 lg:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <Breadcrumb
        siteUrl={SITE_URL}
        items={[
          { label: "Home", href: "/" },
          { label: "Shop All", href: "/shop" },
        ]}
      />

      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-semibold text-[var(--color-heading)] lg:text-3xl">
          Shop All
        </h1>
        <p className="mt-1 text-sm text-[var(--color-body)]">
          {products.length} products
        </p>
      </div>

      <ShopPageClient products={products} />
    </div>
  );
}
