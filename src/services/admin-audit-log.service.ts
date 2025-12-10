import type { AuditLog } from '@/types/entity';
import type { HttpResponse, PaginatedResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

class AdminAuditLogService {
  async getLogs(params: { page: number; search?: string; action?: string; model_type?: string }) {
    const response = await apiClient.get<PaginatedResponse<AuditLog>>('/admin/audit-logs', {
      params,
    });
    return response.data;
  }

  async getLog(id: number) {
    const response = await apiClient.get<HttpResponse<AuditLog>>(`/admin/audit-logs/${id}`);
    return response.data;
  }
}

export default new AdminAuditLogService();
