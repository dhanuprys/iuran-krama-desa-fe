import type { Payment } from '@/types/entity';
import type { HttpResponse, PaginatedResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

export class AdminPaymentService {
  async getPayments(params?: any) {
    const response = await apiClient.get<PaginatedResponse<Payment>>('/admin/payments', { params });
    return response.data;
  }

  async getPayment(id: number) {
    const response = await apiClient.get<HttpResponse<Payment>>(`/admin/payments/${id}`);
    return response.data;
  }

  async createPayment(data: any) {
    const response = await apiClient.post<HttpResponse<Payment>>('/admin/payments', data);
    return response.data;
  }

  async updatePayment(id: number, data: any) {
    // Laravel requires spoofing for PUT if sending as POST (though for regular JSON PUT works fine)
    // Usually JSON update uses PUT directly. using PUT here.
    const response = await apiClient.put<HttpResponse<Payment>>(`/admin/payments/${id}`, data);
    return response.data;
  }

  async deletePayment(id: number) {
    const response = await apiClient.delete<HttpResponse<null>>(`/admin/payments/${id}`);
    return response.data;
  }

  async downloadReceipt(id: number) {
    const response = await apiClient.get<Blob>(`/admin/payments/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

export default new AdminPaymentService();
