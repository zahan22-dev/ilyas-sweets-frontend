import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_URL) {
  console.error(
    '[API] NEXT_PUBLIC_API_URL is not set in production. Falling back to localhost:3001/api may break live backend requests.',
  );
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available (only runs in browser)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Always return response data (even if null/undefined)
    return response.data;
  },
  (error) => {
    // Log detailed error for debugging
    if (error.response?.status === 401) {
      console.error(`[API] Unauthorized (${error.config?.url}) - Token may be missing or invalid`);
      console.error('[API] Token in localStorage:', !!localStorage.getItem('admin_token'));
    }
    
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);
