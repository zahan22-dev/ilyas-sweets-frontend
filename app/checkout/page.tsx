import Link from "next/link";
import { PRODUCTS } from "@/constants/data";

export const metadata = {
  title: "Checkout | Ilyas Sweets",
};

export default function Checkout() {
  const cartItems = PRODUCTS.slice(0, 3);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <main className="bg-[#FEFFFF] min-h-screen pt-40 pb-40">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <Link href="/cart" className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-[#FFC702] transition-colors mb-6 uppercase tracking-widest text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Cart
          </Link>
          <h1 className="text-6xl md:text-7xl lg:text-[6rem] font-black font-heading text-[#111111] tracking-tighter leading-[0.85] uppercase drop-shadow-sm">
            Secure <br/><span className="text-[#FFC702] italic pr-4">Checkout.</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          {/* Checkout Form */}
          <div className="w-full lg:w-[60%]">
            <form className="space-y-12">
              {/* Contact Info */}
              <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-2 border-gray-50">
                <h3 className="text-2xl font-black font-heading uppercase tracking-tighter mb-8 text-[#111111]">Contact Information</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-500">First Name</label>
                      <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300" placeholder="Ali" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-500">Last Name</label>
                      <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300" placeholder="Khan" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-gray-500">Email Address</label>
                    <input type="email" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300" placeholder="ali@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-gray-500">Phone Number</label>
                    <input type="tel" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300" placeholder="0300 1234567" />
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-2 border-gray-50">
                <h3 className="text-2xl font-black font-heading uppercase tracking-tighter mb-8 text-[#111111]">Delivery Details</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-gray-500">Street Address</label>
                    <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300" placeholder="House/Apartment, Street Name" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-500">City</label>
                      <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300" defaultValue="Karachi" readOnly />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-500">Area / Block</label>
                      <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300" placeholder="e.g. DHA Phase 5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-2 border-gray-50">
                <h3 className="text-2xl font-black font-heading uppercase tracking-tighter mb-8 text-[#111111]">Payment</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-6 border-2 border-[#FFC702] bg-[#FFC702]/5 rounded-2xl cursor-pointer transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full border-4 border-[#FFC702] bg-white"></div>
                      <span className="text-lg font-black uppercase text-[#111111]">Cash on Delivery</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FFC702]"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                  </label>
                  <label className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-2xl cursor-not-allowed opacity-50 grayscale">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                      <span className="text-lg font-black uppercase text-[#111111]">Credit / Debit Card (Coming Soon)</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[40%]">
            <div className="bg-[#111111] rounded-[3rem] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.2)] text-white sticky top-40 overflow-hidden z-10">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#FFC702] rounded-full blur-[80px] opacity-20 -z-10"></div>
              
              <h3 className="text-3xl font-black font-heading uppercase tracking-tighter mb-8 border-b-2 border-white/10 pb-6">Your Order</h3>
              
              <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-lg leading-tight mb-1">{item.name}</h4>
                      <span className="text-sm font-bold text-gray-400">Qty: 1</span>
                    </div>
                    <span className="font-black text-[#FFC702]">Rs. {item.price}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 text-lg font-bold mb-10 border-t-2 border-white/10 pt-8">
                <div className="flex justify-between items-center text-white/80">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-white/80">
                  <span>Delivery</span>
                  <span>Rs. 150</span>
                </div>
                <div className="pt-6 border-t-2 border-white/10 flex justify-between items-center">
                  <span className="text-2xl uppercase tracking-widest">Total</span>
                  <span className="text-4xl font-black text-[#FFC702]">Rs. {subtotal + 150}</span>
                </div>
              </div>

              <button className="w-full py-6 rounded-full font-black uppercase tracking-[0.15em] transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group/btn bg-linear-to-r from-[#FFC702] to-[#701515] text-white shadow-[0_15px_30px_rgba(225,3,105,0.3)] hover:shadow-[0_20px_40px_rgba(225,3,105,0.5)] hover:scale-[1.02]">
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out"></span>
                <span className="relative z-10 flex items-center gap-2 text-[17px]">
                  Place Order
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-2 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
              </button>
              
              <p className="text-center text-gray-400 text-sm font-bold mt-6 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Your data is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
