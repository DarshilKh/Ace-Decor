/**
 * components/storefront/trust-strip.tsx — Trust/Brand Strip
 *
 * DESIGN_SYSTEM §17.5: 3-4 icon+text items, simple, no marketplace banner styling.
 */

import { MessageCircle, RotateCcw, Sparkles, Truck } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: MessageCircle,
    title: "Quick WhatsApp Response",
    description: "Real answers from our team, fast",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day hassle-free return policy",
  },
  {
    icon: Sparkles,
    title: "Quality Materials",
    description: "Thoughtfully sourced, built to last",
  },
  {
    icon: Truck,
    title: "Pan-India Delivery",
    description: "Delivered nationwide, arranged over WhatsApp",
  },
] as const;

export function TrustStrip() {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-muted-bg)] py-10 lg:py-12">
      <div className="container-content">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-2.5 text-center lg:flex-row lg:items-start lg:text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)]">
                <item.icon className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-heading)]">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-xs text-[var(--color-body)]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
