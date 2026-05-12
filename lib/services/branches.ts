import { apiClient } from '../axios';

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  latitude?: number | null;
  longitude?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchDto {
  name: string;
  address: string;
  phone: string;
  latitude?: number | null;
  longitude?: number | null;
  isActive?: boolean;
}

export interface UpdateBranchDto {
  name?: string;
  address?: string;
  phone?: string;
  latitude?: number | null;
  longitude?: number | null;
  isActive?: boolean;
}

export const branchesService = {
  // Public: active branches only
  getAll: (): Promise<Branch[]> => {
    return apiClient.get('/branches');
  },

  // Admin: all branches including inactive
  getAllAdmin: (): Promise<Branch[]> => {
    return apiClient.get('/branches', { params: { all: 'true' } });
  },

  getById: (id: number): Promise<Branch> => {
    return apiClient.get(`/branches/${id}`);
  },

  create: (data: CreateBranchDto): Promise<Branch> => {
    return apiClient.post('/branches', data);
  },

  update: (id: number, data: UpdateBranchDto): Promise<Branch> => {
    return apiClient.patch(`/branches/${id}`, data);
  },

  delete: (id: number): Promise<Branch> => {
    return apiClient.delete(`/branches/${id}`);
  },
};
