import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/auth.types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      authService.setAuthToken(storedToken);
    }
    return storedToken ? storedToken : null;
  });

  const login = (token: string, refreshToken: string, userData: User) => {
    setUser(userData);
    setAccessToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    authService.setAuthToken(token);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    authService.setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, isAuthenticated: !!accessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
