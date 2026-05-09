import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  cartService,
  AddToCartDto,
  UpdateCartItemDto,
} from '@/lib/services/cart';

// Query Keys
export const cartKeys = {
  all: ['cart'] as const,
  details: () => [...cartKeys.all, 'detail'] as const,
  detail: (id: number) => [...cartKeys.details(), id] as const,
};

// Hooks
export function useCart(id: number) {
  return useQuery({
    queryKey: cartKeys.detail(id),
    queryFn: () => cartService.get(id),
    enabled: !!id,
  });
}

export function useCreateCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId?: string | void) => cartService.create(userId ? userId : undefined),
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, data }: { cartId: number; data: AddToCartDto }) =>
      cartService.addItem(cartId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail(variables.cartId) });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: number; data: UpdateCartItemDto }) =>
      cartService.updateItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.details() });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => cartService.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.details() });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartId: number) => cartService.clear(cartId),
    onSuccess: (_, cartId) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail(cartId) });
    },
  });
}

export function useApplyCartCoupon() {
  return useMutation({
    mutationFn: ({ cartId, code }: { cartId: number; code: string }) => cartService.applyCoupon(cartId, code),
  });
}
