import axios from 'axios';

import { Constants } from '@/config/constants';
import { SecureStorage } from '@/lib/secure-storage';

export const apiClient = axios.create({
  baseURL: Constants.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = SecureStorage.getItem(Constants.LS_KEYS.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
