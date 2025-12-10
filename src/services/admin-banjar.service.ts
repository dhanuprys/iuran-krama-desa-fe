import type { HttpResponse, PaginatedResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

export interface Banjar {
  id: number;
  name: string;
  address: string;
  residents_count?: number;
  created_at: string;
  updated_at: string;
}

export interface BanjarFormData {
  name: string;
  address: string;
}

export class AdminBanjarService {
  async getBanjars(params?: any) {
    const response = await apiClient.get<PaginatedResponse<Banjar>>('/admin/banjars', { params });
    return response.data;
  }

  async getBanjar(id: number) {
    const response = await apiClient.get<HttpResponse<Banjar>>(`/admin/banjars/${id}`);
    return response.data;
  }

  async createBanjar(data: BanjarFormData) {
    const response = await apiClient.post<HttpResponse<Banjar>>('/admin/banjars', data);
    return response.data;
  }

  async updateBanjar(id: number, data: BanjarFormData) {
    const response = await apiClient.put<HttpResponse<Banjar>>(`/admin/banjars/${id}`, data);
    return response.data;
  }

  async deleteBanjar(id: number) {
    const response = await apiClient.delete<HttpResponse<null>>(`/admin/banjars/${id}`);
    return response.data;
  }
}

export default new AdminBanjarService();
