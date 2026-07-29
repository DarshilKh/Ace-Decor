/**
 * components/storefront/featured-products.tsx — Best Sellers Section
 *
 * Grid of product cards. Fully static — `products` is passed in from
 * src/data/products.ts's getBestSellers() (see the landing page), no
 * database fetch of any kind.
 */

import Link from "next/link";

import { ProductCard, type ProductCardData } from "./product-card";
import { Button } from "@/components/ui/button";

interface FeaturedProductsProps {
  products: ProductCardData[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-12 lg:py-16">
      <div className="container-content">
        <div className="mb-8 flex items-center justify-between lg:mb-10">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[var(--color-heading)] lg:text-3xl">
              Best Sellers
            </h2>
            <p className="mt-2 text-sm text-[var(--color-body)]">
              Loved by homes across India
            </p>
          </div>
          {products.length > 0 && (
            <Button asChild variant="ghost">
              <Link href="/shop">View all</Link>
            </Button>
          )}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.slug} product={product} priority={index < 4} />
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-muted-bg)] py-16 text-center">
            <p className="text-sm text-[var(--color-body)]">
              New arrivals coming soon. Check back shortly!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
