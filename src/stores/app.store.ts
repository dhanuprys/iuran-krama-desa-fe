import { create } from 'zustand';

import { Constants } from '@/config/constants';

import { apiClient } from '@/lib/api';

interface AppStore {
  frontendVersion: string;
  backendVersion: string | null;
  fetchBackendVersion: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set) => ({
  frontendVersion: Constants.APP_VERSION,
  backendVersion: null,
  fetchBackendVersion: async () => {
    try {
      const response = await apiClient.get<{ version: string }>('/meta');
      set({ backendVersion: response.data.version });
    } catch (error) {
      console.error('Failed to fetch backend version', error);
      set({ backendVersion: 'Unknown' });
    }
  },
}));
