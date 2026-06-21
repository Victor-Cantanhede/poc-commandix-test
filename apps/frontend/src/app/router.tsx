import { createBrowserRouter } from 'react-router-dom';
import { App, ProtectedRoute, AdminRoute } from './App';
import { Login } from '../modules/auth/pages/Login';
import { Onboarding } from '../modules/auth/pages/Onboarding';
import { TenantManagement } from '../modules/tenant/pages/TenantManagement';
import { TemplateConfig } from '../modules/template/pages/TemplateConfig';
import { ContractList } from '../modules/contract/pages/ContractList';
import { ContractDetail } from '../modules/contract/pages/ContractDetail';
import { Dashboard } from '../modules/dashboard/pages/Dashboard';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'onboarding',
        element: <Onboarding />,
      },
      {
        path: '/',
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'contracts',
            element: <ContractList />,
          },
          {
            path: 'contracts/new',
            element: <ContractDetail />,
          },
          {
            path: 'contracts/:id',
            element: <ContractDetail />,
          },
          {
            path: '/',
            element: <AdminRoute />,
            children: [
              {
                path: 'tenants',
                element: <TenantManagement />,
              },
              {
                path: 'template',
                element: <TemplateConfig />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
