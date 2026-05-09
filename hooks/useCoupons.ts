import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { couponsService, Coupon, CreateCouponDto, UpdateCouponDto, ApplyCouponResponse } from '@/lib/services/coupons';

export const couponKeys = {
  all: ['coupons'] as const,
  admin: () => [...couponKeys.all, 'admin'] as const,
  detail: (id: number) => [...couponKeys.all, 'detail', id] as const,
};

/** Used by admin dashboard — returns all coupons */
export function useCoupons() {
  return useQuery({
    queryKey: couponKeys.admin(),
    queryFn: () => couponsService.getAll(),
  });
}

/** Alias — same as useCoupons, kept for backwards compat */
export function useAdminCoupons() {
  return useCoupons();
}

export function useAdminCoupon(id: number) {
  return useQuery({
    queryKey: couponKeys.detail(id),
    queryFn: () => couponsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCouponDto) => couponsService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: couponKeys.admin() }),
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCouponDto }) =>
      couponsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: couponKeys.admin() });
      queryClient.invalidateQueries({ queryKey: couponKeys.detail(variables.id) });
    },
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => couponsService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: couponKeys.admin() }),
  });
}

export function useApplyCoupon() {
  return useMutation<ApplyCouponResponse, Error, { cartId: number; code: string }>({
    mutationFn: ({ cartId, code }) => couponsService.validate(cartId, code),
  });
}