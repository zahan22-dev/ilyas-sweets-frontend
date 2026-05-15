"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from 'react';

export interface Product {
  id: string | number;
  name: string;
  slug: string;
  basePrice?: number | string | { $numberDecimal: string } | null;
  stock: number;
  images: { imageUrl: string; isFeatured?: boolean }[];
  variants?: { id: number; label: string; price: number | string | { $numberDecimal: string } }[];
  category?: { name: string };
}

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
}

// Normalize Prisma Decimal / stringified numbers from the API
function normalizePrice(
  price: number | string | { $numberDecimal: string } | undefined | null,
): number {
  if (price == null) return 0;
  if (typeof price === "number") return price;
  if (typeof price === "string") return parseFloat(price) || 0;
  if ("$numberDecimal" in price) return parseFloat(price.$numberDecimal) || 0;
  return 0;
}

export function getDisplayPrice(product: Product): number {
  // Show lowest variant price when variants exist, otherwise fall back to basePrice
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map((v) => normalizePrice(v.price));
    return Math.min(...prices);
  }
  return normalizePrice(product.basePrice);
}

export function formatPrice(price: number): string {
  return `Rs. ${Math.round(price).toLocaleString()}`;
}

/**
 * ProductCard — navigates to /product/[slug] on button click.
 *
 * Direct add-to-cart was removed because products support variants,
 * custom weights, and piece-based pricing that require the product page
 * for correct user input before adding to cart.
 */
export default function ProductCard({
  product,
  showCategory = false,
}: ProductCardProps) {
  const price = getDisplayPrice(product);
  const resolvedImage = useMemo(() => {
    const imgs = product.images || [];
    const pick = (obj: any) => obj?.imageUrl || obj?.url || null;
    const featured = imgs.find((img: any) => img.isFeatured && pick(img));
    if (featured) return pick(featured);
    const first = imgs.find((img: any) => pick(img));
    if (first) return pick(first);
    return '/placeholder-product.png';
  }, [product.images]);
  const [imgSrc, setImgSrc] = useState<string>(resolvedImage);
  const isOutOfStock = product.stock === 0;
  const hasVariants = (product.variants?.length ?? 0) > 1;

  return (
    <div className="group bg-white rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative aspect-square overflow-hidden bg-gray-50"
      >
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => {
            if (imgSrc !== '/placeholder-product.png') setImgSrc('/placeholder-product.png');
          }}
        />

        {/* Category Badge */}
        {showCategory && product.category && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#111111] px-3 py-1 rounded-full text-[10px] md:text-[11px] font-black z-10 shadow-sm tracking-widest uppercase">
            {product.category.name}
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <Link href={`/product/${product.slug}`} className="flex-grow">
          <h3 className="font-black text-[#111111] text-sm md:text-base leading-tight mb-1 line-clamp-1 hover:text-[#FFC702] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-1 mb-3">
          {price > 0 ? (
            <>
              <span className="text-[#FFC702] font-black text-base md:text-lg">
                {formatPrice(price)}
              </span>
              {hasVariants && (
                <span className="text-gray-400 text-xs font-medium">
                  onwards
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-400 font-medium text-sm">
              See options
            </span>
          )}
        </div>

        {/* CTA — navigates to product page */}
        <Link
          href={`/product/${product.slug}`}
          className={`w-full py-2.5 md:py-3 rounded-xl font-black uppercase tracking-[0.08em] transition-all duration-300 flex items-center justify-center gap-2 text-[11px] md:text-[13px] ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
              : "bg-[#FFC702] text-[#111111] hover:bg-[#e6b300] hover:shadow-[0_8px_16px_rgba(255,199,2,0.3)] hover:scale-[1.02]"
          }`}
        >
          {isOutOfStock ? (
            "Out of Stock"
          ) : (
            <>
              View Product
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </>
          )}
        </Link>
      </div>
    </div>
  );
}
