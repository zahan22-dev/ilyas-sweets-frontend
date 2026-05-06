"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartContext } from "@/providers/CartProvider";
import { PRODUCTS } from "@/constants/data";
import toast from "react-hot-toast";

export default function FeaturedProducts() {
  const { addToCart } = useCartContext();
  // Show 8 items for the 4-col grid
  const featured = PRODUCTS.slice(0, 8);

  const handleAddToCart = async (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
      });
      
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#FEFFFF] relative z-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-[4rem] font-black font-heading text-[#111111] mb-4 tracking-tighter leading-[0.9] uppercase">
            Signature <span className="text-[#FFC702]">Delights</span>
          </h2>
          <p className="text-base md:text-lg text-[#111111]/70 font-bold tracking-wide">
            Taste the authentic flavors in every bite. Prepared fresh daily.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image */}
              <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#111111] px-3 py-1 rounded-full text-[10px] md:text-[11px] font-black z-10 shadow-sm tracking-widest uppercase">
                  {product.category}
                </div>
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
                  <span className="text-[#FFC702] font-black text-base md:text-lg">
                    Rs. {product.price}
                  </span>
                </div>
                
                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="w-full py-2.5 md:py-3 rounded-xl font-black uppercase tracking-[0.08em] transition-all duration-300 flex items-center justify-center gap-2 bg-[#FFC702] text-[#111111] hover:bg-[#e6b300] hover:shadow-[0_10px_20px_rgba(255,199,2,0.3)] hover:scale-[1.02] text-[11px] md:text-[13px]"
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
          ))}
        </div>
      </div>
    </section>
  );
}
