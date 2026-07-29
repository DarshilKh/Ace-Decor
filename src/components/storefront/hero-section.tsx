/**
 * components/storefront/hero-section.tsx — Landing Page Hero
 *
 * Large collage of 3 curated product photographs, a single elegant
 * tagline, and one CTA ("Explore Collection"). Fully static — no banner
 * database, no admin management. The 3 images are hand-picked from the
 * product catalog (src/data/products.ts's HERO_COLLAGE_IMAGES) for visual
 * variety; swap them there if you'd like different photos featured.
 */

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { HERO_COLLAGE_IMAGES } from "@/data/products";

function CollageTile({
  image,
  className,
  priority = false,
}: {
  image: { url: string; alt: string } | undefined;
  className: string;
  priority?: boolean;
}) {
  return (
    <div className={`overflow-hidden bg-gradient-to-br from-[var(--color-muted-bg)] to-[var(--color-border)] ${className}`}>
      {image && (
        <div className="relative h-full w-full">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={priority}
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}

export function HeroSection() {
  const [first, second, third] = HERO_COLLAGE_IMAGES;

  return (
    <section className="relative overflow-hidden bg-[var(--color-background)]">
      <div className="container-content py-12 lg:py-20">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Tagline + CTA */}
          <div className="order-2 lg:order-1 lg:pt-4">
            <h1 className="font-display text-3xl font-semibold leading-tight text-[var(--color-heading)] sm:text-4xl lg:text-5xl">
              Elevate every room with thoughtful design
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--color-body)]">
              Discover premium home décor — crafted with care, made for everyday
              comfort. Scandinavian-inspired elegance for the modern Indian home.
            </p>
            <div className="mt-8">
              <Button asChild variant="primary" size="lg">
                <Link href="/shop">Explore Collection</Link>
              </Button>
            </div>
          </div>

          {/* Image collage — 2x2 grid, 1 large + 2 small */}
          <div className="order-1 grid grid-cols-2 gap-3 lg:order-2 lg:gap-4">
            <CollageTile image={first} className="col-span-2 aspect-[16/10] rounded-[var(--radius-xl)]" priority />
            <CollageTile image={second} className="aspect-square rounded-[var(--radius-lg)]" />
            <CollageTile image={third} className="aspect-square rounded-[var(--radius-lg)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
