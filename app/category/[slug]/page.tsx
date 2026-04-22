import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, CATEGORIES } from "@/constants/data";

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    return (
      <main className="bg-[#FEFFFF] min-h-[80vh] pt-40 pb-40 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-black font-heading text-[#111111] mb-6 uppercase tracking-tighter">Category <span className="text-[#FFC702]">Not Found</span></h1>
          <p className="text-2xl text-gray-500 font-bold mb-10">We couldn't find the category you're looking for.</p>
          <Link href="/shop" className="px-12 py-5 bg-linear-to-r from-[#FFC702] to-[#701515] text-white font-black rounded-full uppercase tracking-widest hover:scale-105 transition-transform inline-block shadow-lg">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  // Find all products that match this category's exact name
  const categoryProducts = PRODUCTS.filter((p) => p.category === category.name);

  return (
    <main className="bg-[#FEFFFF] min-h-screen pt-32 pb-40">
      {/* Category Header */}
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] z-0 opacity-40">
           <Image src={category.image} alt={category.name} fill className="object-cover blur-[80px]" />
        </div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-black font-heading text-white tracking-tighter leading-[0.9] uppercase mb-6">
            {category.name}
          </h1>
          <p className="text-xl md:text-2xl text-[#FFC702] font-bold max-w-2xl mx-auto uppercase tracking-widest">
            {categoryProducts.length} Premium {categoryProducts.length === 1 ? 'Item' : 'Items'}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16">
        {/* Filters Sidebar UI */}
        <aside className="w-full lg:w-1/4 flex-shrink-0">
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] border-2 border-gray-50 sticky top-40">
            <h3 className="text-2xl font-black font-heading uppercase tracking-widest text-[#111111] mb-8 border-b-2 border-gray-100 pb-4">
              Categories
            </h3>
            
            <div className="mb-10">
              <ul className="space-y-4">
                <li>
                  <Link href="/shop" className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-6 h-6 rounded-md border-2 border-gray-300 group-hover:border-[#FFC702] transition-colors"></div>
                    <span className="text-lg font-bold text-gray-500 group-hover:text-[#FFC702] transition-colors">All Items</span>
                  </Link>
                </li>
                {CATEGORIES.map(c => (
                  <li key={c.id}>
                    <Link href={`/category/${c.slug}`} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${c.slug === category.slug ? 'border-[#FFC702] bg-[#FFC702] text-white' : 'border-gray-300 group-hover:border-[#FFC702]'}`}>
                        {c.slug === category.slug && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </div>
                      <span className={`text-lg font-bold transition-colors ${c.slug === category.slug ? 'text-[#111111]' : 'text-gray-500 group-hover:text-[#FFC702]'}`}>{c.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <Link href="/shop" className="w-full flex items-center justify-center mt-10 py-4 bg-[#FFC702] text-[#111111] font-black uppercase tracking-widest rounded-xl hover:bg-[#e6b300] hover:shadow-[0_10px_20px_rgba(255,199,2,0.3)] transition-all duration-300">
              Clear Filters
            </Link>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="w-full lg:w-3/4">
          {categoryProducts.length === 0 ? (
            <div className="text-center py-20">
               <h3 className="text-4xl font-black font-heading uppercase text-gray-400">More coming soon.</h3>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-10">
              {categoryProducts.map((product) => (
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
          )}
        </div>
      </div>
    </main>
  );
}
