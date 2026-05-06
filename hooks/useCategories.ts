import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  categoriesService,
  adminCategoriesService,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/lib/services/categories';

// Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: () => [...categoryKeys.lists()] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (slug: string) => [...categoryKeys.details(), slug] as const,
  admin: () => [...categoryKeys.all, 'admin'] as const,
  adminDetail: (id: number) => [...categoryKeys.admin(), 'detail', id] as const,
};

// Public Hooks
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => categoriesService.getAll(),
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => categoriesService.getBySlug(slug),
    enabled: !!slug,
  });
}

// Admin Hooks
export function useAdminCategory(id: number) {
  return useQuery({
    queryKey: categoryKeys.adminDetail(id),
    queryFn: () => adminCategoriesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => adminCategoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryDto }) =>
      adminCategoriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.details() });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminCategoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}
