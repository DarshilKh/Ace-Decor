/**
 * components/storefront/product-grid.tsx — Product Grid
 *
 * DESIGN_SYSTEM §7: Mobile 2 cols, Tablet 3 cols, Desktop 4 cols.
 * (Distinct from the Category Grid's 2/4-column spec.)
 */

import { ProductCard, type ProductCardData } from "./product-card";

interface ProductGridProps {
  products: ProductCardData[];
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  emptyMessage = "No products found. Try adjusting your filters.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-muted-bg)] py-16 text-center">
        <p className="text-sm text-[var(--color-body)]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.slug} product={product} priority={index < 4} />
      ))}
    </div>
  );
}
