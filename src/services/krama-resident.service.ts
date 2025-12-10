import type { Resident, ResidentContext } from '@/types/entity';
import type { PaginatedResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

export class ResidentService {
  async getResidents(page = 1) {
    // Based on backend routes, /krama/residents calls ResidentController::index
    const response = await apiClient.get<PaginatedResponse<Resident>>(
      `/krama/residents?page=${page}`,
    );
    return response.data;
  }

  async getContextResidents() {
    const response = await apiClient.get<{ data: ResidentContext[] }>('/krama/residents/context');
    return response.data.data;
  }

  async getResidentById(id: number | string) {
    const response = await apiClient.get<{ data: Resident }>(`/krama/residents/${id}`);
    return response.data;
  }

  async createResident(data: FormData) {
    const response = await apiClient.post<{ data: Resident }>('/krama/residents', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateResident(id: number | string, data: FormData) {
    // Laravel method spoofing for PUT with FormData
    data.append('_method', 'PUT');
    const response = await apiClient.post<{ data: Resident }>(`/krama/residents/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getBanjars() {
    const response = await apiClient.get<{ data: { id: number; name: string }[] }>(
      '/krama/banjars',
    );
    return response.data.data;
  }
}

export default new ResidentService();
