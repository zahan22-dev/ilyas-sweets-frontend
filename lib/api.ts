const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Generic API call handler
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '{"message": "Request failed"}');
      const error = JSON.parse(errorText);
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const text = await response.text();
    return (text ? JSON.parse(text) : null) as T;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// Categories API
export const categoriesApi = {
  getAll: () => apiCall<any[]>('/categories'),
  getBySlug: (slug: string) => apiCall<any>(`/categories/${slug}`),
};

// Products API
export const productsApi = {
  getAll: (categorySlug?: string) => {
    const query = categorySlug ? `?category=${categorySlug}` : '';
    return apiCall<any[]>(`/products${query}`);
  },
  getBySlug: (slug: string) => apiCall<any>(`/products/${slug}`),
};

// Cart API
export const cartApi = {
  create: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiCall<any>(`/cart${query}`, { method: 'POST' });
  },
  get: (id: number) => apiCall<any>(`/cart/${id}`),
  addItem: (cartId: number, data: { productId: number; variantId: number; quantity: number }) =>
    apiCall<any>(`/cart/${cartId}/add`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateItem: (itemId: number, quantity: number) =>
    apiCall<any>(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  removeItem: (itemId: number) =>
    apiCall<any>(`/cart/items/${itemId}`, { method: 'DELETE' }),
  clear: (cartId: number) =>
    apiCall<any>(`/cart/${cartId}/clear`, { method: 'DELETE' }),
};

// Orders API
export const ordersApi = {
  create: (data: {
    customerName: string;
    phone: string;
    address: string;
    items: Array<{ productId: number; variantId: number; quantity: number }>;
    cartId?: number;
  }) =>
    apiCall<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAll: (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return apiCall<any[]>(`/orders${query}`);
  },
  getById: (id: number) => apiCall<any>(`/orders/${id}`),
  updateStatus: (id: number, status: string) =>
    apiCall<any>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Admin Products API
export const adminProductsApi = {
  create: (data: {
    name: string;
    slug?: string;
    description?: string;
    ingredients?: string;
    categoryId: number;
    images: string[];
    variants: Array<{ weight: string; price: number; stock: number }>;
  }) =>
    apiCall<any>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<{
    name: string;
    description: string;
    ingredients: string;
    categoryId: number;
    images: string[];
  }>) =>
    apiCall<any>(`/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall<any>(`/admin/products/${id}`, { method: 'DELETE' }),
  updateStock: (id: number, variantId: number, stock: number) =>
    apiCall<any>(`/admin/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ variantId, stock }),
    }),
};

// Admin Categories API
export const adminCategoriesApi = {
  create: (data: { name: string; slug?: string; image?: string }) =>
    apiCall<any>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: { name?: string; image?: string }) =>
    apiCall<any>(`/admin/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiCall<any>(`/admin/categories/${id}`, { method: 'DELETE' }),
};

// Admin Orders API
export const adminOrdersApi = {
  getAll: (status?: string) => ordersApi.getAll(status),
  getById: (id: number) => ordersApi.getById(id),
  updateStatus: (id: number, status: string) => ordersApi.updateStatus(id, status),
};

// Upload API
export const uploadApi = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  },
};
