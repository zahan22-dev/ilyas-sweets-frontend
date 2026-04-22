import Link from "next/link";

export default function DealsSection() {
  return (
    <section className="py-24 bg-gray-50 border-t border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black font-heading text-[#111111] mb-4 tracking-tighter uppercase">
            Exclusive <span className="text-[#FFC702]">Deals</span>
          </h2>
          <p className="text-lg text-gray-500 font-bold">Limited time offers you can't resist.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Deal 1 */}
          <div className="bg-[#111111] rounded-[2rem] p-8 md:p-12 relative overflow-hidden flex flex-col justify-center min-h-[300px] group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC702] rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-[80%]">
              <div className="inline-block px-4 py-1 bg-[#FFC702] text-white text-xs font-black uppercase tracking-widest rounded-full mb-6">First Order Only</div>
              <h3 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight uppercase font-heading">
                Get <span className="text-[#FFC702]">20% Off</span>
              </h3>
              <p className="text-gray-400 font-bold mb-8">Try our premium sweets today and get an exclusive discount on your entire cart.</p>
              
              <Link href="/shop" className="inline-flex items-center gap-2 font-black uppercase text-[#FFC702] hover:text-white transition-colors tracking-widest text-sm">
                Claim Offer
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>

          {/* Deal 2 */}
          <div className="bg-white rounded-[2rem] p-8 md:p-12 relative overflow-hidden flex flex-col justify-center min-h-[300px] group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FFC702] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-[80%]">
              <div className="inline-block px-4 py-1 bg-[#FFC702] text-[#111111] text-xs font-black uppercase tracking-widest rounded-full mb-6">Bulk Orders</div>
              <h3 className="text-3xl md:text-5xl font-black text-[#111111] mb-4 leading-tight uppercase font-heading">
                Free <span className="text-[#FFC702]">Delivery</span>
              </h3>
              <p className="text-gray-500 font-bold mb-8">Order 2kg or more of any sweets or snacks and we'll deliver it to your door for free.</p>
              
              <Link href="/shop" className="inline-flex items-center gap-2 font-black uppercase text-[#FFC702] hover:text-[#111111] transition-colors tracking-widest text-sm">
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
