import type { Resident } from '@/types/entity';
import type { HttpResponse } from '@/types/http';

import { BaseService } from '@/services/base.service';

import { apiClient } from '@/lib/api';

export { type Resident };

export class AdminResidentService extends BaseService<Resident> {
  protected endpoint = '/admin/residents';

  async validateResident(
    id: number,
    data: { status: 'APPROVED' | 'REJECTED'; rejection_reason?: string },
  ) {
    const response = await apiClient.post<HttpResponse<Resident>>(
      `${this.endpoint}/${id}/validate`,
      data,
    );
    return response.data;
  }
}

export default new AdminResidentService();
