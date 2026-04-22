import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/constants/data";

export default function Categories() {
  return (
    <section className="py-40 bg-[#111111] relative z-10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-black font-heading text-white mb-6 tracking-tighter leading-[0.9] uppercase">
              Crave <br/><span className="text-[#FFC702]">It All.</span>
            </h2>
            <div className="w-32 h-3 bg-[#FFC702] rounded-full"></div>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-3 font-black text-[#FFC702] hover:text-white transition-colors text-xl tracking-widest uppercase group">
            View Menu
            <div className="w-12 h-12 rounded-full bg-[#FFC702] text-[#111111] flex items-center justify-center group-hover:bg-white transition-colors group-hover:scale-110 group-hover:translate-x-2 duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {CATEGORIES.map((category, i) => (
            <Link 
              href={`/category/${category.slug}`} 
              key={category.id}
              className={`group relative rounded-[3rem] overflow-hidden block bg-black hover:shadow-[0_30px_60px_rgba(255,199,2,0.15)] hover:-translate-y-4 transition-all duration-500 ${i === 0 || i === 3 ? "h-[400px] lg:h-[550px]" : "h-[400px] lg:h-[450px] lg:mt-12"}`}
            >
              {/* Overlay Gradient for Text Readability */}
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent z-10 transition-opacity duration-500 opacity-80 group-hover:opacity-90"></div>
              
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-125 opacity-70 group-hover:opacity-100"
              />
              
              <div className="absolute bottom-0 left-0 w-full p-10 z-20">
                <h3 className="text-5xl font-black font-heading text-white transform group-hover:-translate-y-4 transition-transform duration-500 tracking-tighter uppercase italic">
                  {category.name}
                </h3>
                <div className="flex items-center gap-3 text-[#FFC702] font-black opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100 text-xl tracking-widest uppercase mt-2">
                  <span>Shop Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
