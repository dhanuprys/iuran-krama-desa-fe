import type { Invoice } from '@/types/entity';
import type { HttpResponse, PaginatedResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

export interface InvoiceFormData {
  resident_id: number;
  invoice_date: string;
  peturunan_amount: number;
  dedosan_amount: number;
  iuran_amount?: number; // Optional as it might be auto-calculated or pre-filled
}

export class AdminInvoiceService {
  async getInvoices(params?: any) {
    const response = await apiClient.get<PaginatedResponse<Invoice>>('/admin/invoices', { params });
    return response.data;
  }

  async getInvoice(id: number) {
    const response = await apiClient.get<HttpResponse<Invoice>>(`/admin/invoices/${id}`);
    return response.data;
  }

  async createInvoice(data: InvoiceFormData) {
    const response = await apiClient.post<HttpResponse<Invoice>>('/admin/invoices', data);
    return response.data;
  }

  async updateInvoice(id: number, data: Partial<InvoiceFormData>) {
    const response = await apiClient.put<HttpResponse<Invoice>>(`/admin/invoices/${id}`, data);
    return response.data;
  }

  async deleteInvoice(id: number) {
    const response = await apiClient.delete<HttpResponse<null>>(`/admin/invoices/${id}`);
    return response.data;
  }

  async previewBulk(data: {
    invoice_date: string;
    peturunan_amount?: number;
    dedosan_amount?: number;
  }) {
    const response = await apiClient.post<HttpResponse<any>>('/admin/invoices/bulk-preview', data);
    return response.data;
  }

  async createBulk(data: { invoice_date: string; items: any[] }) {
    const response = await apiClient.post<HttpResponse<any>>('/admin/invoices/bulk-store', data);
    return response.data;
  }

  async downloadInvoice(id: number) {
    const response = await apiClient.get(`/admin/invoices/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

export default new AdminInvoiceService();
