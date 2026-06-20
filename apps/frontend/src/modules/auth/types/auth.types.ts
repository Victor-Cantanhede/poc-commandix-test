export interface User {
  id: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface OnboardingDto {
  tenantName: string;
  userName: string;
  email: string;
  password: string;
}
