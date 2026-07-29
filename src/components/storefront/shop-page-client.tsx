"use client";

/**
 * components/storefront/shop-page-client.tsx — PLP Search + Sort + Grid
 *
 * With only 9 product lines and no database, the old DB-paginated
 * search/filter/sort system was replaced with simple client-side
 * filtering — there's no need for server round-trips or pagination when
 * the entire catalog fits on one page.
 */

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { ProductGrid } from "./product-grid";
import type { ProductCardData } from "./product-card";

type SortOption = "featured" | "price-asc" | "price-desc";

interface ShopPageClientProps {
  products: ProductCardData[];
}

export function ShopPageClient({ products }: ShopPageClientProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = q
      ? products.filter((p) => p.name.toLowerCase().includes(q))
      : products;

    const sorted = [...matches];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [products, query, sort]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-body)]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-9 pr-3 text-sm text-[var(--color-heading)] outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-[var(--color-body)]">
          Sort by
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm text-[var(--color-heading)] outline-none focus:border-[var(--color-primary)]"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </label>
      </div>

      <ProductGrid
        products={filtered}
        emptyMessage={`No products match "${query}". Try a different search.`}
      />
    </div>
  );
}
