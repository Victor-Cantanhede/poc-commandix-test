import { Outlet, Navigate } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { AuthProvider, useAuth } from '../modules/auth/hooks/useAuth';
import { Toaster } from '../shared/components/Toaster';

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

function AdminRoute() {
  const { user } = useAuth();
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export function App() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
}

export { ProtectedRoute, AdminRoute };
