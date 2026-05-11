"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/product/ProductCard";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface CategoryProductSectionProps {
  category: Category;
}

const CategoryProductSection = forwardRef<HTMLElement, CategoryProductSectionProps>(
  ({ category }, ref) => {
    const { data: products, isLoading } = useProducts(category.slug);
    const displayProducts = products?.slice(0, 4) || [];

    return (
      <section
        ref={ref}
        id={`category-${category.slug}`}
        className="py-12 md:py-16 bg-white scroll-mt-16"
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-heading text-[#111111] tracking-tighter uppercase">
                {category.name}
              </h2>
              {category.description && (
                <p className="text-gray-500 mt-2 font-medium">{category.description}</p>
              )}
            </div>
            <Link
              href={`/category/${category.slug}`}
              className="w-fit px-8 py-2.5 md:py-3 rounded-full font-black uppercase tracking-[0.08em] transition-all duration-300 flex items-center justify-center gap-2 bg-[#FFC702] text-[#111111] hover:bg-[#e6b300] hover:shadow-[0_10px_20px_rgba(255,199,2,0.3)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-[11px] md:text-[13px]"
            >
              View All
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-2xl mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <p className="text-gray-400 font-medium">No products in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }
);

CategoryProductSection.displayName = "CategoryProductSection";

export default CategoryProductSection;
