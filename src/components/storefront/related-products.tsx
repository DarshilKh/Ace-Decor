/**
 * components/storefront/related-products.tsx — "Related Products" (PDP)
 *
 * Shows the other colour/size listings in the same category as separate,
 * individually-clickable products — each colour is its own product page in
 * this catalog, not a variant picker, so this is how a shopper discovers
 * the other options within a product line.
 */

import { ProductGrid } from "./product-grid";
import { toCardData, type Listing } from "@/data/products";

interface RelatedProductsProps {
  listings: Listing[];
  categoryName: string;
}

export function RelatedProducts({ listings, categoryName }: RelatedProductsProps) {
  if (listings.length === 0) return null;

  return (
    <section className="border-t border-[var(--color-border)] pt-10">
      <h2 className="font-display text-xl font-semibold text-[var(--color-heading)]">
        More {categoryName}
      </h2>
      <div className="mt-5">
        <ProductGrid products={listings.map(toCardData)} />
      </div>
    </section>
  );
}
