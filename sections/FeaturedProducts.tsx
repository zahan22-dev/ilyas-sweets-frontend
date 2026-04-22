import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/constants/data";

export default function FeaturedProducts() {
  // Show 10 items for the 5-col grid
  const featured = PRODUCTS.slice(0, 10);

  return (
    <section className="py-24 md:py-32 bg-[#FEFFFF] relative z-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl lg:text-[5rem] font-black font-heading text-[#111111] mb-6 tracking-tighter leading-[0.9] uppercase">
            Signature <span className="text-[#FFC702]">Delights</span>
          </h2>
          <p className="text-lg md:text-xl text-[#111111]/70 font-bold tracking-wide">
            Taste the authentic flavors in every bite. Prepared fresh daily.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-10">
          {featured.map((product) => (
            <Link
              href={`/product/${product.slug}`}
              key={product.id}
              className="bg-white rounded-2xl md:rounded-3xl relative shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-100 transition-all duration-300 group flex flex-col h-full overflow-hidden"
            >
              {/* Square Image Container */}
              <div className="relative aspect-square w-full overflow-hidden bg-gray-50 border-b border-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#111111] px-3 py-1 rounded-full text-[10px] md:text-[11px] font-black z-10 shadow-sm tracking-widest uppercase">
                  {product.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 md:p-5 flex flex-col flex-grow">
                <div className="mb-4 flex-grow">
                  <h3 className="text-lg md:text-xl font-black font-heading text-[#111111] leading-tight group-hover:text-[#FFC702] transition-colors tracking-tight mb-2 uppercase line-clamp-2">
                    {product.name}
                  </h3>
                  <span className="text-xl md:text-2xl font-black text-[#FFC702] block">
                    Rs. {product.price}
                  </span>
                </div>

                <button className="w-full py-3 rounded-xl font-black uppercase tracking-[0.1em] transition-all duration-300 flex items-center justify-center gap-2 bg-[#FFC702] text-[#111111] hover:bg-[#e6b300] hover:shadow-[0_10px_20px_rgba(255,199,2,0.3)] hover:scale-[1.02] text-[12px] md:text-[14px]">
                  Add to Cart
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
