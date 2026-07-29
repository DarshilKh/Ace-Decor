/**
 * components/storefront/category-grid.tsx — Shop by Category
 *
 * 3x3 grid of all 9 categories (per business owner request — previously a
 * 4-column/4,4,1 layout). Each tile links to that category's listing page
 * (/shop/[category]), which shows every colour/size in that category as
 * its own clickable product.
 */

import Image from "next/image";
import Link from "next/link";

import { getAllCategories, getCategoryImage } from "@/data/products";

export function CategoryGrid() {
  const categories = getAllCategories();

  return (
    <section className="py-12 lg:py-16">
      <div className="container-content">
        <div className="mb-8 text-center lg:mb-10">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-heading)] lg:text-3xl">
            Shop by Category
          </h2>
          <p className="mt-2 text-sm text-[var(--color-body)]">
            Find exactly what your space needs
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {categories.map((category) => {
            const image = getCategoryImage(category.slug);

            return (
              <Link
                key={category.slug}
                href={`/shop/${category.slug}`}
                className="group flex flex-col gap-3"
              >
                <div className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-muted-bg)] transition-transform duration-200 group-hover:scale-[1.02]">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                      loading="lazy"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[var(--color-muted-bg)] to-[var(--color-border)]" />
                  )}
                </div>
                <span className="text-center text-sm font-medium text-[var(--color-heading)]">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
