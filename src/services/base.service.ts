import type { HttpResponse, PaginatedResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

export abstract class BaseService<T> {
  protected abstract endpoint: string;

  /**
   * Get paginated list of resources
   */
  async getAll(params?: any): Promise<PaginatedResponse<T>> {
    const response = await apiClient.get<PaginatedResponse<T>>(this.endpoint, {
      params,
    });
    return response.data;
  }

  /**
   * Get a single resource by ID
   */
  async getOne(id: number | string): Promise<HttpResponse<T>> {
    const response = await apiClient.get<HttpResponse<T>>(`${this.endpoint}/${id}`);
    return response.data;
  }

  /**
   * Create a new resource
   * Supports both JSON and FormData
   */
  async create(data: any): Promise<HttpResponse<T>> {
    const config =
      data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined;

    const response = await apiClient.post<HttpResponse<T>>(this.endpoint, data, config);
    return response.data;
  }

  /**
   * Update a resource
   * Handles FormData spoofing for Laravel (_method: PUT)
   */
  async update(id: number | string, data: any): Promise<HttpResponse<T>> {
    const payload = data;
    let config = undefined;

    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      config = { headers: { 'Content-Type': 'multipart/form-data' } };
    } else {
      const response = await apiClient.put<HttpResponse<T>>(`${this.endpoint}/${id}`, data);
      return response.data;
    }

    const response = await apiClient.post<HttpResponse<T>>(
      `${this.endpoint}/${id}`,
      payload,
      config,
    );
    return response.data;
  }

  /**
   * Delete a resource
   */
  async delete(id: number | string): Promise<HttpResponse<null>> {
    const response = await apiClient.delete<HttpResponse<null>>(`${this.endpoint}/${id}`);
    return response.data;
  }
}
