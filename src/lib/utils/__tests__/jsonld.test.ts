/**
 * lib/utils/__tests__/jsonld.test.ts
 *
 * Unit tests for lib/utils/jsonld.ts — schema.org structured data builders.
 * These tests verify that the builder functions produce the correct
 * schema.org fields from a given static-catalog input.
 */

import { describe, it, expect } from "vitest";
import {
  buildProductJsonLd,
  buildOrganizationJsonLd,
  buildFaqJsonLd,
} from "../jsonld";
import type { Listing } from "@/data/products";

// ─────────────────────────────────────────────────────────────────────────────
// Test fixture — minimal Listing shape sufficient for JSON-LD generation
// ─────────────────────────────────────────────────────────────────────────────

const SITE_URL = "https://acedecor.in";

function makeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    slug: "cushion-covers",
    categorySlug: "cushion-covers",
    categoryName: "Cushion Covers",
    variantName: "Apsara Gajri",
    name: "Cushion Covers",
    shortDescription: "Luxury cushion cover in premium fabric",
    description: "Full description here",
    price: 299,
    originalPrice: 598,
    discountPercent: 50,
    images: [
      { url: "/images/products/cushion-covers/apsara-gajri-1.jpg", alt: "Cushion Covers - Apsara Gajri" },
    ],
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// buildProductJsonLd
// ─────────────────────────────────────────────────────────────────────────────

describe("buildProductJsonLd", () => {
  it("produces a valid Product schema object", () => {
    const jsonLd = buildProductJsonLd({
      listing: makeListing(),
      siteUrl: SITE_URL,
    });
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("Product");
  });

  it("sets the product name", () => {
    const jsonLd = buildProductJsonLd({
      listing: makeListing({ name: "AC Curtains — 9 Feet" }),
      siteUrl: SITE_URL,
    });
    expect(jsonLd.name).toBe("AC Curtains — 9 Feet");
  });

  it("sets offer priceCurrency to INR", () => {
    const jsonLd = buildProductJsonLd({ listing: makeListing(), siteUrl: SITE_URL });
    const offers = jsonLd.offers as Record<string, unknown>;
    expect(offers.priceCurrency).toBe("INR");
  });

  it("sets offer price to the listing's fixed price", () => {
    const jsonLd = buildProductJsonLd({ listing: makeListing({ price: 799 }), siteUrl: SITE_URL });
    const offers = jsonLd.offers as Record<string, unknown>;
    expect(offers.price).toBe("799.00");
  });

  it("always reports InStock availability (no live stock tracking in this catalog)", () => {
    const jsonLd = buildProductJsonLd({ listing: makeListing(), siteUrl: SITE_URL });
    const offers = jsonLd.offers as Record<string, unknown>;
    expect(offers.availability).toBe("https://schema.org/InStock");
  });

  it("includes images from the listing", () => {
    const listing = makeListing({
      images: [
        { url: "/images/a.jpg", alt: "Red" },
        { url: "/images/b.jpg", alt: "Red (alternate view)" },
      ],
    });
    const jsonLd = buildProductJsonLd({ listing, siteUrl: SITE_URL });
    expect(jsonLd.image).toEqual([`${SITE_URL}/images/a.jpg`, `${SITE_URL}/images/b.jpg`]);
  });

  it("sets offer URL to the canonical product URL", () => {
    const jsonLd = buildProductJsonLd({ listing: makeListing(), siteUrl: SITE_URL });
    const offers = jsonLd.offers as Record<string, unknown>;
    expect(offers.url).toBe(`${SITE_URL}/product/cushion-covers`);
  });

  it("sets sku to the product slug", () => {
    const jsonLd = buildProductJsonLd({ listing: makeListing(), siteUrl: SITE_URL });
    expect(jsonLd.sku).toBe("cushion-covers");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildOrganizationJsonLd
// ─────────────────────────────────────────────────────────────────────────────

describe("buildOrganizationJsonLd", () => {
  it("produces a valid Organization schema object", () => {
    const jsonLd = buildOrganizationJsonLd({
      siteUrl: SITE_URL,
      name: "ACE DÉCOR",
    });
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("Organization");
    expect(jsonLd.name).toBe("ACE DÉCOR");
    expect(jsonLd.url).toBe(SITE_URL);
  });

  it("includes contactPoint when email or phone is provided", () => {
    const jsonLd = buildOrganizationJsonLd({
      siteUrl: SITE_URL,
      name: "ACE DÉCOR",
      contactEmail: "hello@acedecor.in",
      contactPhone: "+91 98101 39284",
    });
    const cp = jsonLd.contactPoint as Record<string, unknown>;
    expect(cp["@type"]).toBe("ContactPoint");
    expect(cp.email).toBe("hello@acedecor.in");
  });

  it("omits contactPoint when neither email nor phone is provided", () => {
    const jsonLd = buildOrganizationJsonLd({ siteUrl: SITE_URL, name: "ACE DÉCOR" });
    expect(jsonLd.contactPoint).toBeUndefined();
  });

  it("includes logo when logoUrl is provided", () => {
    const jsonLd = buildOrganizationJsonLd({
      siteUrl: SITE_URL,
      name: "ACE DÉCOR",
      logoUrl: `${SITE_URL}/logo.png`,
    });
    expect(jsonLd.logo).toBe(`${SITE_URL}/logo.png`);
  });

  it("omits logo when no logoUrl is provided", () => {
    const jsonLd = buildOrganizationJsonLd({ siteUrl: SITE_URL, name: "ACE DÉCOR" });
    expect(jsonLd.logo).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildFaqJsonLd
// ─────────────────────────────────────────────────────────────────────────────

describe("buildFaqJsonLd", () => {
  it("produces a valid FAQPage schema object", () => {
    const jsonLd = buildFaqJsonLd([
      { question: "What is your return policy?", answer: "7 days, no questions asked." },
    ]);
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("FAQPage");
  });

  it("maps each item to a Question/Answer entity", () => {
    const items = [
      { question: "Q1?", answer: "A1." },
      { question: "Q2?", answer: "A2." },
    ];
    const jsonLd = buildFaqJsonLd(items);
    expect(jsonLd.mainEntity).toHaveLength(2);
    const first = jsonLd.mainEntity[0] as Record<string, unknown>;
    expect(first["@type"]).toBe("Question");
    expect(first.name).toBe("Q1?");
    const answer = first.acceptedAnswer as Record<string, unknown>;
    expect(answer.text).toBe("A1.");
  });

  it("produces an empty mainEntity for an empty input", () => {
    const jsonLd = buildFaqJsonLd([]);
    expect(jsonLd.mainEntity).toHaveLength(0);
  });
});
