import { apiClient } from '../axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  admin: {
    id: number;
    email: string;
    name: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // The axios response interceptor already returns response.data directly
    return apiClient.post('/auth/login', credentials) as Promise<AuthResponse>;
  },

  async register(registerData: RegisterData): Promise<{ id: number; email: string; name: string }> {
    return apiClient.post('/auth/register', registerData) as Promise<{ id: number; email: string; name: string }>;
  },

  setToken(token: string) {
    localStorage.setItem('admin_token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  getToken(): string | null {
    return localStorage.getItem('admin_token');
  },

  removeToken() {
    localStorage.removeItem('admin_token');
    delete apiClient.defaults.headers.common['Authorization'];
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  initializeAuth() {
    const token = this.getToken();
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },
};
