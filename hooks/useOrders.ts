import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ordersService,
  adminOrdersService,
  CreateOrderDto,
  OrderStatus,
} from '@/lib/services/orders';

// Query Keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (status?: OrderStatus) => [...orderKeys.lists(), { status }] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
};

// Public Hooks
export function useOrders(status?: OrderStatus) {
  return useQuery({
    queryKey: orderKeys.list(status),
    queryFn: () => ordersService.getAll(status),
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersService.getById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderDto) => ordersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

// Admin Hooks
export function useAdminOrders(status?: OrderStatus) {
  return useQuery({
    queryKey: orderKeys.list(status),
    queryFn: () => adminOrdersService.getAll(status),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      adminOrdersService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
    },
  });
}
