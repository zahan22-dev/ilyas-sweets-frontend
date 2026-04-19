import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative pt-40 pb-32 lg:pt-56 lg:pb-40 overflow-hidden bg-[#FFC702] min-h-screen flex items-center">
      {/* Dynamic Background Shapes */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] bg-linear-to-br from-[#FFD700] to-[#FF8A00] rounded-full blur-[100px] opacity-80 animate-pulse"></div>
        <div className="absolute top-[40%] -left-[20%] w-[50vw] h-[50vw] bg-linear-to-tr from-[#FF8A00] to-primary rounded-full blur-[120px] opacity-40"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">
          
          {/* Text Content */}
          <div className="w-full lg:w-[55%] text-center lg:text-left relative z-20">
            <div className="inline-block px-6 py-2.5 mb-8 rounded-full bg-white text-primary font-black text-[14px] uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(0,0,0,0.1)] transform -rotate-2 hover:rotate-0 transition-transform cursor-default">
              ? 100% Premium Ingredients
            </div>
            <h1 className="text-[5.5rem] md:text-[7rem] lg:text-[8.5rem] font-black font-heading text-primary leading-[0.85] tracking-tighter mb-8 uppercase drop-shadow-xl">
              Hot <br /> 
              <span className="text-white drop-shadow-2xl relative inline-block transform -rotate-1 mt-2">Samosas,</span><br />
              <span className="text-[#111111]">&amp; Sweets!</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#111111]/90 mb-14 max-w-xl mx-auto lg:mx-0 font-bold leading-relaxed tracking-wide">
              The city's finest premium bakery is online. Craving traditional flavors? We deliver authentic happiness right to your door.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              {/* THE ULTIMATE CTA */}
              <button className="w-full sm:w-auto px-14 py-6 bg-linear-to-r from-secondary to-primary text-white font-black rounded-full hover:scale-105 hover:shadow-[0_20px_50px_rgba(225,3,105,0.5)] transition-all duration-300 text-xl tracking-[0.15em] uppercase relative overflow-hidden group">
                <span className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Order Right Now
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
              </button>
            </div>
          </div>

          {/* Explosive Image Composition */}
          <div className="w-full lg:w-[45%] relative h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center mt-10 lg:mt-0 z-10">
            {/* Main Center Image */}
            <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] rounded-full border-[12px] border-white shadow-[0_30px_60px_rgba(0,0,0,0.3)] overflow-hidden z-20 hover:scale-110 hover:rotate-3 transition-all duration-700">
              <Image 
                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1000&auto=format&fit=crop" 
                alt="Fresh Samosas" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            
            {/* Floating Image 1 */}
            <div className="absolute -top-10 right-0 md:top-0 md:-right-10 w-40 h-40 md:w-56 md:h-56 rounded-full border-8 border-white shadow-[0_20px_40px_rgba(0,0,0,0.25)] overflow-hidden z-30 animate-[bounce_4s_ease-in-out_infinite] hover:scale-110 transition-transform">
              <Image 
                src="https://images.unsplash.com/photo-1596803244618-8dbee441d70b?q=80&w=600&auto=format&fit=crop" 
                alt="Sweet Mithai" 
                fill 
                className="object-cover"
              />
            </div>

            {/* Floating Image 2 */}
            <div className="absolute -bottom-10 left-0 md:bottom-10 md:-left-10 w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-white shadow-[0_20px_40px_rgba(0,0,0,0.25)] overflow-hidden z-30 animate-[bounce_5s_ease-in-out_infinite_reverse] hover:scale-110 transition-transform">
              <Image 
                src="https://images.unsplash.com/photo-1559703248-dcaaec9fab78?q=80&w=600&auto=format&fit=crop" 
                alt="Desi Ice Cream" 
                fill 
                className="object-cover"
              />
            </div>
            
            {/* Massive Price Tag */}
            <div className="absolute top-1/2 -right-8 md:-right-16 bg-[#111111] text-white font-black py-6 px-8 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.4)] rotate-[15deg] z-40 hover:rotate-0 hover:scale-110 transition-all duration-300 border-4 border-accent">
              <span className="block text-[14px] uppercase tracking-widest text-[#FFC702] mb-1">Starting at</span>
              <span className="text-5xl font-heading tracking-tighter">Rs. 50</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

