import { Outlet, Navigate } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { AuthProvider, useAuth } from '../modules/auth/hooks/useAuth';

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

export function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export { ProtectedRoute };
