"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Hero from "@/sections/Hero";
import StickyCategoryBar from "@/sections/StickyCategoryBar";
import CategoryProductSection from "@/sections/CategoryProductSection";
import FeaturedProducts from "@/sections/FeaturedProducts";
import Promo from "@/sections/Promo";
import DealsSection from "@/sections/Deals";
import ReviewsSection from "@/sections/Reviews";
import DeliveryInfo from "@/sections/DeliveryInfo";
import About from "@/sections/About";
import CTA from "@/sections/CTA";
import { useCategories } from "@/hooks/useCategories";

export default function HomeClient() {
  const { data: categories } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const isManualScroll = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Register section ref
  const registerSection = useCallback((slug: string, element: HTMLElement | null) => {
    if (element) {
      sectionRefs.current.set(slug, element);
    }
  }, []);

  // Handle category click - scroll to section
  const handleCategoryClick = useCallback((slug: string) => {
    const element = sectionRefs.current.get(slug);
    if (element) {
      isManualScroll.current = true;
      setActiveCategory(slug);
      
      // Calculate offset for sticky header
      const stickyBarHeight = 64; // Approximate height of sticky bar
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - stickyBarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Reset manual scroll flag after animation
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isManualScroll.current = false;
      }, 1000);
    }
  }, []);

  // Intersection Observer for auto-highlighting active category
  useEffect(() => {
    if (!categories?.length) return;

    const observerOptions = {
      root: null,
      rootMargin: "-64px 0px -50% 0px", // Offset for sticky bar, trigger at top half
      threshold: 0,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (isManualScroll.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const slug = entry.target.getAttribute("data-category-slug");
          if (slug) {
            setActiveCategory(slug);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all category sections
    sectionRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [categories]);

  // Set first category as active on mount
  useEffect(() => {
    if (categories?.length && !activeCategory) {
      setActiveCategory(categories[0].slug);
    }
  }, [categories, activeCategory]);

  return (
    <>
      <Hero />
      
      {/* Sticky Category Bar */}
      <StickyCategoryBar 
        onCategoryClick={handleCategoryClick}
        activeCategory={activeCategory}
      />

      {/* Category Product Sections */}
      <div className="bg-gray-50">
        {categories?.map((category) => (
          <div
            key={category.id}
            data-category-slug={category.slug}
            ref={(el) => registerSection(category.slug, el)}
          >
            <CategoryProductSection category={category} />
          </div>
        ))}
      </div>
      {/* Other Sections */}
      <DeliveryInfo />
      <DealsSection />
      <Promo />
      <ReviewsSection />
      <About />
      <CTA />
    </>
  );
}
