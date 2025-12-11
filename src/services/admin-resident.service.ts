import type { Resident } from '@/types/entity';
import type { HttpResponse } from '@/types/http';

import { apiClient } from '@/lib/api';
import { BaseService } from '@/services/base.service';

export { type Resident };

export class AdminResidentService extends BaseService<Resident> {
  protected endpoint = '/admin/residents';

  async validateResident(
    id: number,
    data: { status: 'APPROVED' | 'REJECTED'; rejection_reason?: string }
  ) {
    const response = await apiClient.post<HttpResponse<Resident>>(
      `${this.endpoint}/${id}/validate`,
      data
    );
    return response.data;
  }
}

export default new AdminResidentService();
