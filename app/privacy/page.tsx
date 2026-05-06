import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Ilyas Sweets",
  description: "Learn how Ilyas Sweets protects and handles your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-[#FEFFFF] min-h-screen pt-40 pb-32">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-2 mb-8 rounded-full border-2 border-gray-100 bg-gray-50 text-gray-500 font-black text-[13px] uppercase tracking-[0.2em]">
            <span className="w-2 h-2 rounded-full bg-[#FFC702]"></span>
            Data Protection
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-heading text-[#111111] tracking-tighter leading-[1] uppercase mb-8">
            Privacy <span className="text-[#FFC702] italic pr-4">Policy</span>
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
                At Ilyas Sweets, we value the trust you place in us when you share your personal information. This Privacy Policy explains how we collect, use, and protect your data when you visit our website, place orders, or communicate with us.
              </p>
            </section>

            <section>
              <h2>2. Information We Collect</h2>
              <p>
                To provide you with a seamless bakery experience, we collect certain information when you interact with our platform:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li><strong>Personal Details:</strong> Name, email address, phone number, and delivery address when you place an order or register an account.</li>
                <li><strong>Order History:</strong> Information about the products you purchase from us.</li>
                <li><strong>Device Data:</strong> Basic technical information such as your IP address, browser type, and interactions with our website to help us improve your browsing experience.</li>
              </ul>
            </section>

            <section>
              <h2>3. How We Use Information</h2>
              <p>
                We use the collected information strictly to enhance your experience with Ilyas Sweets. Specifically, we use your data to:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>Process, fulfill, and deliver your orders accurately.</li>
                <li>Communicate with you regarding your order status, payment verification, or delivery updates.</li>
                <li>Respond to your customer service inquiries.</li>
                <li>Improve our website, product offerings, and overall service quality.</li>
              </ul>
            </section>

            <section>
              <h2>4. Data Protection</h2>
              <p>
                Your privacy is our priority. We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, please be aware that no transmission of data over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2>5. Sharing of Information</h2>
              <p>
                Ilyas Sweets does not sell, rent, or trade your personal information to third parties. We only share necessary details with trusted partners who assist us in operating our business, such as delivery partners (riders) who need your address and phone number to deliver your fresh orders.
              </p>
            </section>

            <section>
              <h2>6. Cookies</h2>
              <p>
                Our website uses basic "cookies" to remember your preferences (like your cart items) and to understand how visitors interact with our site. These cookies are essential for providing a smooth eCommerce experience. You can choose to disable cookies through your browser settings, though this may affect your ability to place orders smoothly.
              </p>
            </section>

            <section>
              <h2>7. Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal data, please contact us:
              </p>
              <ul className="list-none pl-0 space-y-2 mt-4 border-l-4 border-[#FFC702] pl-6 py-2 bg-gray-50 rounded-r-2xl">
                <li><strong>Email:</strong> privacy@ilyassweets.pk</li>
                <li><strong>Phone:</strong> +92 300 1234567</li>
                <li><strong>Address:</strong> 123 Premium Sweets Avenue, Karachi, Pakistan</li>
              </ul>
            </section>
          </div>
        </div>

        <div className="mt-20 border-t border-gray-100 pt-10 text-center">
          <Link href="/terms" className="inline-flex items-center gap-2 font-bold text-[#111111] hover:text-[#FFC702] transition-colors border-b-2 border-[#111111] hover:border-[#FFC702] pb-1">
            Read our Terms & Conditions
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
