"use client";

import { useState, useEffect, useCallback } from "react";
import { useProducts } from "@/hooks/useProducts";
import { productsService, Product } from "@/lib/services/products";
import ProductCard from "./ProductCard";

interface Category {
  id: number;
  name: string;
  slug: string;
  sortOrder?: number;
}

interface ShopProductsProps {
  categories: Category[];
  searchQuery?: string;
}

export default function ShopProducts({
  categories,
  searchQuery,
}: ShopProductsProps) {
  const { data: products, isLoading } = useProducts();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Sort categories by sortOrder (already sorted from backend, but keep client safe)
  const sortedCategories = [...categories].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  // Handle search
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    let cancelled = false;
    const performSearch = async () => {
      setIsSearching(true);
      try {
        const results = await productsService.search(searchQuery);
        if (!cancelled) setSearchResults(results);
      } catch {
        if (!cancelled) setSearchResults([]);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    };
    performSearch();
    return () => { cancelled = true; };
  }, [searchQuery]);

  const allProducts = searchQuery ? searchResults : products;
  const isLoadingProducts = searchQuery ? isSearching : isLoading;

  const filteredProducts =
    allProducts?.filter((p: any) =>
      selectedCategory ? p.category?.slug === selectedCategory : true,
    ) ?? [];

  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    switch (sortBy) {
      case "price-low":
        return (Number(a.basePrice) || 0) - (Number(b.basePrice) || 0);
      case "price-high":
        return (Number(b.basePrice) || 0) - (Number(a.basePrice) || 0);
      case "newest":
        return (
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
        );
      default:
        return 0;
    }
  });

  const handleCategorySelect = useCallback((slug: string) => {
    setSelectedCategory(slug);
    setFilterDrawerOpen(false); // auto-close drawer on selection (mobile)
  }, []);

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h4 className="text-sm font-black uppercase text-[#111111] mb-3 tracking-widest">
          Categories
        </h4>
        <ul className="space-y-1.5">
          <li>
            <button
              onClick={() => handleCategorySelect("")}
              className={`flex items-center gap-2.5 w-full text-left font-semibold text-sm transition-colors py-1 ${
                selectedCategory === ""
                  ? "text-[#FFC702]"
                  : "text-gray-600 hover:text-[#FFC702]"
              }`}
            >
              <span
                className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  selectedCategory === ""
                    ? "bg-[#FFC702] border-[#FFC702]"
                    : "border-gray-300"
                }`}
              >
                {selectedCategory === "" && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
              All Items
            </button>
          </li>
          {sortedCategories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => handleCategorySelect(cat.slug)}
                className={`flex items-center gap-2.5 w-full text-left font-semibold text-sm transition-colors py-1 ${
                  selectedCategory === cat.slug
                    ? "text-[#FFC702]"
                    : "text-gray-600 hover:text-[#FFC702]"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-[#FFC702] border-[#FFC702]"
                      : "border-gray-300"
                  }`}
                >
                  {selectedCategory === cat.slug && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sort */}
      <div>
        <h4 className="text-sm font-black uppercase text-[#111111] mb-3 tracking-widest">
          Sort By
        </h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-[#111111] font-medium text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#FFC702] transition-colors"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  );

  if (isLoadingProducts) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-2xl mb-3" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* ── Mobile Filter Toggle ─────────────────────────────────────────── */}
      <div className="lg:hidden flex items-center gap-3 mb-2">
        <button
          onClick={() => setFilterDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm text-[#111111] shadow-sm hover:border-[#FFC702] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="8" x2="16" y1="12" y2="12" />
            <line x1="11" x2="13" y1="18" y2="18" />
          </svg>
          Filters
          {selectedCategory && (
            <span className="w-2 h-2 bg-[#FFC702] rounded-full" />
          )}
        </button>

        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory("")}
            className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors"
          >
            Clear filter
          </button>
        )}

        <span className="ml-auto text-xs text-gray-400 font-medium">
          {sortedProducts.length} item{sortedProducts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Mobile Filter Drawer ─────────────────────────────────────────── */}
      {filterDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setFilterDrawerOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white shadow-2xl lg:hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-lg font-black uppercase tracking-widest text-[#111111]">
                Filters
              </h3>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <FiltersContent />
            </div>
            <div className="px-5 pb-6 pt-3 border-t border-gray-100">
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="w-full py-3 bg-[#FFC702] text-[#111111] rounded-xl font-black uppercase tracking-widest text-sm hover:bg-yellow-500 transition-colors"
              >
                Show {sortedProducts.length} Result
                {sortedProducts.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Desktop Sidebar ──────────────────────────────────────────────── */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 sticky top-24">
          <h3 className="text-lg font-black uppercase tracking-widest text-[#111111] mb-6 border-b border-gray-100 pb-4">
            Filters
          </h3>
          <FiltersContent />
        </div>
      </aside>

      {/* ── Products Grid ────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <div className="text-6xl mb-6">🍪</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-4">
              No products found
            </h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <p className="hidden lg:block text-gray-500 mb-4 font-medium text-sm">
              Showing {sortedProducts.length} product
              {sortedProducts.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
              {sortedProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showCategory={!selectedCategory}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
