import Image from "next/image";

export default function CTA() {
  return (
    <section className="py-48 relative overflow-hidden bg-[#111111] text-white border-t-[12px] border-[#E10369]">
      {/* Decorative background image overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay">
        <Image 
          src="https://images.unsplash.com/photo-1596803244618-8dbee441d70b?q=80&w=2000&auto=format&fit=crop" 
          alt="Background Texture" 
          fill 
          className="object-cover grayscale"
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          <div className="w-32 h-32 mb-12 bg-linear-to-tr from-[#E10369] to-[#701515] rounded-full flex items-center justify-center relative shadow-[0_0_80px_rgba(225,3,105,0.6)] animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FFC702] relative z-10"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M2 12h20"/><path d="m5 7 3 5-3 5"/><path d="m19 7-3 5 3 5"/></svg>
          </div>
          
          <h2 className="text-6xl md:text-8xl lg:text-[8.5rem] font-black font-heading mb-12 leading-[0.85] tracking-tighter uppercase drop-shadow-2xl">
            Ready for a <br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FFC702] via-[#FF8A00] to-[#E10369]">Premium Feast?</span>
          </h2>
          
          <p className="text-2xl md:text-3xl text-white/80 mb-16 max-w-3xl mx-auto font-bold leading-relaxed tracking-wide">
            Hot snacks and sweet delights delivered to your door in 45 minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full">
            <button className="w-full sm:w-auto px-16 py-8 bg-linear-to-r from-[#E10369] to-[#701515] text-white font-black text-2xl tracking-[0.2em] uppercase rounded-full hover:scale-110 hover:shadow-[0_25px_60px_rgba(225,3,105,0.6)] flex items-center justify-center gap-4 transition-all duration-500 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform"><path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8c.9 0 1.8-.7 2-1.6l1.7-7.4"/><path d="m9 11 1 9"/><path d="M4.5 15.5h15"/><path d="m15 11-1 9"/></svg>
              Start Order
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-[#E10369]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </section>
  );
}
