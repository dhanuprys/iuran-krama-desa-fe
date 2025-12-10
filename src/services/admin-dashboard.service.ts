import type { HttpResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

export interface DashboardStats {
  total_residents: number;
  total_families: number;
  pending_residents: number;
  total_users: number;
  total_invoices: number;
  invoice_summary: {
    total_amount: number; // This might come as string from some DB drivers but usually castable
    total_paid: number;
    total_unpaid: number;
  };
}

export class AdminDashboardService {
  async getStats() {
    // ApiResponse returns { success: boolean, data: T, ... }
    // The controller returns $this->success($stats); which wraps stats in 'data'
    const response = await apiClient.get<HttpResponse<DashboardStats>>('/admin/dashboard');
    return response.data;
  }
}

export default new AdminDashboardService();
