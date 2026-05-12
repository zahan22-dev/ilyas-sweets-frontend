"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartContext } from "@/providers/CartProvider";
import { productsService, Product } from "@/lib/services/products";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFloatingCart, setShowFloatingCart] = useState(false);
  const { getTotalItems } = useCartContext();

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchProducts = async () => {
      setIsSearching(true);
      try {
        const results = await productsService.search(searchQuery.trim());
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        setShowFloatingCart(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Delivery Availability Stripe */}
      <div className="bg-[#111111] overflow-hidden whitespace-nowrap py-2.5 relative border-b border-gray-800">
        <div className="animate-marquee inline-block text-[#FFC702] font-black uppercase tracking-[0.2em] text-xs md:text-sm">
          <span className="mx-4">Delivery Timing: 9:00 AM to 11:59 PM</span>
          <span className="mx-4 text-white">•</span>
          <span className="mx-4">Delivery Timing: 9:00 AM to 11:59 PM</span>
          <span className="mx-4 text-white">•</span>
          <span className="mx-4">Delivery Timing: 9:00 AM to 11:59 PM</span>
          <span className="mx-4 text-white">•</span>
          <span className="mx-4">Delivery Timing: 9:00 AM to 11:59 PM</span>
          <span className="mx-4 text-white">•</span>
          <span className="mx-4">Delivery Timing: 9:00 AM to 11:59 PM</span>
          <span className="mx-4 text-white">•</span>
          <span className="mx-4">Delivery Timing: 9:00 AM to 11:59 PM</span>
        </div>
        <div className="animate-marquee inline-block text-[#FFC702] font-black uppercase tracking-[0.2em] text-xs md:text-sm absolute top-2.5">
          <span className="mx-4">Delivery Timing: 9:00 AM to 11:59 PM</span>
          <span className="mx-4 text-white">•</span>
          <span className="mx-4">Delivery Timing: 9:00 AM to 11:59 PM</span>
          <span className="mx-4 text-white">•</span>
          <span className="mx-4">Delivery Timing: 9:00 AM to 11:59 PM</span>
          <span className="mx-4 text-white">•</span>
          <span className="mx-4">Delivery Timing: 9:00 AM to 11:59 PM</span>
          <span className="mx-4 text-white">•</span>
          <span className="mx-4">Delivery Timing: 9:00 AM to 11:59 PM</span>
          <span className="mx-4 text-white">•</span>
          <span className="mx-4">Delivery Timing: 9:00 AM to 11:59 PM</span>
        </div>
      </div>

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
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-[#111111] hover:text-[#FFC702] transition-all duration-300 group cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:scale-110 transition-transform duration-300 md:w-6 md:h-6"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

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

    {/* Search Modal */}
    {isSearchOpen && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 md:pt-32">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 md:mx-8 relative">
          {/* Close Button */}
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery("");
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18"/>
              <path d="M6 6l12 12"/>
            </svg>
          </button>

          {/* Search Input */}
          <div className="p-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xl md:text-2xl font-medium placeholder-gray-400 border-0 border-b-2 border-gray-200 focus:border-[#FFC702] focus:ring-0 pb-4 pr-12 outline-none"
                autoFocus
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute right-0 top-4 text-gray-400"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className="mt-8 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFC702]"></div>
                    <span className="ml-3 text-gray-500">Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 font-medium">
                      Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.slice(0, 6).map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0].imageUrl}
                                alt={product.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No image</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#FFC702] transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">
                              {product.category?.name}
                            </p>
                            <p className="text-sm font-medium text-[#FFC702]">
                              Rs. {product.basePrice || (product.variants && product.variants.length > 0 ? Math.min(...product.variants.map(v => v.price)) : 'N/A')}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {searchResults.length > 6 && (
                      <div className="text-center pt-4">
                        <Link
                          href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="inline-flex items-center gap-2 text-[#FFC702] hover:text-[#111111] font-semibold transition-colors"
                        >
                          View all {searchResults.length} results
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"/>
                            <path d="m12 5 7 7-7 7"/>
                          </svg>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No products found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {/* Floating Cart Icon */}
    <div className={`fixed bottom-23 md:bottom-30 right-6 z-50 transition-all duration-300 ${showFloatingCart ? "opacity-100 visible" : "opacity-0 invisible"}`}>
      <Link
        href="/cart"
        className="bg-[#111111] text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="8" cy="21" r="1"/>
          <circle cx="19" cy="21" r="1"/>
          <path d="m2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
        {getTotalItems() > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
            {getTotalItems()}
          </span>
        )}
      </Link>
    </div>

    </>
  );
}
