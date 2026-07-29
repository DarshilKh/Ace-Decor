/**
 * /product/[slug] — Product Detail Page (PDP)
 *
 * Fully static — data comes from src/data/products.ts (there is no
 * database). Each colour/size is its OWN listing with its own page here
 * (not a variant picker) — generateStaticParams() pre-renders all 35 of
 * them at build time.
 *
 * Two-column desktop (gallery ~60% / buy-box ~40%), single column stacked
 * on mobile (gallery first). Below the fold: description, Related
 * Products (the other colours in the same category), FAQ.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllListings, getListingBySlug, getRelatedListings } from "@/data/products";
import { SITE_CONFIG } from "@/data/site-config";
import { buildProductJsonLd } from "@/lib/utils/jsonld";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import { PdpGallery } from "@/components/storefront/pdp-gallery";
import { PdpBuyBox } from "@/components/storefront/pdp-buy-box";
import { PdpDescriptionAccordion } from "@/components/storefront/pdp-description-accordion";
import { RelatedProducts } from "@/components/storefront/related-products";
import { PdpFaqAccordion } from "@/components/storefront/pdp-faq-accordion";
import { PdpMobileStickyCta } from "@/components/storefront/pdp-mobile-sticky-cta";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllListings().map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListingBySlug(slug);

  if (!listing) {
    return { title: "Product Not Found" };
  }

  const title = `${listing.name} | ${SITE_CONFIG.brandName}`;
  const description = listing.shortDescription;
  const ogImage = listing.images[0];

  return {
    title,
    description,
    alternates: { canonical: `/product/${listing.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: ogImage ? [{ url: ogImage.url, alt: ogImage.alt }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  const productJsonLd = buildProductJsonLd({ listing, siteUrl: SITE_URL });
  const shareUrl = `${SITE_URL}/product/${listing.slug}`;
  const relatedListings = getRelatedListings(listing);

  return (
    <div className="container-content py-8 pb-28 lg:py-10 lg:pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <Breadcrumb
        siteUrl={SITE_URL}
        items={[
          { label: "Home", href: "/" },
          { label: listing.categoryName, href: `/shop/${listing.categorySlug}` },
          { label: listing.name, href: `/product/${listing.slug}` },
        ]}
      />

      {/* Two-column desktop (gallery ~60% / buy-box ~40%), stacked mobile */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
        <div className="lg:col-span-3">
          <PdpGallery images={listing.images} productName={listing.name} />
        </div>

        <div className="lg:col-span-2">
          <h1 className="font-display text-2xl font-semibold text-[var(--color-heading)] lg:text-3xl">
            {listing.name}
          </h1>

          <div className="mt-5">
            <PdpBuyBox listing={listing} shareUrl={shareUrl} />
          </div>
        </div>
      </div>

      {/* Below the fold: full description, related products, FAQ */}
      <div className="mt-12 space-y-12 lg:mt-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="space-y-10 lg:col-span-3">
            <PdpDescriptionAccordion description={listing.description} />
          </div>
          <div className="lg:col-span-2">
            <PdpFaqAccordion />
          </div>
        </div>

        <RelatedProducts listings={relatedListings} categoryName={listing.categoryName} />
      </div>

      <PdpMobileStickyCta listing={listing} shareUrl={shareUrl} />
    </div>
  );
}
