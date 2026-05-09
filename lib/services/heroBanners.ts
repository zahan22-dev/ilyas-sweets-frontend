import { apiClient } from '../axios';

export interface HeroBanner {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;  // ← add this line
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHeroBannerDto {
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateHeroBannerDto extends Partial<CreateHeroBannerDto> {}

export const heroBannersService = {
  getAll: (): Promise<HeroBanner[]> => apiClient.get('/hero-banners'),
  getAdminList: (): Promise<HeroBanner[]> => apiClient.get('/admin/hero-banners'),
  getById: (id: number): Promise<HeroBanner> => apiClient.get(`/admin/hero-banners/${id}`),
  create: (data: CreateHeroBannerDto): Promise<HeroBanner> => apiClient.post('/admin/hero-banners', data),
  update: (id: number, data: UpdateHeroBannerDto): Promise<HeroBanner> => apiClient.patch(`/admin/hero-banners/${id}`, data),
  delete: (id: number): Promise<void> => apiClient.delete(`/admin/hero-banners/${id}`),
};
