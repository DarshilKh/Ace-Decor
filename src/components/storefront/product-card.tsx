/**
 * components/storefront/product-card.tsx — Product Card
 *
 * Image, name, price with a 50%-off strike-through original price, subtle
 * hover lift. Used on the landing page's category grid / best sellers and
 * on the /shop grid. There is no live stock tracking in this static-data
 * catalog (no backend), so no stock-status badge is shown.
 */

import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/utils/format";

export interface ProductCardData {
  slug: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  image: { url: string; alt: string } | null;
}

interface ProductCardProps {
  product: ProductCardData;
  /** Pass true for above-the-fold cards (first row) to preload the image and improve LCP. */
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-muted-bg)]">
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            {...(priority ? {} : { loading: "lazy" as const })}
            className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[var(--color-muted-bg)] to-[var(--color-border)]" />
        )}
        <span className="absolute left-2 top-2 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-2 py-0.5 text-[11px] font-semibold text-white">
          {product.discountPercent}% OFF
        </span>
      </div>

      <div>
        <h3 className="text-sm font-medium text-[var(--color-heading)] line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--color-heading)]">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-[var(--color-body)] line-through">
            {formatPrice(product.originalPrice)}
          </span>
        </div>
      </div>
    </Link>
  );
}
