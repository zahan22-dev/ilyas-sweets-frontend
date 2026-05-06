import { apiClient } from '../axios';
import { Product, ProductVariant } from './products';

export interface Cart {
  id: number;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  variantId?: number;
  quantity: number;
  customValue?: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
  variant?: ProductVariant;
}

export interface AddToCartDto {
  productId: number;
  variantId?: number;
  quantity: number;
  customValue?: number;
  userId?: string;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export const cartService = {
  create: (userId?: string): Promise<Cart> => {
    const params = userId ? { userId } : {};
    return apiClient.post('/cart', {}, { params });
  },

  get: (id: number): Promise<Cart> => {
    return apiClient.get(`/cart/${id}`);
  },

  addItem: (cartId: number, data: AddToCartDto): Promise<Cart> => {
    return apiClient.post(`/cart/${cartId}/add`, data);
  },

  updateItem: (itemId: number, data: UpdateCartItemDto): Promise<CartItem> => {
    return apiClient.put(`/cart/items/${itemId}`, data);
  },

  removeItem: (itemId: number): Promise<void> => {
    return apiClient.delete(`/cart/items/${itemId}`);
  },

  clear: (cartId: number): Promise<void> => {
    return apiClient.delete(`/cart/${cartId}/clear`);
  },
};
