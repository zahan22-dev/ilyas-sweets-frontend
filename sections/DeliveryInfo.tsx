export default function DeliveryInfo() {
  return (
    <section className="py-20 bg-[#111111] text-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Item 1 */}
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-[#FFC702]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3 className="text-xl font-black uppercase tracking-widest mb-3">Fresh Daily</h3>
            <p className="text-gray-400 font-bold">Every batch is prepared fresh each morning. We never compromise on quality.</p>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center text-center p-6 border-y md:border-y-0 md:border-x border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-[#FFC702]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.832-1.664L12 12l-4.168 4.164A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .832 1.664L12 12l4.168-4.164A2 2 0 0 0 17 6.172V2"/></svg>
            </div>
            <h3 className="text-xl font-black uppercase tracking-widest mb-3">Fast Delivery</h3>
            <p className="text-gray-400 font-bold">Get your favorite sweets delivered across Karachi within 60 minutes.</p>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-[#FFC702]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 className="text-xl font-black uppercase tracking-widest mb-3">Secure Packaging</h3>
            <p className="text-gray-400 font-bold">Premium, airtight packaging ensures your sweets arrive in perfect condition.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
