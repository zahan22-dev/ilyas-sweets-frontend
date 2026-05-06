import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Ilyas Sweets",
  description: "Terms and conditions for using the Ilyas Sweets platform and ordering our products.",
};

export default function TermsPage() {
  return (
    <main className="bg-[#FEFFFF] min-h-screen pt-40 pb-32">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-2 mb-8 rounded-full border-2 border-gray-100 bg-gray-50 text-gray-500 font-black text-[13px] uppercase tracking-[0.2em]">
            <span className="w-2 h-2 rounded-full bg-[#FFC702]"></span>
            Legal Information
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-heading text-[#111111] tracking-tighter leading-[1] uppercase mb-8">
            Terms & <span className="text-[#FFC702] italic pr-4">Conditions</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-lg prose-headings:font-black prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-[#111111] prose-p:text-gray-600 prose-p:font-medium prose-p:leading-relaxed prose-li:text-gray-600 prose-li:font-medium max-w-none">
          <div className="space-y-12">
            <section>
              <h2>1. Introduction</h2>
              <p>
                Welcome to Ilyas Sweets. These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website and placing an order, we assume you fully accept these terms and conditions.
              </p>
            </section>

            <section>
              <h2>2. Products & Orders</h2>
              <p>
                All our products are freshly prepared daily. Due to the perishable nature of our goods (sweets, bakery items, and snacks), product availability is subject to change without prior notice. 
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>Images on our website are for illustrative purposes. Actual product presentation may slightly vary.</li>
                <li>Customized or bulk orders must be placed at least 48 hours in advance.</li>
                <li>We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase or errors in product or pricing information.</li>
              </ul>
            </section>

            <section>
              <h2>3. Pricing & Availability</h2>
              <p>
                All prices are listed in Pakistani Rupees (PKR) and are inclusive of applicable taxes unless stated otherwise. We strive to provide accurate pricing, but errors may occasionally occur. If we discover an error in the price of an item you ordered, we will notify you and provide the option to reconfirm or cancel the order.
              </p>
            </section>

            <section>
              <h2>4. Delivery & Pickup</h2>
              <p>
                We currently offer local delivery and in-store pickup options. 
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>Delivery times are estimates and may be affected by weather, traffic, or other unforeseen circumstances.</li>
                <li>For in-store pickups, please present your order confirmation upon arrival.</li>
                <li>It is the customer's responsibility to provide accurate delivery information. Ilyas Sweets is not liable for delayed or failed deliveries due to incorrect addresses.</li>
              </ul>
            </section>

            <section>
              <h2>5. Payments</h2>
              <p>
                To provide flexibility to our customers, we currently support the following payment methods:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li><strong>Cash on Delivery (COD):</strong> Payment is collected in cash at the time of delivery.</li>
                <li><strong>Manual Bank Transfer:</strong> Direct deposit to our provided bank account. Order processing begins once the payment screenshot is verified.</li>
              </ul>
            </section>

            <section>
              <h2>6. Order Acceptance & Cancellation</h2>
              <p>
                Once an order is placed, our kitchen begins preparation to ensure maximum freshness. Because our products are perishable:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>Cancellations for standard orders are only accepted within 30 minutes of order placement.</li>
                <li>Customized and bulk orders cannot be cancelled once preparation has begun.</li>
                <li>If a cancellation is approved, refunds (for bank transfers) will be processed within 5-7 business days.</li>
              </ul>
            </section>

            <section>
              <h2>7. Limitation of Liability</h2>
              <p>
                Ilyas Sweets shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use of our products or website. We guarantee the freshness and quality of our products upon delivery or pickup. Any complaints regarding product quality must be reported within 12 hours of receiving the order.
              </p>
            </section>

            <section>
              <h2>8. Contact Information</h2>
              <p>
                If you have any questions or concerns regarding these Terms and Conditions, please reach out to us:
              </p>
              <ul className="list-none pl-0 space-y-2 mt-4 border-l-4 border-[#FFC702] pl-6 py-2 bg-gray-50 rounded-r-2xl">
                <li><strong>Email:</strong> order@ilyassweets.pk</li>
                <li><strong>Phone:</strong> +92 300 1234567</li>
                <li><strong>Address:</strong> 123 Premium Sweets Avenue, Karachi, Pakistan</li>
              </ul>
            </section>
          </div>
        </div>

        <div className="mt-20 border-t border-gray-100 pt-10 text-center">
          <Link href="/contact" className="inline-flex items-center gap-2 font-bold text-[#111111] hover:text-[#FFC702] transition-colors border-b-2 border-[#111111] hover:border-[#FFC702] pb-1">
            Have questions? Contact our support team
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
