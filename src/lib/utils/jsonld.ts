/**
 * lib/utils/jsonld.ts — Schema.org JSON-LD Builders
 *
 * All structured data is generated server-side from the same static data
 * rendered on the page (src/data/products.ts, src/data/faq.ts) — no
 * database, no divergent data source.
 */

import type { Listing } from "@/data/products";

// ─────────────────────────────────────────────────────────────────────────────
// Product Schema — every PDP
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductJsonLdParams {
  listing: Listing;
  siteUrl: string;
}

/**
 * Builds the schema.org Product JSON-LD object for a PDP. Each colour/size
 * is its own listing with a single fixed price, so a single Offer is
 * emitted (there is no per-variant pricing to average or range).
 */
export function buildProductJsonLd({ listing, siteUrl }: ProductJsonLdParams) {
  const images = listing.images.map((img) =>
    img.url.startsWith("http") ? img.url : `${siteUrl}${img.url}`,
  );

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.name,
    description: listing.shortDescription,
    image: images.length > 0 ? images : undefined,
    sku: listing.slug,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/product/${listing.slug}`,
      priceCurrency: "INR",
      price: listing.price.toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Organization Schema — site-wide, root layout
// ─────────────────────────────────────────────────────────────────────────────

export interface OrganizationJsonLdParams {
  siteUrl: string;
  name: string;
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export function buildOrganizationJsonLd({
  siteUrl,
  name,
  logoUrl,
  contactEmail,
  contactPhone,
}: OrganizationJsonLdParams) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: siteUrl,
  };

  if (logoUrl) jsonLd.logo = logoUrl;

  if (contactEmail || contactPhone) {
    jsonLd.contactPoint = {
      "@type": "ContactPoint",
      contactType: "customer service",
      ...(contactEmail && { email: contactEmail }),
      ...(contactPhone && { telephone: contactPhone }),
    };
  }

  return jsonLd;
}

// ─────────────────────────────────────────────────────────────────────────────
// ItemList Schema — /shop and /shop/[category] listing pages
// ─────────────────────────────────────────────────────────────────────────────

export interface ItemListEntry {
  name: string;
  url: string;
}

export function buildItemListJsonLd(items: ItemListEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ Schema — /faq page and PDP FAQ sections
// ─────────────────────────────────────────────────────────────────────────────

export interface FaqJsonLdItem {
  question: string;
  answer: string;
}

export function buildFaqJsonLd(items: FaqJsonLdItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
