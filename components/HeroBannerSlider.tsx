"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePublicHeroBanners } from "@/hooks/useHeroBanners";
import type { HeroBanner } from "@/lib/services/heroBanners"; // ← use service type, not local

// ─── No props needed — component fetches its own banners ──────────────────────
export default function HeroBannerSlider() {
  const { data: rawBanners, isLoading } = usePublicHeroBanners();
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const active: HeroBanner[] = (rawBanners ?? []).filter(
    (b: HeroBanner) => b.isActive
  );

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % active.length);
  }, [active.length]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + active.length) % active.length);
  }, [active.length]);

  useEffect(() => {
    if (active.length <= 1) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [active.length, goNext]);

  useEffect(() => {
    setCurrent(0);
  }, [active.length]);

  if (isLoading) {
    return (
      <div
        className="w-full bg-gray-200 animate-pulse"
        style={{ aspectRatio: isMobile ? "900/300" : "1920/600" }}
      />
    );
  }

  if (!active.length) return null;

  return (
    <section className="relative w-full overflow-hidden bg-gray-900">
      <div
        className="relative w-full"
        style={{ aspectRatio: isMobile ? "1000/320" : "1920/600" }}
      >
        {active.map((b, idx) => {
          const src =
            isMobile && b.mobileImageUrl ? b.mobileImageUrl : b.imageUrl;
          const isVisible = idx === current;

          return (
            <div
              key={b.id}
              aria-hidden={!isVisible}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isVisible ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={src}
                alt={b.title ?? "Hero banner"}
                fill
                priority={idx === 0}
                loading={idx === 0 ? "eager" : "lazy"}
                quality={85}
                sizes={
                  isMobile
                    ? "100vw"
                    : "(max-width: 1920px) 100vw, 1920px"
                }
                className="object-cover object-center"
              />
              {/* Text + CTA */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-3xl">
                {b.title && (
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                    {b.title}
                  </h1>
                )}
                {b.subtitle && (
                  <p className="mt-2 md:mt-3 text-sm md:text-lg text-white/90 drop-shadow">
                    {b.subtitle}
                  </p>
                )}
                {b.description && (
                  <p className="mt-1 md:mt-2 text-xs md:text-base text-white/75 line-clamp-2">
                    {b.description}
                  </p>
                )}
                {b.ctaText && b.ctaLink && (
                  <Link
                    href={b.ctaLink}
                    className="mt-4 md:mt-6 inline-block w-fit bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold text-sm md:text-base px-5 py-2.5 md:px-7 md:py-3 rounded-full shadow-lg transition-colors duration-200"
                  >
                    {b.ctaText}
                  </Link>
                )}
              </div>
            </div>
          );
        })}

        {active.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous banner"
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-lg transition-colors"
            >
              ‹
            </button>
            <button
              onClick={goNext}
              aria-label="Next banner"
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-lg transition-colors"
            >
              ›
            </button>
          </>
        )}

        {active.length > 1 && (
          <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {active.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to banner ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === current
                    ? "bg-yellow-400 w-6"
                    : "bg-white/60 hover:bg-white w-2"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}