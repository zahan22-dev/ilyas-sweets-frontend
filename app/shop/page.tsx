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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-32 pt-20">
            {PRODUCTS.map((product) => (
              <Link 
                href={`/product/${product.slug}`}
                key={product.id}
                className="bg-white rounded-[3rem] p-8 pt-40 relative shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-4 border-transparent hover:border-[#E10369]/20 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(225,3,105,0.2)] hover:-translate-y-4 group flex flex-col justify-between"
              >
                {/* Out of bounds image */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-[10px] border-white overflow-hidden bg-gray-50 z-20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="absolute top-6 right-6 bg-[#FFC702] text-[#111111] px-4 py-1.5 rounded-full text-[12px] font-black z-10 shadow-sm tracking-widest uppercase">
                  {product.category}
                </div>

                <div className="text-center mb-8 flex-grow">
                  <h3 className="text-2xl lg:text-3xl font-black font-heading text-[#111111] leading-tight group-hover:text-[#701515] transition-colors tracking-tight mb-3 uppercase">
                    {product.name}
                  </h3>
                  <span className="text-3xl font-black text-[#E10369] block">
                    Rs. {product.price}
                  </span>
                </div>

                <button className="w-full py-5 rounded-full font-black uppercase tracking-[0.15em] transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group/btn bg-linear-to-r from-[#E10369] to-[#701515] text-white shadow-[0_15px_30px_rgba(225,3,105,0.3)] hover:shadow-[0_20px_40px_rgba(225,3,105,0.5)] hover:scale-[1.02]">
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out"></span>
                  <span className="relative z-10 flex items-center gap-2 text-[15px]">
                    Add to Cart
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                </button>
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
