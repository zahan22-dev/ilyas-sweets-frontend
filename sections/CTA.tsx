import Image from "next/image";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-32 md:py-48 relative overflow-hidden bg-[#111111] text-white border-t-[12px] border-[#FFC702]">
      {/* Decorative background image overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay">
        <Image 
          src="/Logo.png" 
          alt="Background Texture" 
          fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
          className="object-cover grayscale"
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-5xl md:text-7xl lg:text-[8rem] font-black font-heading mb-8 md:mb-12 leading-[0.9] tracking-tighter uppercase drop-shadow-2xl">
            Ready for a <br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FFC702] via-[#FF8A00] to-[#FFC702]">Premium Feast?</span>
          </h2>

          <p className="text-xl md:text-3xl text-white/80 mb-12 md:mb-16 max-w-3xl mx-auto font-bold leading-relaxed tracking-wide">
            Hot snacks and sweet delights delivered to your door in 45 minutes.
          </p>

          <div className="flex items-center justify-center w-full">
            <Link href="/shop">
              <button className="px-8 py-4 md:px-16 md:py-6 bg-[#FFC702] text-[#111111] font-black text-[14px] md:text-xl tracking-[0.15em] md:tracking-[0.2em] uppercase rounded-full hover:scale-105 hover:bg-[#e6b300] hover:shadow-[0_15px_40px_rgba(255,199,2,0.4)] flex items-center justify-center gap-3 md:gap-4 transition-all duration-300 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform md:w-8 md:h-8"><path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8c.9 0 1.8-.7 2-1.6l1.7-7.4"/><path d="m9 11 1 9"/><path d="M4.5 15.5h15"/><path d="m15 11-1 9"/></svg>
                Start Order
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FFC702]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </section>
  );
}
