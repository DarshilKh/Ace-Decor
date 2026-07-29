/**
 * components/storefront/pdp-description-accordion.tsx — Full Description
 *
 * DESIGN_SYSTEM §16 "Below the fold": full description/details accordion.
 * Server Component — purely presentational, no interactivity beyond the
 * Accordion primitive itself (already a Client Component internally).
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PdpDescriptionAccordionProps {
  description: string | null;
}

export function PdpDescriptionAccordion({ description }: PdpDescriptionAccordionProps) {
  if (!description) return null;

  return (
    <Accordion type="single" collapsible defaultValue="description">
      <AccordionItem value="description">
        <AccordionTrigger>
          <span className="font-display text-base font-semibold text-[var(--color-heading)]">
            Product Details
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="whitespace-pre-line">{description}</div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
