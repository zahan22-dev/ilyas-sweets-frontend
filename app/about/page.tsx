import Image from "next/image";
import Link from "next/link";
import CTA from "@/sections/CTA";

export const metadata = {
  title: "Our Story | Ilyas Sweets",
  description: "Discover the heritage of Ilyas Sweets. Founded in 1965, our legacy of authentic taste, premium quality, and traditional recipes continues through three generations.",
};

export default function AboutPage() {
  return (
    <main className="bg-[#FEFFFF] min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative pt-40 pb-32 px-6 lg:px-12 bg-[#111111] overflow-hidden rounded-b-[4rem] z-10">
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
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FFC702] rounded-full blur-[120px] opacity-20 -z-10"></div>
        
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-6 py-2 mb-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/80 font-black text-[13px] uppercase tracking-[0.2em]">
            <span className="w-2 h-2 rounded-full bg-[#FFC702]"></span>
            Est. 1965
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-heading text-white tracking-tighter leading-[1] uppercase mb-8">
            A Legacy of <span className="text-[#FFC702] italic block md:inline mt-2 md:mt-0 pr-4">Taste.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 font-medium max-w-3xl mx-auto leading-relaxed">
            From a small beginning to a trusted name, our journey is built on passion, consistency, and the love of our customers.
          </p>
        </div>
      </section>

      {/* Our Story Content */}
      <section className="py-24 md:py-32 relative z-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter uppercase text-[#111111]">
                How It All <span className="text-[#FFC702]">Began</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
                <p>
                  Ilyas Sweets was founded in 1965 by <strong className="text-gray-900">Muhammad Ilyas Khan</strong>, who started this journey with a very small setup but a monumental dream. Through his relentless hard work, dedication, and an unwavering passion for quality, he built a name that families could implicitly trust.
                </p>
                <p>
                  He believed that true sweetness lies in the purity of the ingredients and the honesty of the preparation. This philosophy became the bedrock of our bakery.
                </p>
              </div>
            </div>
            <div className="relative">
              {/* Abstract graphic representing history/growth instead of placeholder image */}
              <div className="aspect-[4/5] bg-orange-50 rounded-[3rem] border-2 border-orange-100 flex items-center justify-center p-12 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-200/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                 <h3 className="text-8xl font-black text-orange-900/10 font-heading select-none absolute">1965</h3>
                 <div className="text-center z-10">
                   <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mx-auto mb-6">
                      <span className="text-3xl">🌾</span>
                   </div>
                   <p className="text-orange-900 font-bold text-xl">Rooted in Tradition</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Generations Timeline */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter uppercase text-[#111111] mb-4">
              Passed Down Through <span className="text-[#FFC702]">Generations</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
              A legacy of uncompromising quality, carried forward by family.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-20 right-20 h-1 bg-gradient-to-r from-orange-200 via-yellow-300 to-orange-200 rounded-full"></div>

            {/* Gen 1 */}
            <div className="relative z-10 text-center group">
              <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-lg border-2 border-orange-100 flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-all duration-300">
                <span className="text-3xl font-black text-orange-800">1st</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">The Foundation</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                Muhammad Ilyas Khan laid the foundation, establishing our core recipes and the unmatched standard of using pure, unadulterated ingredients.
              </p>
            </div>

            {/* Gen 2 */}
            <div className="relative z-10 text-center group mt-8 md:mt-0">
              <div className="w-24 h-24 mx-auto bg-[#FFC702] rounded-2xl shadow-xl shadow-yellow-500/20 flex items-center justify-center mb-8 -rotate-3 group-hover:rotate-0 transition-all duration-300">
                <span className="text-3xl font-black text-[#111111]">2nd</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">The Expansion</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                His three sons continued the legacy with the same commitment. They worked seamlessly to grow Ilyas Sweets while rigorously maintaining the original taste and values.
              </p>
            </div>

            {/* Gen 3 */}
            <div className="relative z-10 text-center group mt-8 md:mt-0">
              <div className="w-24 h-24 mx-auto bg-gray-900 rounded-2xl shadow-lg flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-all duration-300">
                <span className="text-3xl font-black text-white">3rd</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">The Modern Era</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                Today, his grandsons proudly carry the torch. Blending cherished tradition with modern ideas, ensuring our heritage meets contemporary excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl text-center">
          <span className="text-[#FFC702] font-black tracking-widest uppercase text-sm mb-4 block">Our Commitment</span>
          <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter uppercase text-[#111111] mb-12">
            The Ilyas Sweets Promise
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-6 text-left mb-16">
            <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:border-yellow-200 transition-colors">
              <div className="text-3xl mb-4">🏅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Uncompromising Quality</h3>
              <p className="text-gray-600 leading-relaxed font-medium">We meticulously select premium ingredients, ensuring every bite reflects our decades of culinary mastery.</p>
            </div>
            
            <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:border-yellow-200 transition-colors">
              <div className="text-3xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Halal Certified</h3>
              <p className="text-gray-600 leading-relaxed font-medium">Strict adherence to Halal practices across our entire supply chain and preparation process.</p>
            </div>
          </div>

          <div className="text-left bg-[#111111] text-white p-10 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FFC702] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
            <h3 className="text-3xl font-black font-heading tracking-tighter uppercase text-[#FFC702] mb-6">
              Food Safety & Halal Policy
            </h3>
            <div className="space-y-6 text-white/80 font-medium text-lg leading-relaxed">
              <p>
                Ilyas Sweets is committed to providing safe, hygienic, Halal, and high-quality food products including sweets, bakery items, cakes, snacks, and beverages.
              </p>
              <p>
                We use fresh ingredients and maintain strict hygiene standards in preparation, storage, and delivery to ensure product safety and quality.
              </p>
              <p>
                Our team follows proper food handling practices, and we continuously work to maintain consistency in taste, quality, and presentation, including customized orders.
              </p>
              <p>
                This policy reflects our commitment to customer satisfaction and delivering safe, fresh, and Halal products at all times.
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 md:p-12 bg-orange-50 rounded-[3rem]">
            <p className="text-xl md:text-2xl font-bold text-orange-900 leading-relaxed italic">
              "We don't just bake sweets; we preserve a culture. Every box that leaves our kitchen carries our family's honor, love, and a prayer for your happiness."
            </p>
          </div>
        </div>
      </section>

      <CTA />
    </main>
  );
}
