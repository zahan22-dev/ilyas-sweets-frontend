import { apiClient } from '../axios';

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isFeatured: boolean;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  ingredients?: string;
  categoryId: number;
  productType: 'WEIGHT' | 'PIECES';
  allowCustomInput: boolean;
  basePrice?: number;
  metaTitle?: string;
  metaDescription?: string;
  schema?: any;
  stock: number;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
    slug: string;
    products?: any[];
  };
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  productId: number;
  label: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  slug?: string;
  description?: string;
  ingredients?: string;
  categoryId: number;
  productType?: 'WEIGHT' | 'PIECES';
  allowCustomInput?: boolean;
  basePrice?: number;
  metaTitle?: string;
  metaDescription?: string;
  schema?: any;
  stock: number;
  images: { url: string; isFeatured: boolean }[];
  variants: {
    label: string;
    price: number;
  }[];
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  ingredients?: string;
  categoryId?: number;
  productType?: 'WEIGHT' | 'PIECES';
  allowCustomInput?: boolean;
  basePrice?: number;
  metaTitle?: string;
  metaDescription?: string;
  schema?: any;
  stock?: number;
  images?: { url: string; isFeatured: boolean }[];
  variants?: {
    id?: number;
    label: string;
    price: number;
  }[];
}

export interface UpdateStockDto {
  stock: number;
}

// Public API
export const productsService = {
  getAll: (categorySlug?: string): Promise<Product[]> => {
    const params = categorySlug ? { category: categorySlug } : {};
    return apiClient.get('/products', { params });
  },

  getBySlug: (slug: string): Promise<Product> => {
    return apiClient.get(`/products/${slug}`);
  },
};

// Admin API
export const adminProductsService = {
  create: (data: CreateProductDto): Promise<Product> => {
    return apiClient.post('/admin/products', data);
  },

  getById: (id: number): Promise<Product> => {
    return apiClient.get(`/admin/products/${id}`);
  },

  update: (id: number, data: UpdateProductDto): Promise<Product> => {
    return apiClient.patch(`/admin/products/${id}`, data);
  },

  delete: (id: number): Promise<void> => {
    return apiClient.delete(`/admin/products/${id}`);
  },

  updateStock: (id: number, data: UpdateStockDto): Promise<Product> => {
    return apiClient.patch(`/admin/products/${id}/stock`, data);
  },
};
