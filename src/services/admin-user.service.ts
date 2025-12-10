import type { User } from '@/types/entity';
import type { HttpResponse, PaginatedResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

export class AdminUserService {
  async getUsers(params?: any) {
    const response = await apiClient.get<PaginatedResponse<User>>('/admin/users', { params });
    return response.data;
  }

  async getUser(id: number) {
    const response = await apiClient.get<HttpResponse<User>>(`/admin/users/${id}`);
    return response.data;
  }

  async createUser(data: any) {
    const response = await apiClient.post<HttpResponse<User>>('/admin/users', data);
    return response.data;
  }

  async updateUser(id: number, data: any) {
    data._method = 'PUT'; // If needed for Laravel PUT spoofing, though here we use put directly usually or post with spoofing.
    // Actually standard Laravel resource update uses PUT/PATCH. AdminResidentService used POST with _method.
    // Let's stick to standard methods first, if issues arise we fallback to spoofing.
    // Checking AdminResidentService again in memory... it used POST with _method=PUT likely due to FormData (file upload). with JSON we use PUT.
    const response = await apiClient.put<HttpResponse<User>>(`/admin/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: number) {
    const response = await apiClient.delete<HttpResponse<null>>(`/admin/users/${id}`);
    return response.data;
  }
}

export default new AdminUserService();
