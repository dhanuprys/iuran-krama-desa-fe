import type { Invoice } from '@/types/entity';
import type { HttpResponse, PaginatedResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

export class KramaInvoiceService {
  async getInvoices(residentId: number, page = 1) {
    const response = await apiClient.get<PaginatedResponse<Invoice>>(`/krama/invoices`, {
      params: {
        resident_id: residentId,
        page,
      },
    });
    return response.data;
  }

  async getInvoiceById(id: string | number) {
    const response = await apiClient.get<HttpResponse<Invoice>>(`/krama/invoices/${id}`);
    return response;
  }

  async downloadInvoice(id: number) {
    const response = await apiClient.get(`/krama/invoices/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

export default new KramaInvoiceService();
