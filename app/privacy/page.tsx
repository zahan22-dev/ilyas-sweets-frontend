export const metadata = {
  title: "Privacy Policy | Ilyas Sweets",
};

export default function PrivacyPolicy() {
  return (
    <main className="bg-[#FEFFFF] min-h-screen pt-40 pb-40">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-black font-heading text-[#111111] tracking-tighter leading-[0.9] uppercase mb-12 drop-shadow-sm">
          Privacy <span className="text-[#E10369] italic pr-4">Policy.</span>
        </h1>
        
        <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-2 border-gray-50 space-y-10 text-lg text-gray-600 font-bold leading-loose">
          <section>
            <h2 className="text-2xl font-black font-heading uppercase text-[#111111] tracking-widest mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when you place an order, create an account, or contact us for customer support. This may include your name, email address, phone number, delivery address, and payment information (processed securely by our payment partners).</p>
          </section>

          <section>
            <h2 className="text-2xl font-black font-heading uppercase text-[#111111] tracking-widest mb-4">2. How We Use Your Information</h2>
            <p>Your information is used strictly to fulfill your orders, provide customer service, and communicate with you about your purchases. With your explicit consent, we may occasionally send you promotional offers or updates about our products.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black font-heading uppercase text-[#111111] tracking-widest mb-4">3. Data Security</h2>
            <p>We implement robust security measures to protect your personal information. All payment transactions are encrypted using industry-standard technology. We never store your raw credit card details on our servers.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-black font-heading uppercase text-[#111111] tracking-widest mb-4">4. Sharing Your Information</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share necessary details with trusted service providers (like delivery partners) solely for the purpose of fulfilling your order.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
