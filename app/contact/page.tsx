import Image from "next/image";

export const metadata = {
  title: "Contact Us | Ilyas Sweets",
};

export default function ContactPage() {
  return (
    <main className="bg-[#FEFFFF] min-h-screen pt-40 pb-40">
      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="mb-20 text-center">
          <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-black font-heading text-[#111111] tracking-tighter leading-[0.85] uppercase drop-shadow-sm">
            Say <br/><span className="text-[#E10369] italic pr-4">Hello.</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#111111]/70 font-bold mt-8 max-w-2xl mx-auto">
            Got a question about a bulk order, catering, or just want to say hi? We'd love to hear from you.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-20">
          {/* Contact Details & Map */}
          <div className="w-full lg:w-[45%] space-y-12">
            <div className="bg-[#111111] text-white p-12 rounded-[3rem] shadow-[0_20px_40px_rgba(0,0,0,0.2)] relative overflow-hidden">
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#E10369] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
              
              <h3 className="text-3xl font-black font-heading uppercase tracking-tighter mb-10">Get in Touch</h3>
              
              <ul className="space-y-10 text-lg font-bold">
                <li className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-[#E10369] group-hover:bg-[#E10369] group-hover:text-white transition-colors shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <h4 className="text-white/50 text-sm uppercase tracking-widest mb-1">Visit Us</h4>
                    <span className="leading-relaxed">123 Premium Sweets Avenue,<br/>Karachi, Pakistan</span>
                  </div>
                </li>
                <li className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-[#E10369] group-hover:bg-[#E10369] group-hover:text-white transition-colors shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <div>
                    <h4 className="text-white/50 text-sm uppercase tracking-widest mb-1">Email Us</h4>
                    <span>order@ilyassweets.pk</span>
                  </div>
                </li>
                <li className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-[#E10369] group-hover:bg-[#E10369] group-hover:text-white transition-colors shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                  </div>
                  <div>
                    <h4 className="text-white/50 text-sm uppercase tracking-widest mb-1">Call Us</h4>
                    <span>+92 300 1234567</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gray-100 rounded-[3rem] h-100 relative overflow-hidden border-4 border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
              {/* Map Placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-gray-400 opacity-50"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>
                <span className="font-bold tracking-widest uppercase text-sm">Interactive Map Location</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="w-full lg:w-[55%]">
            <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-2 border-gray-50 h-full">
              <h3 className="text-3xl font-black font-heading uppercase tracking-tighter mb-10 text-[#111111]">Send a Message</h3>
              
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest text-gray-500">First Name</label>
                    <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-5 font-bold text-lg text-[#111111] outline-none focus:border-[#E10369] focus:bg-white transition-all duration-300" placeholder="Ali" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest text-gray-500">Last Name</label>
                    <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-5 font-bold text-lg text-[#111111] outline-none focus:border-[#E10369] focus:bg-white transition-all duration-300" placeholder="Khan" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-gray-500">Email Address</label>
                  <input type="email" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-5 font-bold text-lg text-[#111111] outline-none focus:border-[#E10369] focus:bg-white transition-all duration-300" placeholder="ali@example.com" />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-gray-500">Message</label>
                  <textarea rows={6} className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl px-6 py-5 font-bold text-lg text-[#111111] outline-none focus:border-[#E10369] focus:bg-white transition-all duration-300 resize-none custom-scrollbar" placeholder="How can we help you?"></textarea>
                </div>

                <button className="w-full py-6 rounded-full font-black uppercase tracking-[0.15em] transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group/btn bg-linear-to-r from-[#E10369] to-[#701515] text-white shadow-[0_15px_30px_rgba(225,3,105,0.3)] hover:shadow-[0_20px_40px_rgba(225,3,105,0.5)] hover:scale-[1.02] mt-4">
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out"></span>
                  <span className="relative z-10 flex items-center gap-2 text-[17px]">
                    Send Message
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-2 transition-transform"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
