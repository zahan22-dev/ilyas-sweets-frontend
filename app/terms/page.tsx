export const metadata = {
  title: "Terms & Conditions | Ilyas Sweets",
};

export default function TermsConditions() {
  return (
    <main className="bg-[#FEFFFF] min-h-screen pt-40 pb-40">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-black font-heading text-[#111111] tracking-tighter leading-[0.9] uppercase mb-12 drop-shadow-sm">
          Terms & <span className="text-[#FFC702] italic pr-4">Conditions.</span>
        </h1>
        
        <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-2 border-gray-50 space-y-10 text-lg text-gray-600 font-bold leading-loose">
          <section>
            <h2 className="text-2xl font-black font-heading uppercase text-[#111111] tracking-widest mb-4">1. General Terms</h2>
            <p>By accessing and placing an order with Ilyas Sweets, you confirm that you are in agreement with and bound by the terms of service contained below. These terms apply to the entire website and any email or other type of communication between you and Ilyas Sweets.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black font-heading uppercase text-[#111111] tracking-widest mb-4">2. Products & Pricing</h2>
            <p>All products are subject to availability. We reserve the right to limit the quantity of items we supply. While we strive to ensure that all details, descriptions, and prices on our website are accurate, errors may occur. We reserve the right to correct any errors and change or update information at any time without prior notice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black font-heading uppercase text-[#111111] tracking-widest mb-4">3. Returns & Refunds</h2>
            <p>Due to the perishable nature of our products, we do not accept returns. If you receive an incorrect or damaged item, please contact us within 2 hours of delivery with photographic evidence, and we will arrange a replacement or refund at our discretion.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-black font-heading uppercase text-[#111111] tracking-widest mb-4">4. Liability</h2>
            <p>Ilyas Sweets shall not be liable for any direct, indirect, special, incidental, consequential, or exemplary damages, including but not limited to loss of data or profit, arising out of the use or the inability to use, the materials on this site.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
