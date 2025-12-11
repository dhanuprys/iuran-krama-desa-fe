import { AxiosError } from 'axios';

import { Constants } from '@/config/constants';

import type { HttpResponse } from '@/types/http';

import { apiClient } from '@/lib/api';

type LoginResponse = HttpResponse<{ token: string }>;

export interface LoginFeedback {
  success: boolean;
  errorDetails: Record<string, string[]> | null;
}

export class AuthService {
  async login(email: string, password: string): Promise<LoginFeedback> {
    try {
      const response = await apiClient.post<LoginResponse>('/login', {
        email,
        password,
      });

      if (!response.data.success) {
        return {
          success: false,
          errorDetails: response.data.error?.details || null,
        };
      }

      localStorage.setItem(Constants.LS_KEYS.AUTH_TOKEN, response.data.data!.token);

      return {
        success: true,
        errorDetails: null,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: false,
          errorDetails: error.response?.data.error?.details || null,
        };
      }

      return {
        success: false,
        errorDetails: null,
      };
    }
  }

  async register(data: any): Promise<LoginFeedback> {
    try {
      const response = await apiClient.post<LoginResponse>('/register', data);

      if (!response.data.success) {
        return {
          success: false,
          errorDetails: response.data.error?.details || null,
        };
      }

      localStorage.setItem(Constants.LS_KEYS.AUTH_TOKEN, response.data.data!.token);

      return {
        success: true,
        errorDetails: null,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: false,
          errorDetails: error.response?.data.error?.details || null,
        };
      }
      return {
        success: false,
        errorDetails: null,
      };
    }
  }

  async getProfile() {
    const response = await apiClient.get<HttpResponse<any>>('/profile');
    return response.data;
  }

  async updateProfile(data: any): Promise<LoginFeedback> {
    try {
      const response = await apiClient.put<HttpResponse<any>>('/profile', data);
      return {
        success: response.data.success,
        errorDetails: response.data.error?.details || null,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: false,
          errorDetails: error.response?.data.error?.details || null,
        };
      }
      return {
        success: false,
        errorDetails: null,
      };
    }
  }

  async changePassword(data: any): Promise<LoginFeedback> {
    try {
      const response = await apiClient.put<HttpResponse<any>>('/change-password', data);
      return {
        success: response.data.success,
        errorDetails: response.data.error?.details || null,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: false,
          errorDetails: error.response?.data.error?.details || null,
        };
      }
      return {
        success: false,
        errorDetails: null,
      };
    }
  }

  async logout() {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem(Constants.LS_KEYS.AUTH_TOKEN);
    }
  }
}

export default new AuthService();
