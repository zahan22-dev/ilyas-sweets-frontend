import { apiClient } from '../axios';
import { Product } from './products';

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  schema?: any;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}

export interface CreateCategoryDto {
  name: string;
  slug?: string;
  image?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  schema?: any;
}

export interface UpdateCategoryDto {
  name?: string;
  image?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  schema?: any;
}

// Public API
export const categoriesService = {
  getAll: (): Promise<Category[]> => {
    return apiClient.get('/categories');
  },

  getBySlug: (slug: string): Promise<CategoryWithProducts> => {
    return apiClient.get(`/categories/${slug}`);
  },
};

// Admin API
export const adminCategoriesService = {
  create: (data: CreateCategoryDto): Promise<Category> => {
    return apiClient.post('/admin/categories', data);
  },

  getById: (id: number): Promise<Category> => {
    return apiClient.get(`/admin/categories/${id}`);
  },

  update: (id: number, data: UpdateCategoryDto): Promise<Category> => {
    return apiClient.patch(`/admin/categories/${id}`, data);
  },

  delete: (id: number): Promise<void> => {
    return apiClient.delete(`/admin/categories/${id}`);
  },
};
