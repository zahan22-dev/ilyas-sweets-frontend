"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartContext } from "@/providers/CartProvider";

// Chevron Down Icon
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isMobileLegalOpen, setIsMobileLegalOpen] = useState(false);
  const { getTotalItems } = useCartContext();

  return (
    <header className="relative bg-white border-b border-gray-100">
      <div className="py-4">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 -ml-2 text-[#111111]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-[1.02] duration-300">
            <Image 
              src="/Logo.png" 
              alt="Ilyas Sweets"
              width={160}
              height={50}
              className="h-8 md:h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-[15px] font-semibold tracking-wide">
            {["Home", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item === "Home" ? "" : item.toLowerCase()}`}
                className="relative text-[#111111] hover:text-[#FFC702] transition-colors duration-300 group py-2 font-bold uppercase tracking-widest text-sm"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r from-[#FFC702] to-[#FFC702] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100 rounded-t-sm"></span>
              </Link>
            ))}

            {/* Legal Dropdown (Desktop) */}
            <div className="relative">
              <button
                onClick={() => setIsLegalOpen(!isLegalOpen)}
                onMouseEnter={() => setIsLegalOpen(true)}
                className="relative text-[#111111] hover:text-[#FFC702] transition-colors duration-300 group py-2 font-bold uppercase tracking-widest text-sm flex items-center gap-1"
              >
                Legal
                <ChevronDownIcon className={`transition-transform duration-200 ${isLegalOpen ? "rotate-180" : ""}`} />
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r from-[#FFC702] to-[#FFC702] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100 rounded-t-sm"></span>
              </button>

              {/* Dropdown Menu */}
              {isLegalOpen && (
                <div
                  onMouseLeave={() => setIsLegalOpen(false)}
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                >
                  <Link
                    href="/terms"
                    className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-yellow-50 hover:text-[#FFC702] transition-colors"
                    onClick={() => setIsLegalOpen(false)}
                  >
                    Terms & Conditions
                  </Link>
                  <Link
                    href="/privacy"
                    className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-yellow-50 hover:text-[#FFC702] transition-colors"
                    onClick={() => setIsLegalOpen(false)}
                  >
                    Privacy Policy
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-6 md:gap-8">
            <Link href="/cart" className="relative text-[#111111] hover:text-[#FFC702] transition-all duration-300 group cursor-pointer block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:scale-110 transition-transform duration-300 md:w-7 md:h-7"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-[#FFC702] text-[#111111] text-[10px] md:text-[11px] font-black w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                {getTotalItems() || 0}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-2xl md:hidden flex flex-col p-6 gap-4 z-50 lg:relative">
          <nav className="flex flex-col gap-4">
            {["Home", "Shop", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item === "Home" ? "" : item.toLowerCase()}`}
                className="text-[#111111] font-black uppercase tracking-widest text-lg border-b border-gray-100 pb-4"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}

            {/* Legal Section (Mobile) */}
            <div className="border-b border-gray-100 pb-4">
              <button
                onClick={() => setIsMobileLegalOpen(!isMobileLegalOpen)}
                className="w-full flex items-center justify-between text-[#111111] font-black uppercase tracking-widest text-lg"
              >
                Legal
                <ChevronDownIcon className={`transition-transform duration-200 ${isMobileLegalOpen ? "rotate-180" : ""}`} />
              </button>

              {isMobileLegalOpen && (
                <div className="mt-3 ml-4 flex flex-col gap-2">
                  <Link
                    href="/terms-and-conditions"
                    className="text-gray-600 font-semibold text-base py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Terms & Conditions
                  </Link>
                  <Link
                    href="/privacy-policy"
                    className="text-gray-600 font-semibold text-base py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Privacy Policy
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
