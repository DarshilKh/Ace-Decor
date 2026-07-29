/**
 * components/storefront/pdp-faq-accordion.tsx — PDP FAQ Section (compact)
 *
 * Shows only the ~4 FAQs most relevant right before buying (flagged
 * `showOnProductPage` in src/data/faq.ts), with a link to the full /faq
 * page for everything else. The previous version rendered all 10 global
 * FAQ items on every product page, producing a very long list that
 * dwarfed the description column next to it on desktop — this keeps the
 * PDP focused regardless of how many FAQs the site accumulates.
 *
 * JSON-LD reflects only the questions actually visible here — emitting
 * structured data for content that isn't rendered on the page is bad
 * practice and something search engines can penalise.
 */

import Link from "next/link";

import { FAQ_ITEMS } from "@/data/faq";
import { buildFaqJsonLd } from "@/lib/utils/jsonld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function PdpFaqAccordion() {
  const pdpFaqs = FAQ_ITEMS.filter((f) => f.showOnProductPage);

  const faqJsonLd = buildFaqJsonLd(
    pdpFaqs.map((f) => ({ question: f.question, answer: f.answer })),
  );

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <h2 className="font-display text-xl font-semibold text-[var(--color-heading)]">
        Frequently Asked Questions
      </h2>

      <Accordion type="single" collapsible className="mt-4">
        {pdpFaqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>
              <div className="whitespace-pre-line">{faq.answer}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Link
        href="/faq"
        className="mt-4 inline-block text-sm font-medium text-[var(--color-primary)] hover:underline"
      >
        View all FAQs →
      </Link>
    </section>
  );
}
