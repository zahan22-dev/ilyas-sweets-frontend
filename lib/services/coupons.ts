import { apiClient } from '../axios';

export interface Coupon {
  id: number;
  code: string;
  name?: string;
  description?: string;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
  startsAt?: string;
  endsAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponDto {
  code: string;
  name?: string;
  description?: string;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  active?: boolean;
  startsAt?: string;
  endsAt?: string;
}

export interface UpdateCouponDto extends Partial<CreateCouponDto> {}

export interface ApplyCouponResponse {
  couponCode: string;
  discountAmount: number;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  subtotal: number;
  totalAfterDiscount: number;
  startsAt?: string;
  endsAt?: string;
}

export const couponsService = {
  getAll: (): Promise<Coupon[]> => apiClient.get('/admin/coupons'),
  getById: (id: number): Promise<Coupon> => apiClient.get(`/admin/coupons/${id}`),
  create: (data: CreateCouponDto): Promise<Coupon> => apiClient.post('/admin/coupons', data),
  update: (id: number, data: UpdateCouponDto): Promise<Coupon> => apiClient.patch(`/admin/coupons/${id}`, data),
  delete: (id: number): Promise<void> => apiClient.delete(`/admin/coupons/${id}`),
  validate: (cartId: number, code: string): Promise<ApplyCouponResponse> =>
    apiClient.post(`/cart/${cartId}/apply-coupon`, { code }),
};
