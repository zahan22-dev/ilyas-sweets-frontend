"use client";

import { useState, useEffect, useRef } from "react";
import { useCategories } from "@/hooks/useCategories";

interface StickyCategoryBarProps {
  onCategoryClick: (categorySlug: string) => void;
  activeCategory: string | null;
}

export default function StickyCategoryBar({ onCategoryClick, activeCategory }: StickyCategoryBarProps) {
  const { data: categories, isLoading } = useCategories();
  const [isSticky, setIsSticky] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroSection = document.getElementById("hero-section");
    
    const handleScroll = () => {
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setIsSticky(heroBottom < 0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="h-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="animate-pulse flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-24 bg-gray-200 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={barRef}
      className={`z-40 transition-all duration-300 ${
        isSticky 
          ? "fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-b border-gray-100" 
          : "relative bg-white border-b border-gray-100"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        <div className="flex items-center gap-2 md:gap-4 overflow-x-auto py-3 md:py-4 scroll-smooth [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
          <span className="text-xs md:text-sm font-black text-gray-400 uppercase tracking-widest whitespace-nowrap mr-2 hidden md:block">
            Categories:
          </span>
          
          {categories?.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.slug)}
              className={`whitespace-nowrap px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                activeCategory === category.slug
                  ? "bg-[#FFC702] text-[#111111] shadow-[0_4px_15px_rgba(255,199,2,0.4)]"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-[#111111]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
