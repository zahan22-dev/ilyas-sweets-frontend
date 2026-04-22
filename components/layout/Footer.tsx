import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="bg-white inline-block px-4 py-2 rounded-xl">
              <Image 
                src="/Logo.png" 
                alt="Ilyas Sweets" 
                width={140} 
                height={50} 
                className="h-10 w-auto object-contain brightness-0 invert-0"
              />
            </div>
            <p className="text-white/80 leading-relaxed max-w-sm text-[15px]">
              Bringing you fresh, premium quality authentic sweets and savory snacks every day. Experience the finest traditional taste.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFC702] transition-colors text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFC702] transition-colors text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 font-heading tracking-wide">Quick Links</h4>
            <ul className="space-y-4">
              {["Home", "Shop", "About Us", "Contact"].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item === "Home" ? "" : item === "About Us" ? "about" : item.toLowerCase()}`} 
                    className="text-white/80 hover:text-accent transition-colors flex items-center gap-3 text-[15px]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xl font-bold mb-6 font-heading tracking-wide">Legal</h4>
            <ul className="space-y-4">
              {["Privacy Policy", "Terms & Conditions", "Shipping Policy"].map((item) => {
                const slug = item === "Privacy Policy" ? "privacy" : item === "Terms & Conditions" ? "terms" : "shipping";
                return (
                  <li key={item}>
                    <Link href={`/${slug}`} className="text-white/80 hover:text-accent transition-colors flex items-center gap-3 text-[15px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-bold mb-6 font-heading tracking-wide">Contact Us</h4>
            <ul className="space-y-5 text-white/80 text-[15px]">
              <li className="flex items-start gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0 mt-0.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="leading-relaxed">123 Premium Sweets Avenue,<br/>Karachi, Pakistan</span>
              </li>
              <li className="flex items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <span>order@ilyassweets.pk</span>
              </li>
              <li className="flex items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                <span>+92 300 1234567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-white/60 text-sm tracking-wide">
          <p>&copy; {new Date().getFullYear()} Ilyas Sweets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
