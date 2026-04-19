import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/constants/data";

export default function FeaturedProducts() {
  // Only show first 6 for featured
  const featured = PRODUCTS.slice(0, 6);

  return (
    <section className="py-40 bg-[#FEFFFF] relative z-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-4xl mx-auto mb-32">
          <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black font-heading text-[#111111] mb-8 tracking-tighter leading-[0.9] uppercase">
            Signature <span className="text-[#E10369]">Delights</span>
          </h2>
          <p className="text-xl md:text-2xl text-[#111111]/70 font-bold tracking-wide">
            Taste the authentic flavors in every bite. Prepared fresh daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-32 mt-20">
          {featured.map((product) => (
            <Link 
              href={`/product/${product.slug}`}
              key={product.id}
              className="bg-white rounded-[3rem] p-10 pt-40 relative shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-4 border-transparent hover:border-[#E10369]/20 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(225,3,105,0.2)] hover:-translate-y-4 group flex flex-col justify-between"
            >
              {/* Out of bounds image */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-[10px] border-white overflow-hidden bg-gray-50 z-20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="absolute top-6 right-6 bg-[#FFC702] text-[#111111] px-5 py-2 rounded-full text-[14px] font-black z-10 shadow-md tracking-widest uppercase">
                {product.category}
              </div>

              <div className="text-center mb-8 flex-grow">
                <h3 className="text-3xl font-black font-heading text-[#111111] leading-tight group-hover:text-[#701515] transition-colors tracking-tight mb-4 uppercase">
                  {product.name}
                </h3>
                <span className="text-4xl font-black text-[#E10369] block">
                  Rs. {product.price}
                </span>
              </div>

              <button className="w-full py-6 rounded-full font-black uppercase tracking-[0.15em] transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group/btn bg-linear-to-r from-[#E10369] to-[#701515] text-white shadow-[0_15px_30px_rgba(225,3,105,0.3)] hover:shadow-[0_20px_40px_rgba(225,3,105,0.5)] hover:scale-[1.02]">
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out"></span>
                <span className="relative z-10 flex items-center gap-2 text-[17px]">
                  Add to Cart
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
