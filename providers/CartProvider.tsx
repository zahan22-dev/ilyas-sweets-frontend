"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCreateCart, useCart, useAddToCart, useUpdateCartItem, useRemoveCartItem, useClearCart, useApplyCartCoupon } from '@/hooks/useCart';
import { Cart, CartItem, AddToCartDto, UpdateCartItemDto, CartCouponResponse } from '@/lib/services/cart';

interface CartContextType {
  cart: Cart | null;
  cartId: number | null;
  isLoading: boolean;
  error: string | null;
  couponInfo: CartCouponResponse | null;

  // Actions
  addToCart: (params: { productId: number; variantId?: number; quantity?: number; customValue?: number }) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getFinalTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [couponInfo, setCouponInfo] = useState<CartCouponResponse | null>(null);

  // Load cart ID and coupon from localStorage on mount
  useEffect(() => {
    const savedCartId = localStorage.getItem('cartId');
    const savedCoupon = localStorage.getItem('cartCoupon');
    if (savedCartId) {
      setCartId(parseInt(savedCartId));
    }
    if (savedCoupon) {
      try {
        setCouponInfo(JSON.parse(savedCoupon));
      } catch {
        // Invalid stored coupon, ignore
      }
    }
  }, []);

  // Save cart ID to localStorage when it changes
  useEffect(() => {
    if (cartId) {
      localStorage.setItem('cartId', cartId.toString());
    }
  }, [cartId]);

  const { data: cart, isLoading } = useCart(cartId || 0);
  const createCart = useCreateCart();
  const addToCartMutation = useAddToCart();
  const updateItemMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();
  const applyCouponMutation = useApplyCartCoupon();

  const ensureCartExists = async (): Promise<number> => {
    if (cartId) return cartId;

    try {
      const newCart = await createCart.mutateAsync();
      if (!newCart || !newCart.id) {
        throw new Error('Failed to create cart - invalid response');
      }
      setCartId(newCart.id);
      return newCart.id;
    } catch (err: any) {
      const message = err?.message || 'Failed to create cart';
      setError(message);
      throw err;
    }
  };

  const addToCart = async ({ productId, variantId, quantity = 1, customValue }: { productId: number; variantId?: number; quantity?: number; customValue?: number }) => {
    try {
      setError(null);
      const currentCartId = await ensureCartExists();

      await addToCartMutation.mutateAsync({
        cartId: currentCartId,
        data: { productId, variantId, quantity, customValue }
      });
    } catch (err) {
      setError('Failed to add item to cart');
      throw err;
    }
  };

  const updateItem = async (itemId: number, quantity: number) => {
    try {
      setError(null);
      await updateItemMutation.mutateAsync({
        itemId,
        data: { quantity }
      });
    } catch (err) {
      setError('Failed to update item');
      throw err;
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      setError(null);
      await removeItemMutation.mutateAsync(itemId);
    } catch (err) {
      setError('Failed to remove item');
      throw err;
    }
  };

  const clearCart = async () => {
    if (!cartId) return;

    try {
      setError(null);
      await clearCartMutation.mutateAsync(cartId);
      removeCoupon();
    } catch (err) {
      setError('Failed to clear cart');
      throw err;
    }
  };

  const getTotalItems = (): number => {
    return cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const getTotalPrice = (): number => {
    return cart?.items?.reduce((total, item) => {
      const itemPrice = item.variant?.price || (item.product.basePrice ? item.product.basePrice * (item.customValue || 1) : 0);
      return total + (itemPrice * item.quantity);
    }, 0) || 0;
  };

  const getFinalTotal = (): number => {
    const subtotal = getTotalPrice();
    if (couponInfo) {
      return Math.max(subtotal - couponInfo.discountAmount, 0);
    }
    return subtotal;
  };

  const applyCoupon = async (code: string) => {
    if (!cartId) {
      setError('Cart not initialized');
      throw new Error('Cart not initialized');
    }

    try {
      setError(null);
      const result = await applyCouponMutation.mutateAsync({ cartId, code });
      setCouponInfo(result);
      localStorage.setItem('cartCoupon', JSON.stringify(result));
    } catch (err: any) {
      const message = err?.message || 'Failed to apply coupon';
      setError(message);
      throw err;
    }
  };

  const removeCoupon = () => {
    setCouponInfo(null);
    localStorage.removeItem('cartCoupon');
  };

  const value: CartContextType = {
    cart: cart || null,
    cartId,
    isLoading,
    error,
    couponInfo,
    addToCart,
    updateItem,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    getTotalItems,
    getTotalPrice,
    getFinalTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}