import { apiClient } from '@/lib/api';

export interface ResidentStatus {
  id: number;
  name: string;
  contribution_amount: number;
}

export const residentStatusService = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/resident-statuses');
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || { message: 'Failed to fetch resident statuses' },
      };
    }
  },
};
