import { api } from '../../../shared/services/api';
import { LoginDto, OnboardingDto, AuthResponse } from '../types/auth.types';

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  onboarding: async (data: OnboardingDto): Promise<void> => {
    await api.post('/api/auth/onboarding', data);
  },

  setAuthToken: (token: string | null) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },
};
