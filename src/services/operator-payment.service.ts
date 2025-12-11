import type { Payment } from '@/types/entity';
import type { HttpResponse, PaginatedResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

export class OperatorPaymentService {
  async getPayments(params?: any) {
    const response = await apiClient.get<PaginatedResponse<Payment>>('/operator/payments', {
      params,
    });
    return response.data;
  }

  async getPayment(id: number) {
    const response = await apiClient.get<HttpResponse<Payment>>(`/operator/payments/${id}`);
    return response.data;
  }

  async createPayment(data: any) {
    const response = await apiClient.post<HttpResponse<Payment>>('/operator/payments', data);
    return response.data;
  }

  async updatePayment(id: number, data: any) {
    const response = await apiClient.put<HttpResponse<Payment>>(`/operator/payments/${id}`, data);
    return response.data;
  }

  async downloadReceipt(id: number) {
    const response = await apiClient.get<Blob>(`/operator/payments/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

export default new OperatorPaymentService();
