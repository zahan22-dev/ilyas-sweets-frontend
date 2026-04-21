import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, CATEGORIES } from "@/constants/data";

export const metadata = {
  title: "Shop Premium Sweets | Ilyas Sweets",
};

export default function Shop() {
  return (
    <main className="bg-[#FEFFFF] min-h-screen pt-32 pb-40">
      {/* Shop Header */}
      <section className="bg-[#111111] py-20 px-6 lg:px-12 rounded-b-[4rem] relative overflow-hidden mb-20 z-10">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-black font-heading text-white tracking-tighter leading-[0.9] uppercase mb-6">
            Our <span className="text-[#FFC702]">Menu</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-bold max-w-2xl mx-auto">
            Explore our complete collection of premium sweets, savory snacks, and traditional desserts.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16">
        {/* Filters Sidebar UI */}
        <aside className="w-full lg:w-1/4 flex-shrink-0">
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] border-2 border-gray-50 sticky top-40">
            <h3 className="text-2xl font-black font-heading uppercase tracking-widest text-[#111111] mb-8 border-b-2 border-gray-100 pb-4">
              Filters
            </h3>
            
            <div className="mb-10">
              <h4 className="text-lg font-black uppercase text-[#111111] mb-4">Categories</h4>
              <ul className="space-y-4">
                <li>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-6 h-6 rounded-md border-2 border-[#E10369] flex items-center justify-center bg-[#E10369] text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span className="text-lg font-bold text-[#111111] group-hover:text-[#E10369] transition-colors">All Items</span>
                  </label>
                </li>
                {CATEGORIES.map(c => (
                  <li key={c.id}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-6 h-6 rounded-md border-2 border-gray-300 group-hover:border-[#E10369] transition-colors"></div>
                      <span className="text-lg font-bold text-gray-500 group-hover:text-[#E10369] transition-colors">{c.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-black uppercase text-[#111111] mb-4">Sort By</h4>
              <div className="relative">
                <select className="w-full appearance-none bg-gray-50 border-2 border-gray-200 text-[#111111] font-bold text-lg rounded-xl px-5 py-4 outline-none focus:border-[#E10369] transition-colors">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-10 py-4 bg-[#111111] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#E10369] transition-colors duration-300">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-10">
            {PRODUCTS.map((product) => (
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
                    <h3 className="text-lg md:text-xl font-black font-heading text-[#111111] leading-tight group-hover:text-[#E10369] transition-colors tracking-tight mb-2 uppercase line-clamp-2">
                      {product.name}
                    </h3>
                    <span className="text-xl md:text-2xl font-black text-[#E10369] block">
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
          
          {/* Pagination UI */}
          <div className="mt-32 flex justify-center gap-4">
            <button className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-[#111111] font-black hover:border-[#E10369] hover:text-[#E10369] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="w-14 h-14 rounded-full bg-[#E10369] shadow-[0_10px_20px_rgba(225,3,105,0.4)] flex items-center justify-center text-white font-black text-xl">
              1
            </button>
            <button className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-[#111111] font-black text-xl hover:border-[#E10369] hover:text-[#E10369] transition-colors">
              2
            </button>
            <button className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-[#111111] font-black hover:border-[#E10369] hover:text-[#E10369] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
