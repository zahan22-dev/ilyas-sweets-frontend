import { apiClient } from '../axios';
import { Product, ProductVariant } from './products';

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PROCESSING' 
  | 'SHIPPED' 
  | 'DELIVERED' 
  | 'CANCELLED';

export type FulfillmentType = 'DELIVERY' | 'PICKUP';

export type PaymentMethod = 'COD' | 'ONLINE_PAYMENT';

export type PaymentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface Order {
  id: number;
  customerName: string;
  phone: string;
  address?: string;
  notes?: string;
  userLat?: number;
  userLng?: number;
  totalAmount: number;
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  branchId?: number;
  branch?: {
    id: number;
    name: string;
    address: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  variantId: number;
  quantity: number;
  price: number;
  customValue?: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
  variant: ProductVariant;
}

export interface CreateOrderDto {
  customerName: string;
  phone: string;
  address?: string;
  notes?: string;
  items: {
    productId: number;
    variantId?: number;
    quantity: number;
    customValue?: number;
  }[];
  cartId?: number;
  fulfillmentType?: FulfillmentType;
  paymentMethod?: PaymentMethod;
  branchId?: number;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

// Public API
export const ordersService = {
  create: (data: CreateOrderDto): Promise<Order> => {
    return apiClient.post('/orders', data);
  },

  getAll: (status?: OrderStatus): Promise<Order[]> => {
    const params = status ? { status } : {};
    return apiClient.get('/orders', { params });
  },

  getById: (id: number): Promise<Order> => {
    return apiClient.get(`/orders/${id}`);
  },

  updateStatus: (id: number, data: UpdateOrderStatusDto): Promise<Order> => {
    return apiClient.put(`/orders/${id}/status`, data);
  },
};

// Admin API
export const adminOrdersService = {
  getAll: (status?: OrderStatus): Promise<Order[]> => {
    return ordersService.getAll(status);
  },

  getById: (id: number): Promise<Order> => {
    return ordersService.getById(id);
  },

  updateStatus: (id: number, status: OrderStatus): Promise<Order> => {
    return ordersService.updateStatus(id, { status });
  },
};
