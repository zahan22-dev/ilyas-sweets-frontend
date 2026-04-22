import Image from "next/image";

export default function Promo() {
  return (
    <section className="relative py-40 overflow-hidden bg-[#701515] flex items-center justify-center">
      {/* Massive Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden flex flex-col items-center justify-center z-0 w-[200%] opacity-[0.03]">
         <span className="text-[20rem] font-black font-heading leading-none text-white uppercase italic tracking-tighter mix-blend-overlay">ILYAS SWEETS</span>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
        <div className="inline-block mb-10 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
          <span className="bg-[#FFC702] text-[#111111] font-black px-8 py-3 rounded-full text-[16px] uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(0,0,0,0.2)]">
            ?? Limited Time Offer
          </span>
        </div>
        
        <h2 className="text-6xl md:text-8xl lg:text-[7rem] font-black font-heading text-white mb-10 drop-shadow-2xl max-w-5xl mx-auto leading-[0.9] tracking-tighter uppercase italic transform -rotate-2">
          Fresh Batch Ready <br/><span className="text-[#FFC702]">Order Now!</span>
        </h2>
        
        <p className="text-2xl md:text-3xl text-white/90 mb-16 max-w-3xl mx-auto font-bold leading-relaxed tracking-wide transform -rotate-1">
          Get 20% off your first box of premium sweets. Don't wait�offer ends tonight!
        </p>
        
        <button className="px-10 py-5 md:px-16 md:py-7 bg-[#FFC702] text-[#111111] font-black text-lg md:text-2xl tracking-[0.15em] uppercase rounded-full hover:bg-[#e6b300] hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,199,2,0.4)] transition-all duration-300 transform -rotate-2 group">
          <span className="inline-block group-hover:-translate-y-1 transition-transform">Claim 20% Off Now</span>
        </button>
      </div>
    </section>
  );
}
