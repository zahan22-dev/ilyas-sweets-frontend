import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { heroBannersService, HeroBanner, CreateHeroBannerDto, UpdateHeroBannerDto } from '@/lib/services/heroBanners';

export const heroBannerKeys = {
  all: ['heroBanners'] as const,
  list: () => [...heroBannerKeys.all, 'list'] as const,
  detail: (id: number) => [...heroBannerKeys.all, 'detail', id] as const,
};

/** Public — fetches only active banners for the homepage slider */
export function usePublicHeroBanners() {
  return useQuery({
    queryKey: heroBannerKeys.list(),
    queryFn: () => heroBannersService.getAll(),
  });
}

/** Alias kept so existing imports don't break */
export function useHeroBanners() {
  return usePublicHeroBanners();
}

/** Admin — fetches ALL banners (active + inactive) */
export function useAdminHeroBanners() {
  return useQuery({
    queryKey: [...heroBannerKeys.list(), 'admin'],
    queryFn: () => heroBannersService.getAdminList(),
  });
}

export function useAdminHeroBanner(id: number) {
  return useQuery({
    queryKey: heroBannerKeys.detail(id),
    queryFn: () => heroBannersService.getById(id),
    enabled: !!id,
  });
}

export function useCreateHeroBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateHeroBannerDto) => heroBannersService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: heroBannerKeys.list() }),
  });
}

export function useUpdateHeroBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateHeroBannerDto }) =>
      heroBannersService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: heroBannerKeys.list() });
      queryClient.invalidateQueries({ queryKey: heroBannerKeys.detail(variables.id) });
    },
  });
}

export function useDeleteHeroBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => heroBannersService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: heroBannerKeys.list() }),
  });
}