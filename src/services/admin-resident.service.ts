import type { Resident } from '@/types/entity';
import type { HttpResponse, PaginatedResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

export { type Resident };

export class AdminResidentService {
  async getResidents(params?: any) {
    const response = await apiClient.get<PaginatedResponse<Resident>>('/admin/residents', {
      params,
    });
    return response.data;
  }

  async getResident(id: number) {
    const response = await apiClient.get<HttpResponse<Resident>>(`/admin/residents/${id}`);
    return response.data;
  }

  async createResident(data: FormData) {
    const response = await apiClient.post<HttpResponse<Resident>>('/admin/residents', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateResident(id: number, data: FormData) {
    data.append('_method', 'PUT'); // Spoofing for Laravel
    const response = await apiClient.post<HttpResponse<Resident>>(`/admin/residents/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteResident(id: number) {
    const response = await apiClient.delete<HttpResponse<null>>(`/admin/residents/${id}`);
    return response.data;
  }

  async validateResident(
    id: number,
    data: { status: 'APPROVED' | 'REJECTED'; rejection_reason?: string },
  ) {
    const response = await apiClient.post<HttpResponse<Resident>>(
      `/admin/residents/${id}/validate`,
      data,
    );
    return response.data;
  }
}

export default new AdminResidentService();
