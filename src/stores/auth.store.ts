import { create } from 'zustand';

import { Constants } from '@/config/constants';

import type { AuthenticatedUser } from '@/types/entity';

import AuthService from '@/services/auth.service';

import { apiClient } from '@/lib/api';

interface AuthStore {
  user: AuthenticatedUser | null;
  error: string | null;
  loading: boolean;
  updateAuth: (user: AuthenticatedUser | null, error: string | null, loading: boolean) => void;
  setUser: (user: AuthenticatedUser | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
  logout: () => Promise<boolean>;
}

const useAuth = create<AuthStore>((set) => ({
  user: null,
  error: null,
  loading: true,
  updateAuth: (user, error, loading) => set({ user, error, loading }),
  setUser: (user) => set({ user }),
  login: async (email, password) => {
    set({ loading: true, error: null });
    const { success, errorDetails } = await AuthService.login(email, password);
    set({ loading: false });

    if (!success) {
      // Flatten error details to a single string for simplicity, or handle specific field errors
      const message = errorDetails ? Object.values(errorDetails).flat().join(', ') : 'Login failed';
      set({ error: message });
      return false;
    }

    // Fetch user profile after login to populate store
    try {
      // We need to implement getProfile in AuthService first or just use apiClient directly here for now
      // But valid flow is: Login -> Token stored -> Fetch Profile -> Store User
      // For now, let's assume login returns user or we fetch it.
      // The backend login response only returns token. So we must fetch profile.
      // Let's postpone profile fetch or do it here.
      const profile = await apiClient.get<{ data: AuthenticatedUser }>('/profile');
      set({ user: profile.data.data });
      return true;
    } catch (e) {
      set({ error: 'Failed to fetch user profile' });
      AuthService.logout();
      return false;
    }
  },
  register: async (data) => {
    set({ loading: true, error: null });
    const { success, errorDetails } = await AuthService.register(data);
    set({ loading: false });

    if (!success) {
      const message = errorDetails
        ? Object.values(errorDetails).flat().join(', ')
        : 'Registration failed';
      set({ error: message });
      return false;
    }

    try {
      const profile = await apiClient.get<{ data: AuthenticatedUser }>('/profile');
      set({ user: profile.data.data });
      return true;
    } catch (e) {
      set({ error: 'Failed to fetch user profile' });
      AuthService.logout();
      return false;
    }
  },
  checkAuth: async () => {
    const token = localStorage.getItem(Constants.LS_KEYS.AUTH_TOKEN); // Changed this line
    // Ideally import Constants.
    // But wait, I can just try to fetch profile. If no token, the interceptor or the request will fail/be empty.
    // Actually, better to check if token exists first to avoid unnecessary 401 calls if we know we are not logged in.

    if (!token) {
      set({ loading: false });
      return false;
    }

    set({ loading: true });
    try {
      const profile = await apiClient.get<{ data: AuthenticatedUser }>('/profile');
      set({ user: profile.data.data, loading: false });
      return true;
    } catch (error) {
      console.error('Session restoration failed', error);
      AuthService.logout();
      set({ user: null, loading: false });
      return false;
    }
  },
  logout: async () => {
    set({ loading: true });
    await AuthService.logout();
    set({ user: null, loading: false });
    return true;
  },
}));

export default useAuth;
