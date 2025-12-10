import type { Invoice } from '@/types/entity';
import type { HttpResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

export interface DashboardStats {
  total_unpaid_amount: number;
  total_paid_amount: number;
  recent_invoices: Invoice[];
}

export const kramaDashboardService = {
  getStats: async (resident_id: number): Promise<DashboardStats | null> => {
    const response = await apiClient.get<HttpResponse<DashboardStats>>('/krama/dashboard', {
      params: { resident_id },
    });
    return response.data.data;
  },
};

export default kramaDashboardService;
