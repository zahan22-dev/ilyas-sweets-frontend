"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartContext } from "@/providers/CartProvider";

export default function Cart() {
  const {
    cart,
    isLoading,
    updateItem,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice
  } = useCartContext();

  if (isLoading) {
    return (
      <main className="bg-[#FEFFFF] min-h-screen pt-28 md:pt-40 pb-24 md:pb-40 flex items-center justify-center">
        <div className="text-gray-500 text-lg font-semibold">
          Loading cart...
        </div>
      </main>
    );
  }

  const cartItems = cart?.items || [];
  const subtotal = getTotalPrice();
  const deliveryFee = 150;
  const total = subtotal + deliveryFee;

  return (
    <main className="bg-[#FEFFFF] min-h-screen pt-28 md:pt-40 pb-24 md:pb-40 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Heading */}
        <div className="mb-10 md:mb-16">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[7rem] font-black font-heading text-[#111111] tracking-tighter leading-[0.9] uppercase drop-shadow-sm">
            Your <br />
            <span className="text-[#FFC702] italic pr-2 md:pr-4">
              Basket.
            </span>
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🛒</div>

            <h3 className="text-2xl font-bold text-gray-600 mb-4">
              Your cart is empty
            </h3>

            <p className="text-gray-500 mb-8">
              Add some delicious sweets to get started!
            </p>

            <Link
              href="/shop"
              className="inline-block bg-[#FFC702] text-[#111111] px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#e6b300] transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* LEFT SIDE */}
            <div className="w-full lg:w-[65%]">
              
              {/* Table Head */}
              <div className="hidden md:grid grid-cols-12 gap-6 pb-6 border-b-4 border-gray-100 text-gray-400 font-black uppercase tracking-widest text-sm">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              {/* Cart Items */}
              <div className="space-y-6 md:space-y-8">
                {cartItems.map((item) => {
                  const itemPrice =
                    item.variant?.price ||
                    (item.product.basePrice
                      ? item.product.basePrice * (item.customValue || 1)
                      : 0);

                  const itemLabel =
                    item.variant?.label ||
                    `Custom: ${item.customValue} ${
                      item.product.productType === "WEIGHT"
                        ? "kg"
                        : "pieces"
                    }`;

                  return (
                    <div
                      key={item.id}
                      className="border-b border-gray-100 pb-6 md:pb-8"
                    >
                      
                      {/* MOBILE CARD */}
                      <div className="flex flex-col sm:flex-row gap-5 md:grid md:grid-cols-12 md:items-center md:gap-6 group">
                        
                        {/* Product */}
                        <div className="md:col-span-6 flex items-center gap-4 sm:gap-5">
                          
                          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-3xl md:rounded-full overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.1)] border-4 border-white shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500">
                            {item.product.images?.[0]?.imageUrl ? (
                              <Image
                                src={item.product.images[0].imageUrl}
                                alt={item.product.name}
                                fill
                                sizes="(max-width:768px) 100vw, 33vw"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400 text-2xl">
                                📦
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col min-w-0">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-black font-heading text-[#111111] uppercase tracking-tight leading-tight group-hover:text-[#FFC702] transition-colors break-words">
                              {item.product.name}
                            </h3>

                            <span className="text-sm sm:text-base font-bold text-gray-400 uppercase tracking-wide mt-1">
                              {itemLabel}
                            </span>

                            {/* Mobile Price */}
                            <span className="md:hidden text-xl font-black text-[#111111] mt-2">
                              Rs. {itemPrice * item.quantity}
                            </span>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-[#701515] text-xs sm:text-sm font-black uppercase tracking-widest text-left hover:text-[#FFC702] mt-3 flex items-center gap-1 w-fit"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              </svg>

                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="md:col-span-3 flex md:justify-center">
                          <div className="flex items-center bg-gray-100 rounded-full p-1.5 border-2 border-gray-200">
                            
                            <button
                              onClick={() =>
                                updateItem(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#111111] text-lg font-black hover:text-[#FFC702] transition-colors shadow-sm"
                            >
                              -
                            </button>

                            <span className="w-12 text-center font-black text-lg md:text-xl text-[#111111]">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateItem(item.id, item.quantity + 1)
                              }
                              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#111111] text-lg font-black hover:text-[#FFC702] transition-colors shadow-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Desktop Total */}
                        <div className="hidden md:block md:col-span-3 text-right">
                          <span className="text-2xl lg:text-3xl font-black text-[#111111]">
                            Rs. {itemPrice * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Buttons */}
              <div className="pt-8 flex flex-col sm:flex-row gap-4 sm:gap-5 sm:justify-between sm:items-center">
                
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center sm:justify-start gap-2 text-[#FFC702] font-black uppercase tracking-widest hover:text-[#111111] transition-colors text-sm sm:text-base"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>

                  Continue Shopping
                </Link>

                <button
                  onClick={clearCart}
                  className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors font-bold text-sm sm:text-base"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-[35%]">
              <div className="bg-[#111111] rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.2)] text-white sticky top-28 overflow-hidden z-10">
                
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#FFC702] rounded-full blur-[80px] opacity-20 -z-10"></div>

                <h3 className="text-2xl md:text-3xl font-black font-heading uppercase tracking-tighter mb-8 border-b-2 border-white/10 pb-5">
                  Order Summary
                </h3>

                <div className="space-y-5 text-base md:text-lg font-bold mb-8">
                  
                  <div className="flex justify-between items-center text-white/80 gap-4">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span className="text-right">Rs. {subtotal}</span>
                  </div>

                  <div className="flex justify-between items-center text-white/80 gap-4">
                    <span>Delivery</span>
                    <span className="text-right">Rs. {deliveryFee}</span>
                  </div>

                  <div className="flex justify-between items-center text-[#FFC702] gap-4">
                    <span>Discount</span>
                    <span className="text-right">- Rs. 0</span>
                  </div>

                  <div className="pt-5 border-t-2 border-white/10 flex justify-between items-center gap-4">
                    <span className="text-lg md:text-2xl uppercase tracking-widest">
                      Total
                    </span>

                    <span className="text-3xl md:text-4xl font-black text-[#FFC702] text-right break-words">
                      Rs. {total}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full min-h-[64px] px-5 py-5 rounded-full font-black uppercase tracking-[0.12em] transition-all duration-500 flex items-center justify-between gap-3 relative overflow-hidden group/btn bg-gradient-to-r from-[#FFC702] to-[#FF8A00] text-[#111111] shadow-[0_15px_30px_rgba(255,199,2,0.3)] hover:shadow-[0_20px_40px_rgba(255,199,2,0.5)] hover:scale-[1.02]"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out"></span>

                  <span className="relative z-10 text-sm sm:text-base md:text-lg leading-tight text-left">
                    Proceed to Checkout
                  </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="relative z-10 shrink-0 group-hover/btn:translate-x-1 transition-transform"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}