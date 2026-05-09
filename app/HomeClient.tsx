"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import HeroBannerSlider from "@/components/HeroBannerSlider";
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

  const registerSection = useCallback(
    (slug: string, element: HTMLElement | null) => {
      if (element) sectionRefs.current.set(slug, element);
    },
    []
  );

  const handleCategoryClick = useCallback((slug: string) => {
    const element = sectionRefs.current.get(slug);
    if (element) {
      isManualScroll.current = true;
      setActiveCategory(slug);
      const stickyBarHeight = 64;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - stickyBarHeight;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isManualScroll.current = false;
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (!categories?.length) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (isManualScroll.current) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const slug = entry.target.getAttribute("data-category-slug");
          if (slug) setActiveCategory(slug);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "-64px 0px -50% 0px",
      threshold: 0,
    });

    sectionRefs.current.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [categories]);

  useEffect(() => {
    if (categories?.length && !activeCategory) {
      setActiveCategory(categories[0].slug);
    }
  }, [categories, activeCategory]);

  return (
    <>
      {/*
        HeroBannerSlider fetches its own data.
        If there are no active banners it returns null and the static Hero below shows.
      */}
      <HeroBannerSlider />
      <StickyCategoryBar
        onCategoryClick={handleCategoryClick}
        activeCategory={activeCategory}
      />

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

      <DeliveryInfo />
      <DealsSection />
      <Promo />
      <ReviewsSection />
      <About />
      <CTA />
    </>
  );
}