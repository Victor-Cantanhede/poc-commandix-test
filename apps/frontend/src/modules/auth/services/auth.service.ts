import axios from 'axios';
import { LoginDto, OnboardingDto, AuthResponse } from '../types/auth.types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

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
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Global fallback
    } else {
      delete api.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];
    }
  }
};
