/**
 * /shop/[category] — Category Listing Page
 *
 * Shows every colour/size listing in this category as its own clickable
 * product card — each is a separate product page in this catalog, not a
 * variant picker. Fully static; generateStaticParams() pre-renders all 9
 * category pages at build time.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllCategories, getCategoryBySlug, getListingsByCategory, toCardData } from "@/data/products";
import { buildItemListJsonLd } from "@/lib/utils/jsonld";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import { ProductGrid } from "@/components/storefront/product-grid";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: category.name,
    description: `Browse our full range of ${category.name.toLowerCase()} — premium home décor, delivered pan-India.`,
    alternates: { canonical: `/shop/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const listings = getListingsByCategory(category.slug);
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
          { label: category.name, href: `/shop/${category.slug}` },
        ]}
      />

      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-semibold text-[var(--color-heading)] lg:text-3xl">
          {category.name}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-body)]">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
