import type { HttpResponse, PaginatedResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export type AnnouncementFormData = {
  title: string;
  content: string;
  is_active: boolean;
};

export class AdminAnnouncementService {
  async getAnnouncements(params?: any) {
    const response = await apiClient.get<PaginatedResponse<Announcement>>('/admin/announcements', {
      params,
    });
    return response.data;
  }

  async getAnnouncement(id: number) {
    const response = await apiClient.get<HttpResponse<Announcement>>(`/admin/announcements/${id}`);
    return response.data;
  }

  async createAnnouncement(data: AnnouncementFormData) {
    const response = await apiClient.post<HttpResponse<Announcement>>('/admin/announcements', data);
    return response.data;
  }

  async updateAnnouncement(id: number, data: AnnouncementFormData) {
    const response = await apiClient.put<HttpResponse<Announcement>>(
      `/admin/announcements/${id}`,
      data,
    );
    return response.data;
  }

  async deleteAnnouncement(id: number) {
    const response = await apiClient.delete<HttpResponse<null>>(`/admin/announcements/${id}`);
    return response.data;
  }
}

export default new AdminAnnouncementService();
