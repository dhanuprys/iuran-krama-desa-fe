import type { Invoice } from '@/types/entity';
import type { HttpResponse, PaginatedResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

export interface InvoiceFormData {
  resident_id: number;
  invoice_date: string;
  peturunan_amount: number;
  dedosan_amount: number;
  iuran_amount?: number;
}

export class OperatorInvoiceService {
  async getInvoices(params?: any) {
    const response = await apiClient.get<PaginatedResponse<Invoice>>('/operator/invoices', {
      params,
    });
    return response.data;
  }

  async getInvoice(id: number) {
    const response = await apiClient.get<HttpResponse<Invoice>>(`/operator/invoices/${id}`);
    return response.data;
  }

  async createInvoice(data: InvoiceFormData) {
    const response = await apiClient.post<HttpResponse<Invoice>>('/operator/invoices', data);
    return response.data;
  }

  async updateInvoice(id: number, data: Partial<InvoiceFormData>) {
    const response = await apiClient.put<HttpResponse<Invoice>>(`/operator/invoices/${id}`, data);
    return response.data;
  }

  async downloadInvoice(id: number) {
    const response = await apiClient.get(`/operator/invoices/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

export default new OperatorInvoiceService();
