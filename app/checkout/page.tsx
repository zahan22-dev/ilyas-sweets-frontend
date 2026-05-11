'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/providers/CartProvider';
import { PaymentInstructionsModal } from '@/components/payment/PaymentInstructionsModal';
import { apiClient } from '@/lib/axios';
import toast from 'react-hot-toast';
import type { FulfillmentType } from '@/lib/services/orders';
import { useBranches } from '@/hooks/useBranches';

const DELIVERY_FEE = 150; // Kept in sync with backend DELIVERY_FEE env var

type PaymentMethod = 'COD' | 'ONLINE_PAYMENT';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  area: string;
  notes: string;
  paymentMethod: PaymentMethod;
}

export default function Checkout() {
  const router = useRouter();
  const {
    cart,
    cartId,
    isLoading,
    getTotalPrice,
    clearCart,
    couponInfo,
    applyCoupon,
    removeCoupon,
  } = useCartContext();

  // ── Form State ──────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    area: '',
    notes: '',
    paymentMethod: 'COD',
  });
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('DELIVERY');
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

  // ── Submission Guards ────────────────────────────────────────────────────
  // useRef ensures the guard is synchronous — state updates are async
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Payment Modal State ──────────────────────────────────────────────────
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  // Stores the validated order payload so the modal can re-use it without
  // rebuilding form state — eliminates the race condition
  const pendingOrderData = useRef<object | null>(null);

  // ── Coupon State ─────────────────────────────────────────────────────────
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const { data: branches } = useBranches();

  // ── Derived Values ────────────────────────────────────────────────────────
  const cartItems = cart?.items || [];
  const subtotal = getTotalPrice();
  const discountAmount = couponInfo?.discountAmount || 0;
  const isDelivery = fulfillmentType === 'DELIVERY';
  const deliveryFee = isDelivery ? DELIVERY_FEE : 0;
  const totalBeforeDiscount = subtotal + deliveryFee;
  const total = Math.max(totalBeforeDiscount - discountAmount, 0);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    setCouponError('');
    setCouponLoading(true);
    try {
      await applyCoupon(couponCode.trim().toUpperCase());
      setCouponCode('');
    } catch (error: any) {
      setCouponError(error.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  /**
   * Validates the form and builds the order payload.
   * Returns the payload object on success, or null if validation fails.
   */
  const buildOrderPayload = useCallback((): object | null => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return null;
    }
    if (!formData.firstName.trim() || !formData.phone.trim()) {
      toast.error('First name and phone are required');
      return null;
    }
    if (isDelivery && (!formData.address.trim() || !formData.area.trim())) {
      toast.error('Please provide a delivery address and area');
      return null;
    }
    if (!isDelivery && !selectedBranchId) {
      toast.error('Please select a pickup branch');
      return null;
    }

    const notesWithEmail = formData.email.trim()
      ? [formData.notes, `Email: ${formData.email.trim()}`]
          .filter(Boolean)
          .join(' | ')
      : formData.notes || undefined;

    return {
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      phone: formData.phone.trim(),
      address: isDelivery
        ? `${formData.address.trim()}, ${formData.area.trim()}, Karachi`
        : undefined,
      notes: notesWithEmail,
      cartId: cartId ?? undefined,
      fulfillmentType,
      paymentMethod: formData.paymentMethod,
      branchId: !isDelivery ? selectedBranchId : undefined,
      couponCode: couponInfo?.couponCode ?? undefined,
      items: cartItems.map((item: any) => ({
        productId: item.product.id,
        variantId: item.variant?.id ?? undefined,
        quantity: item.quantity,
        customValue:
          item.customValue !== undefined && item.customValue !== null
            ? Number(item.customValue)
            : undefined,
      })),
    };
  }, [
    cartItems,
    formData,
    isDelivery,
    selectedBranchId,
    cartId,
    fulfillmentType,
    couponInfo,
  ]);

  /**
   * Core submission function — called with a pre-validated payload.
   * Idempotency guard (isSubmittingRef) prevents duplicate requests.
   */
  const submitOrder = useCallback(
    async (orderData: object) => {
      // Synchronous guard — prevents double-clicks and concurrent calls
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      setIsSubmitting(true);

      try {
        await apiClient.post('/orders', orderData);

        // Cart clear is fire-and-forget — don't block navigation on it
        clearCart().catch((err) =>
          console.error('Cart clear failed (non-critical):', err),
        );

        if (formData.paymentMethod === 'ONLINE_PAYMENT') {
          toast.success(
            'Order placed! Please send your payment screenshot on WhatsApp.',
            { duration: 6000 },
          );
        } else {
          toast.success('Order placed successfully! 🎉');
        }

        // Remove coupon from cart state after successful order
        removeCoupon();

        // Navigate after a brief delay so the toast is visible
        setTimeout(() => router.push('/shop'), 500);
      } catch (error: any) {
        // Axios interceptor wraps errors as `new Error(message)` — use error.message
        toast.error(error.message || 'Failed to place order. Please try again.');
      } finally {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        pendingOrderData.current = null;
      }
    },
    [clearCart, removeCoupon, router, formData.paymentMethod],
  );

  /**
   * Form submit handler — handles both COD and ONLINE_PAYMENT paths.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double-submission
    if (isSubmittingRef.current) return;
    // Prevent checkout while cart is still hydrating
    if (isLoading) return;

    const payload = buildOrderPayload();
    if (!payload) return;

    if (formData.paymentMethod === 'ONLINE_PAYMENT') {
      // Store payload so the modal confirm callback can submit without
      // rebuilding state — this eliminates the ONLINE_PAYMENT race condition
      pendingOrderData.current = payload;
      setIsPaymentModalOpen(true);
      return;
    }

    await submitOrder(payload);
  };

  const handleModalContinue = () => {
    setIsPaymentModalOpen(false);
    const stored = pendingOrderData.current;
    if (stored) {
      submitOrder(stored);
    }
  };

  const handleModalClose = () => {
    setIsPaymentModalOpen(false);
    pendingOrderData.current = null;
  };

  // ── Render Guards ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <main className="bg-[#FEFFFF] min-h-screen pt-40 pb-40 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#FFC702] rounded-full animate-spin" />
          <span className="font-medium">Loading your cart…</span>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <main className="bg-[#FEFFFF] min-h-screen pt-40 pb-40 flex flex-col items-center justify-center">
        <div className="text-6xl mb-6">🛒</div>
        <h3 className="text-2xl font-bold text-gray-600 mb-4">
          Your cart is empty
        </h3>
        <Link
          href="/shop"
          className="inline-block bg-[#FFC702] text-[#111111] px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#e6b300] transition-colors"
        >
          Back to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-[#FEFFFF] min-h-screen pt-20 sm:pt-32 lg:pt-40 pb-32 lg:pb-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mb-8 lg:mb-16">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-[#FFC702] transition-colors mb-4 uppercase tracking-widest text-xs sm:text-sm"
          >
            ← Back to Cart
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-heading text-[#111111] tracking-tighter leading-tight uppercase drop-shadow-sm">
            Secure{' '}
            <span className="text-[#FFC702] italic">Checkout.</span>
          </h1>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
          {/* ── Form Section ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-8">
              {/* Contact */}
              <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-black uppercase mb-4 lg:mb-6">
                  Contact
                </h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      required
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name *"
                      className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-[#FFC702] transition-colors"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-[#FFC702] transition-colors"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email (for confirmation)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-[#FFC702] transition-colors"
                  />
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone *"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-[#FFC702] transition-colors"
                  />
                </div>
              </div>

              {/* Order Type */}
              <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-black uppercase mb-4 lg:mb-6">
                  Order Type
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('DELIVERY')}
                    className={`p-4 border-2 rounded-xl text-left transition-all ${
                      isDelivery
                        ? 'border-[#FFC702] bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-bold text-[#111111] text-sm sm:text-base">
                      🚚 Delivery
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">
                      To your door · Rs.{DELIVERY_FEE} fee
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('PICKUP')}
                    className={`p-4 border-2 rounded-xl text-left transition-all ${
                      !isDelivery
                        ? 'border-[#FFC702] bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-bold text-[#111111] text-sm sm:text-base">
                      🏪 Pickup
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">
                      From store · No delivery fee
                    </div>
                  </button>
                </div>

                {!isDelivery && (
                  <div className="mt-4">
                    <select
                      required={!isDelivery}
                      value={selectedBranchId ?? ''}
                      onChange={(e) =>
                        setSelectedBranchId(
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-[#FFC702] transition-colors"
                    >
                      <option value="">Select Branch *</option>
                      {branches
                        ?.filter((b) => b.isActive)
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Address */}
              {isDelivery && (
                <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-black uppercase mb-4 lg:mb-6">
                    Delivery Address
                  </h2>
                  <div className="space-y-3">
                    <input
                      required
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street Address *"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-[#FFC702] transition-colors"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        defaultValue="Karachi"
                        readOnly
                        className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-500 cursor-not-allowed"
                      />
                      <input
                        required
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder="Area / Block *"
                        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-[#FFC702] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment */}
              <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-black uppercase mb-4 lg:mb-6">
                  Payment
                </h2>
                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.paymentMethod === 'COD'
                        ? 'border-[#FFC702] bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={() =>
                        setFormData((p) => ({ ...p, paymentMethod: 'COD' }))
                      }
                      className="accent-[#FFC702]"
                    />
                    <div>
                      <div className="font-bold text-sm sm:text-base">
                        💵 Cash on Delivery
                      </div>
                      <div className="text-xs text-gray-500">
                        Pay when you receive your order
                      </div>
                    </div>
                  </label>
                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.paymentMethod === 'ONLINE_PAYMENT'
                        ? 'border-[#FFC702] bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'ONLINE_PAYMENT'}
                      onChange={() =>
                        setFormData((p) => ({
                          ...p,
                          paymentMethod: 'ONLINE_PAYMENT',
                        }))
                      }
                      className="accent-[#FFC702]"
                    />
                    <div>
                      <div className="font-bold text-sm sm:text-base">
                        🏦 Bank Transfer
                      </div>
                      <div className="text-xs text-gray-500">
                        Send screenshot via WhatsApp after ordering
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
                placeholder="Special instructions (optional)"
                className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:border-[#FFC702] transition-colors resize-none"
              />

              {/* Payment Modal */}
              <PaymentInstructionsModal
                isOpen={isPaymentModalOpen}
                onClose={handleModalClose}
                onContinue={handleModalContinue}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-4 lg:py-6 bg-[#FFC702] text-[#111111] rounded-full font-black uppercase tracking-widest text-sm sm:text-base hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 sticky bottom-4 sm:relative sm:bottom-auto"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
                    Placing Order…
                  </span>
                ) : isDelivery ? (
                  'Place Order'
                ) : (
                  'Confirm Pickup Order'
                )}
              </button>
            </form>
          </div>

          {/* ── Order Summary ─────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-[#111111] text-white rounded-2xl p-4 sm:p-6 lg:p-8 sticky top-20 lg:top-32">
              <h2 className="text-xl sm:text-2xl font-black uppercase mb-4 lg:mb-6">
                Summary
              </h2>

              {/* Items */}
              <div className="space-y-2 mb-4 max-h-48 sm:max-h-64 overflow-y-auto">
                {cartItems.map((item: any) => {
                  const price =
                    item.variant?.price != null
                      ? Number(item.variant.price)
                      : item.product.basePrice
                      ? Number(item.product.basePrice) *
                        Number(item.customValue ?? 1)
                      : 0;
                  return (
                    <div
                      key={item.id}
                      className="flex justify-between text-gray-200 text-xs sm:text-sm"
                    >
                      <span className="line-clamp-1">
                        {item.product.name}
                        {item.variant?.label ? ` (${item.variant.label})` : ''}
                        {' '}×{item.quantity}
                      </span>
                      <span className="flex-shrink-0 ml-2">
                        Rs.{Math.round(price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Coupon */}
              <div className="mb-4 p-3 bg-white/10 rounded-xl border border-white/20">
                {couponInfo ? (
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-green-300 font-bold text-sm">
                        🎟️ {couponInfo.couponCode}
                      </span>
                      <p className="text-green-400 text-xs mt-0.5">
                        -Rs.{Math.round(discountAmount)} saved
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-red-400 hover:text-red-300 font-bold text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyCoupon();
                          }
                        }}
                        placeholder="Coupon code"
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 outline-none focus:border-[#FFC702] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="px-3 py-2 bg-[#FFC702] text-[#111111] rounded-lg font-bold text-sm hover:bg-yellow-500 disabled:opacity-50 transition-colors"
                      >
                        {couponLoading ? '…' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-400 text-xs mt-1">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm font-bold border-t border-white/20 pt-4">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>Rs.{Math.round(subtotal)}</span>
                </div>
                {isDelivery && (
                  <div className="flex justify-between text-gray-300">
                    <span>Delivery</span>
                    <span>Rs.{deliveryFee}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-Rs.{Math.round(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl sm:text-2xl font-black pt-3 border-t border-white/20 text-[#FFC702]">
                  <span>Total</span>
                  <span>Rs.{Math.round(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
