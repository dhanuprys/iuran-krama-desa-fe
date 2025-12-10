import type { Announcement } from '@/types/entity';
import type { PaginatedResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

export class KramaAnnouncementService {
  async getAnnouncements(page = 1) {
    const response = await apiClient.get<PaginatedResponse<Announcement>>(
      `/krama/announcements?page=${page}`,
    );
    return response.data;
  }
}

export default new KramaAnnouncementService();
