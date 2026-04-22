import Image from "next/image";
import Link from "next/link";
import AboutSection from "@/sections/About";
import CTA from "@/sections/CTA";

export const metadata = {
  title: "About Us | Ilyas Sweets",
};

export default function AboutPage() {
  return (
    <main className="bg-[#FEFFFF] min-h-screen">
      {/* Page Header */}
      <section className="bg-[#111111] pt-40 pb-20 px-6 lg:px-12 rounded-b-[4rem] relative overflow-hidden z-10">
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
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FFC702] rounded-full blur-[100px] opacity-20 -z-10"></div>
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-[#FFC702] rounded-full blur-[100px] opacity-20 -z-10"></div>

        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <div className="inline-block px-6 py-2 mb-8 rounded-full border-2 border-white/10 text-white/60 font-black text-[14px] uppercase tracking-[0.2em]">
            Since 1995
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-black font-heading text-white tracking-tighter leading-[0.9] uppercase mb-8">
            Our <span className="text-[#FFC702] italic pr-4">Legacy.</span>
          </h1>
          <p className="text-xl md:text-3xl text-white/80 font-bold max-w-3xl mx-auto leading-relaxed tracking-wide">
            A family tradition of baking happiness, preserving culture, and spreading joy through authentic Pakistani flavors.
          </p>
        </div>
      </section>

      {/* Reuse the homepage About Section */}
      <div className="-mt-32 relative z-20 bg-[#FEFFFF] rounded-t-[4rem]">
        <AboutSection />
      </div>

      {/* Core Values Section */}
      <section className="py-40 bg-[#111111] text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black font-heading uppercase tracking-tighter leading-none mb-6">Our <span className="text-[#FFC702]">Promise</span></h2>
            <p className="text-2xl text-white/70 font-bold">Why thousands of families choose us for their celebrations.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-8 border-2 border-white/10 group-hover:border-[#FFC702] group-hover:bg-[#FFC702]/10 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FFC702]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4">100% Pure</h3>
              <p className="text-white/60 font-bold leading-relaxed text-lg">We use only premium desi ghee and the finest ingredients. No compromises.</p>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-8 border-2 border-white/10 group-hover:border-[#FFC702] group-hover:bg-[#FFC702]/10 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FFC702]"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4">Fresh Daily</h3>
              <p className="text-white/60 font-bold leading-relaxed text-lg">Baked and cooked fresh every single morning. We never sell day-old goods.</p>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-8 border-2 border-white/10 group-hover:border-[#FFC702] group-hover:bg-[#FFC702]/10 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FFC702]"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4">Made with Love</h3>
              <p className="text-white/60 font-bold leading-relaxed text-lg">Our recipes have been passed down through generations. Taste the authenticity.</p>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </main>
  );
}
