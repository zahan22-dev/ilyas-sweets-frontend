"use client";

import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { productsService, Product } from "@/lib/services/products";
import ProductCard from "./ProductCard";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ShopProductsProps {
  categories: Category[];
  searchQuery?: string;
}

export default function ShopProducts({ categories, searchQuery }: ShopProductsProps) {
  const { data: products, isLoading } = useProducts();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Handle search
  useEffect(() => {
    if (searchQuery) {
      const performSearch = async () => {
        setIsSearching(true);
        try {
          const results = await productsService.search(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Search failed:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      };
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Use search results if searching, otherwise use all products
  const allProducts = searchQuery ? searchResults : products;
  const isLoadingProducts = searchQuery ? isSearching : isLoading;

  // Filter and sort products
  const filteredProducts = allProducts?.filter((product: any) => {
    if (!selectedCategory) return true;
    return product.category?.slug === selectedCategory;
  }) || [];

  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    switch (sortBy) {
      case "price-low":
        return (a.basePrice || 0) - (b.basePrice || 0);
      case "price-high":
        return (b.basePrice || 0) - (a.basePrice || 0);
      case "newest":
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      default:
        return 0;
    }
  });

  if (isLoadingProducts) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 sticky top-24">
          <h3 className="text-lg font-black uppercase tracking-widest text-[#111111] mb-6 border-b border-gray-100 pb-4">
            Filters
          </h3>
          
          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-black uppercase text-[#111111] mb-3">Categories</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`flex items-center gap-2 w-full text-left font-medium transition-colors ${
                    selectedCategory === "" ? "text-[#FFC702]" : "text-gray-600 hover:text-[#FFC702]"
                  }`}
                >
                  <span className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    selectedCategory === "" ? "bg-[#FFC702] border-[#FFC702]" : "border-gray-300"
                  }`}>
                    {selectedCategory === "" && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  All Items
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`flex items-center gap-2 w-full text-left font-medium transition-colors ${
                      selectedCategory === cat.slug ? "text-[#FFC702]" : "text-gray-600 hover:text-[#FFC702]"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      selectedCategory === cat.slug ? "bg-[#FFC702] border-[#FFC702]" : "border-gray-300"
                    }`}>
                      {selectedCategory === cat.slug && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
            <h4 className="text-sm font-black uppercase text-[#111111] mb-3">Sort By</h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-[#111111] font-medium rounded-lg px-3 py-2 outline-none focus:border-[#FFC702] transition-colors"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Products Grid */}
      <div className="flex-1">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <div className="text-6xl mb-6">🍪</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-4">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-4 font-medium">
              Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {sortedProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} showCategory />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
