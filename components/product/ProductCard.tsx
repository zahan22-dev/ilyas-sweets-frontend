"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartContext } from "@/providers/CartProvider";
import toast from "react-hot-toast";

export interface Product {
  id: string | number;
  name: string;
  slug: string;
  basePrice?: number | { $numberDecimal: string };
  stock: number;
  images: { imageUrl: string; isFeatured?: boolean }[];
  variants?: { id: number; label: string; price: number | { $numberDecimal: string } }[];
  category?: { name: string };
}

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
}

// Helper to normalize price (handles Prisma Decimal serialization and stringified numbers)
function normalizePrice(price: number | string | { $numberDecimal: string } | undefined | null): number {
  if (price === undefined || price === null) return 0;
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price) || 0;
  if (typeof price === 'object' && '$numberDecimal' in price) {
    return parseFloat(price.$numberDecimal) || 0;
  }
  return 0;
}

export function getDisplayPrice(product: Product): number {
  // Priority: lowest variant price > basePrice > 0
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map(v => normalizePrice(v.price));
    return Math.min(...prices);
  }
  return normalizePrice(product.basePrice);
}

export function formatPrice(price: number): string {
  return `Rs. ${Math.round(price).toLocaleString()}`;
}

export default function ProductCard({ product, showCategory = false }: ProductCardProps) {
  const { addToCart } = useCartContext();
  
  const price = getDisplayPrice(product);
  // Image resolution priority: Featured > First gallery > Placeholder
  const featuredImage = product.images?.find((img) => img.isFeatured)?.imageUrl || 
                       product.images?.[0]?.imageUrl || 
                       "/placeholder-product.png";
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }

    try {
      // Get first variant if available, otherwise use custom
      const variantId = product.variants?.[0]?.id;
      
      await addToCart({
        productId: Number(product.id),
        variantId: variantId,
        quantity: 1,
      });
      
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="group bg-white rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={featuredImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
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
        
        {/* Price Display */}
        <div className="flex items-center gap-1 mb-3">
          {price > 0 ? (
            <>
              <span className="text-[#FFC702] font-black text-base md:text-lg">
                {formatPrice(price)}
              </span>
              {product.variants && product.variants.length > 1 && (
                <span className="text-gray-400 text-xs font-medium">onwards</span>
              )}
            </>
          ) : (
            <span className="text-gray-400 font-medium text-sm">Price not available</span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full py-2.5 md:py-3 rounded-xl font-black uppercase tracking-[0.08em] transition-all duration-300 flex items-center justify-center gap-2 bg-[#FFC702] text-[#111111] hover:bg-[#e6b300] hover:shadow-[0_10px_20px_rgba(255,199,2,0.3)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-[11px] md:text-[13px]"
        >
          Add to Cart
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="group-hover:translate-x-1 transition-transform"
          >
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
