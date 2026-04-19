"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

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
        isScrolled ? "shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] py-4" : "py-6"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-[1.02] duration-300">
          <Image 
            src="/Logo.png" 
            alt="Ilyas Sweets" 
            width={160} 
            height={50} 
            className="h-10 md:h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10 text-[15px] font-semibold tracking-wide">
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
        <div className="flex items-center gap-8">
          <Link href="/cart" className="relative text-[#111111] hover:text-[#E10369] transition-all duration-300 group cursor-pointer block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:scale-110 transition-transform duration-300"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-[#E10369] text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white">
              3
            </span>
          </Link>
          <Link href="/shop" className="hidden md:flex items-center justify-center bg-linear-to-r from-[#E10369] to-[#701515] text-white font-black py-3 px-8 rounded-full hover:shadow-[0_15px_30px_rgba(225,3,105,0.4)] hover:scale-105 transition-all duration-300 text-[14px] tracking-[0.15em] uppercase">
            Order Now
          </Link>
        </div>
      </div>
    </header>
  );
}
