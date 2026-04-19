import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/constants/data";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const product = PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    return (
      <main className="bg-[#FEFFFF] min-h-[80vh] pt-40 pb-40 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-black font-heading text-[#111111] mb-6 uppercase tracking-tighter">Product <span className="text-[#E10369]">Not Found</span></h1>
          <p className="text-2xl text-gray-500 font-bold mb-10">We couldn't find the sweet you're looking for.</p>
          <Link href="/shop" className="px-12 py-5 bg-linear-to-r from-[#E10369] to-[#701515] text-white font-black rounded-full uppercase tracking-widest hover:scale-105 transition-transform inline-block shadow-lg">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  // Get some related products (just picking others)
  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <main className="bg-[#FEFFFF] min-h-screen pt-32 pb-40">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-gray-400 mb-12">
          <Link href="/" className="hover:text-[#E10369] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#E10369] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#111111]">{product.category}</span>
        </div>

        {/* Product Section */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-32">
          {/* Gallery (Left) */}
          <div className="w-full lg:w-1/2 flex flex-col md:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 order-2 md:order-1">
              {[1, 2, 3].map((thumb) => (
                <div key={thumb} className={`w-20 h-20 md:w-28 md:h-28 rounded-3xl overflow-hidden cursor-pointer border-4 ${thumb === 1 ? "border-[#E10369]" : "border-transparent hover:border-[#FFC702]"} transition-all duration-300 relative`}>
                  <Image 
                    src={product.image} 
                    alt={`Thumbnail ${thumb}`} 
                    fill 
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="relative w-full h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden order-1 md:order-2 shadow-[0_30px_60px_rgba(0,0,0,0.15)] group bg-gray-100 border-[8px] border-white">
              <div className="absolute top-6 left-6 bg-[#FFC702] text-[#111111] px-5 py-2 rounded-full text-[14px] font-black z-20 shadow-md tracking-widest uppercase">
                {product.category}
              </div>
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700 z-10"
                priority
              />
            </div>
          </div>

          {/* Details (Right) */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black font-heading text-[#111111] mb-6 leading-[0.9] tracking-tighter uppercase drop-shadow-sm">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-6 mb-8">
              <span className="text-5xl md:text-6xl font-black text-[#E10369] tracking-tighter">
                Rs. {product.price}
              </span>
              <div className="flex items-center text-[#FFC702] gap-1 bg-[#111111] px-4 py-2 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span className="text-white text-sm font-bold ml-2">(150+)</span>
              </div>
            </div>

            <p className="text-xl md:text-2xl text-[#111111]/80 font-bold leading-relaxed mb-12">
              {product.description}
            </p>

            {/* Actions */}
            <div className="space-y-8">
              {/* Quantity */}
              <div className="flex items-center gap-6">
                <span className="text-lg font-black uppercase tracking-widest text-gray-500">Quantity</span>
                <div className="flex items-center bg-gray-100 rounded-full p-2 border-2 border-gray-200">
                  <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#111111] font-black text-2xl hover:text-[#E10369] transition-colors shadow-sm">-</button>
                  <span className="w-16 text-center font-black text-2xl text-[#111111]">1</span>
                  <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#111111] font-black text-2xl hover:text-[#E10369] transition-colors shadow-sm">+</button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-5">
                <button className="flex-1 py-6 rounded-full font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden group/btn bg-linear-to-r from-[#E10369] to-[#701515] text-white shadow-[0_20px_40px_rgba(225,3,105,0.4)] hover:shadow-[0_25px_50px_rgba(225,3,105,0.6)] hover:scale-[1.02] text-[17px]">
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out"></span>
                  <span className="relative z-10 flex items-center gap-3">
                    Add to Cart
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-2 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                </button>
                <button className="flex-1 py-6 rounded-full font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 bg-[#111111] text-[#FFC702] hover:bg-[#FFC702] hover:text-[#111111] hover:scale-[1.02] text-[17px] border-4 border-[#111111] hover:border-transparent hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                  Buy Now
                </button>
              </div>
            </div>

            {/* Perks */}
            <div className="mt-16 pt-10 border-t-2 border-gray-100 grid grid-cols-2 gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-[#E10369]/10 flex items-center justify-center text-[#E10369] group hover:bg-[#E10369] hover:text-white transition-colors cursor-default">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <span className="font-black text-[#111111] uppercase tracking-wide text-lg">Secure<br/>Payment</span>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-[#FFC702]/20 flex items-center justify-center text-[#FF8A00] group hover:bg-[#FFC702] hover:text-[#111111] transition-colors cursor-default">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2" ry="2"/><rect width="6" height="6" x="9" y="9" rx="1" ry="1"/><path d="M9 15v2"/><path d="M15 15v2"/><path d="M15 7v2"/><path d="M9 7v2"/></svg>
                </div>
                <span className="font-black text-[#111111] uppercase tracking-wide text-lg">Freshly<br/>Baked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="mb-40">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-[4.5rem] font-black font-heading text-[#111111] tracking-tighter uppercase drop-shadow-sm">
              The <span className="text-[#E10369]">Details</span>
            </h2>
            <div className="flex-1 h-2 bg-gray-100 rounded-full mt-4"></div>
          </div>
          <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-[0_20px_40px_rgba(0,0,0,0.05)] border-2 border-gray-50 text-xl md:text-2xl text-[#111111]/80 font-bold leading-loose space-y-8 tracking-wide">
            <p>
              {product.description}
            </p>
            <p>
              Experience the pinnacle of traditional Pakistani flavors with our absolutely fresh and premium sweets and snacks. Every piece is handcrafted by our master artisans using authentic, centuries-old recipes that have made Ilyas Sweets a household name.
            </p>
            
            {/* Ingredients Section */}
            {product.ingredients && (
              <div className="mt-10 pt-10 border-t-2 border-gray-100">
                <h3 className="text-2xl font-black font-heading uppercase text-[#111111] tracking-widest mb-4">Core Ingredients</h3>
                <div className="flex flex-wrap gap-3">
                  {product.ingredients.split(', ').map((ingredient, index) => (
                    <span key={index} className="px-5 py-2 bg-gray-100 text-gray-600 rounded-full text-base font-black tracking-widest uppercase">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
            <div>
              <h2 className="text-5xl md:text-6xl lg:text-[5rem] font-black font-heading text-[#111111] tracking-tighter uppercase leading-[0.9] drop-shadow-sm">
                You May <br/><span className="text-[#FFC702]">Also Like</span>
              </h2>
            </div>
            <div className="w-32 h-3 bg-[#E10369] rounded-full hidden md:block"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-32 pt-20">
            {relatedProducts.map((p) => (
              <Link 
                href={`/product/${p.slug}`}
                key={p.id}
                className="bg-white rounded-[3rem] p-10 pt-40 relative shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-4 border-transparent hover:border-[#E10369]/20 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(225,3,105,0.2)] hover:-translate-y-4 group flex flex-col justify-between"
              >
                {/* Out of bounds image */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-[10px] border-white overflow-hidden bg-gray-50 z-20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="text-center mb-8 flex-grow">
                  <h3 className="text-3xl font-black font-heading text-[#111111] leading-tight group-hover:text-[#701515] transition-colors tracking-tight mb-4 uppercase">
                    {p.name}
                  </h3>
                  <span className="text-4xl font-black text-[#E10369] block">
                    Rs. {p.price}
                  </span>
                </div>

                <button className="w-full py-6 rounded-full font-black uppercase tracking-[0.15em] transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group/btn bg-[#111111] text-white hover:bg-[#FFC702] hover:text-[#111111] shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(255,199,2,0.4)] hover:scale-[1.02]">
                  <span className="relative z-10 flex items-center gap-2 text-[15px]">
                    View Details
                  </span>
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
