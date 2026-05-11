import Image from "next/image";

export default function About() {
  return (
    <section className="pb-30 bg-[#FEFFFF] overflow-hidden relative">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-24 lg:gap-32">
          
          {/* Asymmetrical Image Layout */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10 w-[80%] h-[400px] md:h-[550px] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] ml-[10%]">
              <Image 
                src="/MOTi choor lado.png" 
                alt="Making Mithai" 
                fill 
                className="object-cover hover:scale-110 transition-transform duration-1000"
              />
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 w-[60%] h-[60%] rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-[12px] border-[#FEFFFF] z-20 group">
              <Image 
                src="/Mix Methai.png" 
                alt="Fresh Samosas" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />
            </div>
            
            {/* Experience Badge */}
            <div className="absolute -bottom-12 -right-8 bg-[#FFC702] text-white w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-[0_20px_40px_rgba(225,3,105,0.4)] z-30 border-[12px] border-[#FEFFFF] animate-[bounce_5s_ease-in-out_infinite]">
              <span className="text-6xl font-black font-heading tracking-tighter leading-none">20+</span>
              <span className="text-[14px] uppercase font-black text-center leading-tight mt-2 tracking-[0.2em] text-blacl">Years of<br/>Legacy</span>
            </div>
          </div>
          {/* Text Content */}
          <div className="w-full lg:w-1/2">
            <div className="flex items-center gap-6 mb-8">
              <span className="w-20 h-2 bg-[#FFC702] rounded-full"></span>
              <span className="text-[#FFC702] font-black uppercase tracking-[0.2em] text-[16px]">Our Story</span>
            </div>
            
            <h2 className="text-6xl md:text-7xl lg:text-[6.5rem] font-black font-heading text-[#111111] mb-12 leading-[0.85] tracking-tighter uppercase drop-shadow-sm">
              Pure <br/>
              <span className="text-[#701515] italic pr-4">Tradition.</span>
            </h2>
            
            <div className="space-y-8 text-xl md:text-2xl text-[#111111]/80 font-bold relative leading-relaxed tracking-wide">
              <svg className="absolute -top-10 -left-12 w-24 h-24 text-[#701515]/5 z-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              
              <p className="relative z-10">
                It started in a small kitchen with a simple belief: the best moments in life are celebrated with good food. For over two decades, Ilyas Sweets has been the cornerstone of family gatherings.
              </p>
              
              <p className="relative z-10">
                We don't use shortcuts. Our savory snacks are hand-folded daily, our traditional sweets are made with pure premium ingredients, and our recipes have been passed down through generations.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}