"use client";

/**
 * components/storefront/pdp-gallery.tsx — PDP Image Gallery
 *
 * DESIGN_SYSTEM §16: large primary image with thumbnail strip (desktop) or
 * swipeable carousel with dot indicators (mobile). 3–4 images minimum
 * including alternate-angle views (PRD FR-6).
 *
 * Implemented with native horizontal-scroll-snap for the mobile carousel
 * (no extra carousel library needed — avoids unnecessary bundle weight) and
 * a thumbnail strip for desktop, both driven by the same `activeIndex` state.
 */

import { useRef, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils/cn";

export interface GalleryImage {
  url: string;
  alt: string;
}

interface PdpGalleryProps {
  images: GalleryImage[];
  productName: string;
}

export function PdpGallery({ images, productName }: PdpGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--color-muted-bg)] to-[var(--color-border)]" />
    );
  }

  // Clamp to a valid index so TypeScript (noUncheckedIndexedAccess) can see
  // this access is always in bounds without a non-null assertion — images
  // is guaranteed non-empty past the guard above.
  const safeIndex = Math.min(Math.max(activeIndex, 0), images.length - 1);
  const firstImage = images[0];
  const activeImage = images[safeIndex] ?? firstImage;

  if (!activeImage) {
    // Unreachable given the length guard above, but satisfies strict null
    // checks without an `!` assertion (forbidden by RULES §3.1 strict / ESLint).
    return null;
  }

  function scrollToIndex(index: number) {
    setActiveIndex(index);
    const container = scrollRef.current;
    if (!container) return;
    const child = container.children[index] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  function handleScroll() {
    const container = scrollRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    const index = Math.round(scrollLeft / width);
    if (index !== activeIndex && index >= 0 && index < images.length) {
      setActiveIndex(index);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Mobile: swipeable carousel with dot indicators */}
      <div className="lg:hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-[var(--radius-xl)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => (
            <div
              key={image.url}
              className="relative aspect-square w-full shrink-0 snap-start"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5" role="tablist" aria-label="Product images">
            {images.map((image, index) => (
              <button
                key={image.url}
                type="button"
                onClick={() => scrollToIndex(index)}
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`View image ${index + 1} of ${images.length}`}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  index === activeIndex
                    ? "bg-[var(--color-primary)]"
                    : "bg-[var(--color-border)]",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: large primary image + thumbnail strip */}
      <div className="hidden lg:block">
        <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-muted-bg)]">
          <Image
            src={activeImage.url}
            alt={activeImage.alt || `${productName} photo ${safeIndex + 1}`}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            priority
            className="object-cover"
          />
        </div>

        {images.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-3">
            {images.map((image, index) => (
              <button
                key={image.url}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1} of ${images.length}`}
                aria-current={index === activeIndex}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-[var(--radius-md)] ring-2 ring-offset-2 transition-all",
                  index === activeIndex
                    ? "ring-[var(--color-primary)]"
                    : "ring-transparent hover:ring-[var(--color-border)]",
                )}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
