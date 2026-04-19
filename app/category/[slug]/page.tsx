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
          <h1 className="text-6xl md:text-8xl font-black font-heading text-[#111111] mb-6 uppercase tracking-tighter">Category <span className="text-[#E10369]">Not Found</span></h1>
          <p className="text-2xl text-gray-500 font-bold mb-10">We couldn't find the category you're looking for.</p>
          <Link href="/shop" className="px-12 py-5 bg-linear-to-r from-[#E10369] to-[#701515] text-white font-black rounded-full uppercase tracking-widest hover:scale-105 transition-transform inline-block shadow-lg">
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
                    <div className="w-6 h-6 rounded-md border-2 border-gray-300 group-hover:border-[#E10369] transition-colors"></div>
                    <span className="text-lg font-bold text-gray-500 group-hover:text-[#E10369] transition-colors">All Items</span>
                  </Link>
                </li>
                {CATEGORIES.map(c => (
                  <li key={c.id}>
                    <Link href={`/category/${c.slug}`} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${c.slug === category.slug ? 'border-[#E10369] bg-[#E10369] text-white' : 'border-gray-300 group-hover:border-[#E10369]'}`}>
                        {c.slug === category.slug && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </div>
                      <span className={`text-lg font-bold transition-colors ${c.slug === category.slug ? 'text-[#111111]' : 'text-gray-500 group-hover:text-[#E10369]'}`}>{c.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <Link href="/shop" className="w-full flex items-center justify-center mt-10 py-4 bg-[#111111] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#E10369] transition-colors duration-300">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-32 pt-20">
              {categoryProducts.map((product) => (
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
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </span>
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
