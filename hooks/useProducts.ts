import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  productsService, 
  adminProductsService,
  Product,
  CreateProductDto,
  UpdateProductDto,
  UpdateStockDto
} from '@/lib/services/products';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (categorySlug?: string) => [...productKeys.lists(), { categorySlug }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
  admin: () => [...productKeys.all, 'admin'] as const,
  adminDetail: (id: number) => [...productKeys.admin(), 'detail', id] as const,
};

// Public Hooks
export function useProducts(categorySlug?: string) {
  return useQuery({
    queryKey: productKeys.list(categorySlug),
    queryFn: () => productsService.getAll(categorySlug),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productsService.getBySlug(slug),
    enabled: !!slug,
  });
}

// Admin Hooks
export function useAdminProduct(id: number) {
  return useQuery({
    queryKey: productKeys.adminDetail(id),
    queryFn: () => adminProductsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) => adminProductsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductDto }) =>
      adminProductsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.details() });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminProductsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStockDto }) =>
      adminProductsService.updateStock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.details() });
    },
  });
}
