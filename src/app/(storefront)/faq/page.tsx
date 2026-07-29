/**
 * /faq — Global FAQ Page
 *
 * Fully static — data comes from src/data/faq.ts. Shares the same FAQ set
 * and FAQPage JSON-LD builder as the PDP FAQ accordion
 * (components/storefront/pdp-faq-accordion.tsx) — no divergent data source.
 * Groups items by category (ordering, shipping, returns, general) for
 * scannability.
 */

import type { Metadata } from "next";

import { FAQ_ITEMS, type FaqItem } from "@/data/faq";
import { SITE_CONFIG } from "@/data/site-config";
import { buildFaqJsonLd } from "@/lib/utils/jsonld";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const CATEGORY_LABELS: Record<FaqItem["category"], string> = {
  ordering: "Ordering",
  shipping: "Shipping",
  returns: "Returns",
  general: "General",
};

const CATEGORY_ORDER: FaqItem["category"][] = ["ordering", "shipping", "returns", "general"];

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about ordering, shipping, and returns from ACE DÉCOR.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const faqJsonLd = buildFaqJsonLd(
    FAQ_ITEMS.map((f) => ({ question: f.question, answer: f.answer })),
  );

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: FAQ_ITEMS.filter((f) => f.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="container-content py-8 lg:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Breadcrumb
        siteUrl={SITE_URL}
        items={[
          { label: "Home", href: "/" },
          { label: "FAQ", href: "/faq" },
        ]}
      />

      <h1 className="font-display text-2xl font-semibold text-[var(--color-heading)] lg:text-3xl">
        Frequently Asked Questions
      </h1>
      <p id="contact" className="mt-2 max-w-2xl scroll-mt-24 text-[var(--color-body)]">
        Can&apos;t find what you&apos;re looking for? Reach us at{" "}
        <a
          href={`mailto:${SITE_CONFIG.contactEmail}`}
          className="text-[var(--color-primary)] underline underline-offset-2"
        >
          {SITE_CONFIG.contactEmail}
        </a>{" "}
        or via the WhatsApp button on this page.
      </p>

      <div className="mt-8 space-y-10">
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className="font-display text-lg font-semibold text-[var(--color-heading)]">
              {group.label}
            </h2>
            <Accordion type="single" collapsible className="mt-4">
              {group.items.map((faq, index) => (
                <AccordionItem key={index} value={`${group.category}-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <div className="whitespace-pre-line">{faq.answer}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
    </div>
  );
}
