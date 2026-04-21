"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/constants/data";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white ${
        isScrolled ? "shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]" : ""
      }`}
    >
      <div className={`transition-all duration-500 ${isScrolled ? "py-3" : "py-5"}`}>
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
            {["Home", "Shop", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item === "Home" ? "" : item.toLowerCase()}`}
                className="relative text-[#111111] hover:text-[#E10369] transition-colors duration-300 group py-2 font-bold uppercase tracking-widest text-sm"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r from-[#E10369] to-[#FFC702] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100 rounded-t-sm"></span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-6 md:gap-8">
            <Link href="/cart" className="relative text-[#111111] hover:text-[#E10369] transition-all duration-300 group cursor-pointer block">
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
              <span className="absolute -top-2 -right-2 bg-[#E10369] text-white text-[10px] md:text-[11px] font-black w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                3
              </span>
            </Link>
            <Link href="/shop" className="hidden md:flex items-center justify-center bg-linear-to-r from-[#E10369] to-[#701515] text-white font-black py-2.5 px-6 lg:py-3 lg:px-8 rounded-full hover:shadow-[0_15px_30px_rgba(225,3,105,0.4)] hover:scale-105 transition-all duration-300 text-[13px] lg:text-[14px] tracking-[0.15em] uppercase">
              Order Now
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Sub-Header (Sticky & Scrollable) */}
      <div className="border-t border-gray-100 bg-gray-50/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="flex items-center gap-6 overflow-x-auto py-2.5 md:py-3 scroll-smooth" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map(c => (
              <Link 
                href={`/category/${c.slug}`} 
                key={c.id} 
                className="whitespace-nowrap text-[12px] md:text-[13px] font-black uppercase tracking-[0.15em] text-gray-500 hover:text-[#E10369] transition-colors py-1"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-2xl md:hidden flex flex-col p-6 gap-6 z-50">
          <nav className="flex flex-col gap-6">
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
          </nav>
          <Link 
            href="/shop" 
            className="w-full flex items-center justify-center bg-linear-to-r from-[#E10369] to-[#701515] text-white font-black py-4 rounded-xl text-[15px] tracking-[0.15em] uppercase shadow-lg mt-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Order Now
          </Link>
        </div>
      )}
    </header>
  );
}
