'use client';

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/providers/CartProvider";
import { PaymentInstructionsModal } from "@/components/payment/PaymentInstructionsModal";
import { apiClient } from "@/lib/axios";
import toast from "react-hot-toast";
import type { FulfillmentType } from "@/lib/services/orders";
import { useBranches } from "@/hooks/useBranches";

export default function Checkout() {
  const router = useRouter();
  const { cart, cartId, isLoading, getTotalPrice, clearCart } = useCartContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('DELIVERY');
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const { data: branches } = useBranches();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    area: '',
    notes: '',
    paymentMethod: 'COD' as 'COD' | 'ONLINE_PAYMENT',
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const paymentModalConfirmed = useRef(false);

  const cartItems = cart?.items || [];
  const subtotal = getTotalPrice();
  const deliveryFee = fulfillmentType === 'DELIVERY' ? 150 : 0;
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;
  const isDelivery = fulfillmentType === 'DELIVERY';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Validate based on fulfillment type
    if (!formData.firstName || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isDelivery && (!formData.address || !formData.area)) {
      toast.error("Please provide delivery address");
      return;
    }

    if (!isDelivery && !selectedBranchId) {
      toast.error("Please select a pickup branch");
      return;
    }

    // If Online Payment selected, show payment instructions first
    if (formData.paymentMethod === "ONLINE_PAYMENT" && !paymentModalConfirmed.current) {
      setIsPaymentModalOpen(true);
      return;
    }
    
    // Reset the confirmation flag for next time
    paymentModalConfirmed.current = false;

    setIsSubmitting(true);
    try {
      const orderData = {
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        address: isDelivery ? `${formData.address}, ${formData.area}, Karachi` : undefined,
        notes: formData.email
          ? `${formData.notes ? formData.notes + ' | ' : ''}Email: ${formData.email}`
          : formData.notes || undefined,
        cartId: cartId || undefined,
        fulfillmentType,
        paymentMethod: formData.paymentMethod,
        branchId: !isDelivery ? selectedBranchId : undefined,
        items: cartItems.map((item: any) => ({
          productId: item.product.id,
          variantId: item.variant?.id || undefined,
          quantity: item.quantity,
          customValue: item.customValue ?? undefined,
        })),
      };

      await apiClient.post('/orders', orderData);
      
      if (formData.paymentMethod === "ONLINE_PAYMENT") {
        toast.success("Order placed! Please send payment screenshot on WhatsApp.", { duration: 6000 });
      } else {
        toast.success("Order placed successfully!");
      }
      
      await clearCart();
      router.push('/shop');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="bg-[#FEFFFF] min-h-screen pt-40 pb-40 flex items-center justify-center">
        <div className="text-gray-500">Loading checkout...</div>
      </main>
    );
  }

  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <main className="bg-[#FEFFFF] min-h-screen pt-40 pb-40 flex flex-col items-center justify-center">
        <div className="text-6xl mb-6">🛒</div>
        <h3 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h3>
        <Link
          href="/shop"
          className="inline-block bg-[#FFC702] text-[#111111] px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#e6b300]"
        >
          Back to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-[#FEFFFF] min-h-screen pt-40 pb-40">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <Link href="/cart" className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-[#FFC702] transition-colors mb-6 uppercase tracking-widest text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Cart
          </Link>
          <h1 className="text-6xl md:text-7xl lg:text-[6rem] font-black font-heading text-[#111111] tracking-tighter leading-[0.85] uppercase drop-shadow-sm">
            Secure <br/><span className="text-[#FFC702] italic pr-4">Checkout.</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          {/* Checkout Form */}
          <div className="w-full lg:w-[60%]">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Contact Info */}
              <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-2 border-gray-50">
                <h3 className="text-2xl font-black font-heading uppercase tracking-tighter mb-8 text-[#111111]">Contact Information</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-500">First Name *</label>
                      <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300" placeholder="Ali" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-500">Last Name</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300" placeholder="Khan" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-gray-500">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300" placeholder="ali@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-gray-500">Phone Number *</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300" placeholder="0300 1234567" />
                  </div>
                </div>
              </div>

              {/* Fulfillment Method Selection */}
              <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-2 border-gray-50">
                <h3 className="text-2xl font-black font-heading uppercase tracking-tighter mb-8 text-[#111111]">Order Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('DELIVERY')}
                    className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
                      isDelivery
                        ? 'border-[#FFC702] bg-[#FFC702]/5'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isDelivery ? 'border-[#FFC702]' : 'border-gray-300'
                    }`}>
                      {isDelivery && <div className="w-3 h-3 rounded-full bg-[#FFC702]" />}
                    </div>
                    <div className="flex-1 text-left">
                      <span className="block font-black uppercase text-[#111111]">Delivery</span>
                      <span className="text-sm text-gray-500">We&apos;ll deliver to your doorstep</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isDelivery ? 'text-[#FFC702]' : 'text-gray-400'}>
                      <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/>
                      <path d="M14 9h4l4 4v5"/>
                      <circle cx="7" cy="18" r="2"/>
                      <circle cx="17" cy="18" r="2"/>
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentType('PICKUP')}
                    className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
                      !isDelivery
                        ? 'border-[#FFC702] bg-[#FFC702]/5'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      !isDelivery ? 'border-[#FFC702]' : 'border-gray-300'
                    }`}>
                      {!isDelivery && <div className="w-3 h-3 rounded-full bg-[#FFC702]" />}
                    </div>
                    <div className="flex-1 text-left">
                      <span className="block font-black uppercase text-[#111111]">Pickup</span>
                      <span className="text-sm text-gray-500">Pick up from our store</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={!isDelivery ? 'text-[#FFC702]' : 'text-gray-400'}>
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </button>
                </div>

                {/* Pickup Branch Selector */}
                {!isDelivery && (
                  <div className="mt-6 space-y-4">
                    {/* Branch Dropdown */}
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-500">Select Pickup Branch *</label>
                      <select
                        required={!isDelivery}
                        value={selectedBranchId ?? ''}
                        onChange={(e) => setSelectedBranchId(e.target.value ? Number(e.target.value) : null)}
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300"
                      >
                        <option value="">-- Select a Branch --</option>
                        {branches?.filter(b => b.isActive).map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name} — {branch.address}
                          </option>
                        ))}
                      </select>
                      {!branches?.length && (
                        <p className="text-sm text-gray-400">Loading branches...</p>
                      )}
                    </div>
                    {/* Pickup Info */}
                    <div className="p-4 bg-blue-50 border-2 border-blue-100 rounded-2xl">
                      <div className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mt-0.5">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 16v-4"/>
                          <path d="M12 8h.01"/>
                        </svg>
                        <div>
                          <p className="font-bold text-blue-900">Pickup from store after confirmation</p>
                          <p className="text-sm text-blue-700 mt-1">You&apos;ll receive a notification when your order is ready.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Delivery Info - Only show for delivery */}
              {isDelivery && (
                <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-2 border-gray-50">
                  <h3 className="text-2xl font-black font-heading uppercase tracking-tighter mb-8 text-[#111111]">Delivery Details</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-500">Street Address *</label>
                      <input required={isDelivery} type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300" placeholder="House/Apartment, Street Name" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-gray-500">City</label>
                        <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300" defaultValue="Karachi" readOnly />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-gray-500">Area / Block *</label>
                        <input required={isDelivery} type="text" name="area" value={formData.area} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300" placeholder="e.g. DHA Phase 5" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Notes - Show for both */}
              <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-2 border-gray-50">
                <h3 className="text-2xl font-black font-heading uppercase tracking-tighter mb-8 text-[#111111]">Additional Information</h3>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-widest text-gray-500">Order Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-lg text-[#111111] outline-none focus:border-[#FFC702] focus:bg-white transition-all duration-300 resize-none"
                    placeholder={isDelivery ? "Any special instructions, delivery preferences, etc." : "Any special instructions for your order"}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border-2 border-gray-50">
                <h3 className="text-2xl font-black font-heading uppercase tracking-tighter mb-8 text-[#111111]">Payment</h3>
                <div className="space-y-4">
                  {/* Cash on Delivery */}
                  <label 
                    className={`flex items-center justify-between p-6 border-2 rounded-2xl cursor-pointer transition-colors ${
                      formData.paymentMethod === "COD" 
                        ? "border-[#FFC702] bg-[#FFC702]/5" 
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                    onClick={() => setFormData({ ...formData, paymentMethod: "COD" })}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-4 ${
                        formData.paymentMethod === "COD" ? "border-[#FFC702] bg-white" : "border-gray-300"
                      }`}>
                        {formData.paymentMethod === "COD" && (
                          <div className="w-full h-full rounded-full bg-[#FFC702] scale-50" />
                        )}
                      </div>
                      <span className="text-lg font-black uppercase text-[#111111]">Cash on Delivery</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={formData.paymentMethod === "COD" ? "text-[#FFC702]" : "text-gray-300"}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                  </label>

                  {/* Online Payment */}
                  <label 
                    className={`flex items-center justify-between p-6 border-2 rounded-2xl cursor-pointer transition-colors ${
                      formData.paymentMethod === "ONLINE_PAYMENT" 
                        ? "border-[#FFC702] bg-[#FFC702]/5" 
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                    onClick={() => setFormData({ ...formData, paymentMethod: "ONLINE_PAYMENT" })}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-4 ${
                        formData.paymentMethod === "ONLINE_PAYMENT" ? "border-[#FFC702] bg-white" : "border-gray-300"
                      }`}>
                        {formData.paymentMethod === "ONLINE_PAYMENT" && (
                          <div className="w-full h-full rounded-full bg-[#FFC702] scale-50" />
                        )}
                      </div>
                      <span className="text-lg font-black uppercase text-[#111111]">Online Payment (Bank Transfer)</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={formData.paymentMethod === "ONLINE_PAYMENT" ? "text-[#FFC702]" : "text-gray-300"}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                  </label>
                </div>

                {/* Online Payment Note */}
                {formData.paymentMethod === "ONLINE_PAYMENT" && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mt-0.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-blue-900">Bank Transfer Required</p>
                        <p className="text-sm text-blue-700 mt-1">You&apos;ll see payment instructions after clicking the order button.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Instructions Modal */}
              <PaymentInstructionsModal
                isOpen={isPaymentModalOpen}
                onClose={() => {
                  setIsPaymentModalOpen(false);
                  paymentModalConfirmed.current = false;
                }}
                onContinue={() => {
                  paymentModalConfirmed.current = true;
                  setIsPaymentModalOpen(false);
                  // Submit the form after user confirms
                  handleSubmit({ preventDefault: () => {} } as React.FormEvent);
                }}
              />
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-6 rounded-full font-black uppercase tracking-[0.15em] transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group/btn bg-linear-to-r from-[#FFC702] to-[#701515] text-white shadow-[0_15px_30px_rgba(225,3,105,0.3)] hover:shadow-[0_20px_40px_rgba(225,3,105,0.5)] hover:scale-[1.02] disabled:opacity-70"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out"></span>
                <span className="relative z-10 flex items-center gap-2 text-[17px]">
                  {isSubmitting ? "Processing..." : isDelivery ? "Place Delivery Order" : "Place Pickup Order"}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-2 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[40%]">
            <div className="bg-[#111111] rounded-[3rem] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.2)] text-white sticky top-40 overflow-hidden z-10">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#FFC702] rounded-full blur-[80px] opacity-20 -z-10"></div>
              
              <h3 className="text-3xl font-black font-heading uppercase tracking-tighter mb-8 border-b-2 border-white/10 pb-6">Your Order</h3>
              
              <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item: any) => {
                  const itemPrice = item.variant?.price || (item.product.basePrice ? item.product.basePrice * (item.customValue || 1) : 0);
                  const itemLabel = item.variant?.label || `Custom: ${item.customValue} ${item.product.productType === 'WEIGHT' ? 'kg' : 'pieces'}`;
                  
                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-lg leading-tight mb-1">{item.product.name}</h4>
                        <span className="text-sm font-bold text-gray-400">Qty: {item.quantity} | {itemLabel}</span>
                      </div>
                      <span className="font-black text-[#FFC702]">Rs. {itemPrice * item.quantity}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="space-y-4 text-lg font-bold mb-10 border-t-2 border-white/10 pt-8">
                <div className="flex justify-between items-center text-white/80">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>
                {isDelivery && (
                  <div className="flex justify-between items-center text-white/80">
                    <span>Delivery</span>
                    <span>Rs. {deliveryFee}</span>
                  </div>
                )}
                <div className="pt-6 border-t-2 border-white/10 flex justify-between items-center">
                  <span className="text-2xl uppercase tracking-widest">Total</span>
                  <span className="text-4xl font-black text-[#FFC702]">Rs. {total}</span>
                </div>
              </div>
              
              <p className="text-center text-gray-400 text-sm font-bold flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Your data is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
