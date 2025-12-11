import type { HttpResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

export interface ResidentStatus {
  id: number;
  name: string;
  contribution_amount: number;
  created_at?: string;
  updated_at?: string;
}

export class ResidentStatusService {
  async getAll() {
    const response = await apiClient.get<HttpResponse<ResidentStatus[]>>(
      '/admin/resident-statuses',
    );
    return response.data;
  }

  async getById(id: number) {
    const response = await apiClient.get<HttpResponse<ResidentStatus>>(
      `/admin/resident-statuses/${id}`,
    );
    return response.data;
  }

  async create(data: Partial<ResidentStatus>) {
    const response = await apiClient.post<HttpResponse<ResidentStatus>>(
      '/admin/resident-statuses',
      data,
    );
    return response.data;
  }

  async update(id: number, data: Partial<ResidentStatus>) {
    const response = await apiClient.put<HttpResponse<ResidentStatus>>(
      `/admin/resident-statuses/${id}`,
      data,
    );
    return response.data;
  }

  async delete(id: number) {
    const response = await apiClient.delete<HttpResponse<void>>(`/admin/resident-statuses/${id}`);
    return response.data;
  }
}

export default new ResidentStatusService();
