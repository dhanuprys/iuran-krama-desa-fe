import type { Family } from '@/types/entity';
import type { PaginationMeta } from '@/types/http';
import type { HttpResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

export class AdminFamilyService {
  async getFamilies(params?: any): Promise<HttpResponse<Family[]> & { meta: PaginationMeta }> {
    const response = await apiClient.get('/admin/families', { params });
    return response.data;
  }

  async getFamily(id: string): Promise<HttpResponse<Family>> {
    const response = await apiClient.get(`/admin/families/${id}`);
    return response.data;
  }
}

export default new AdminFamilyService();
