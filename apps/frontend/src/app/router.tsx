import { createBrowserRouter } from 'react-router-dom';
import { App, ProtectedRoute, AdminRoute } from './App';
import { Login } from '../modules/auth/pages/Login';
import { Onboarding } from '../modules/auth/pages/Onboarding';
import { Tenants } from '../modules/tenant/pages/Tenants';
import { Users, Building, Activity, FileText } from 'lucide-react';
import { TemplateConfig } from '../modules/template/pages/TemplateConfig';
import { ContractList } from '../modules/contract/pages/ContractList';
import { ContractDetail } from '../modules/contract/pages/ContractDetail';
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
            element: (
              <div className="flex flex-col gap-6 fade-in-0 duration-500 animate-in">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                  <p className="text-muted-foreground mt-1">Visão geral do sistema Commandix.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="p-6 border border-border bg-card rounded-xl shadow-sm flex flex-col gap-2 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Total Tenants</span>
                      <Users size={16} className="text-primary" />
                    </div>
                    <div className="text-2xl font-bold">12</div>
                  </div>
                  <div className="p-6 border border-border bg-card rounded-xl shadow-sm flex flex-col gap-2 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Contratos Ativos</span>
                      <FileText size={16} className="text-primary" />
                    </div>
                    <div className="text-2xl font-bold">48</div>
                  </div>
                  <div className="p-6 border border-border bg-card rounded-xl shadow-sm flex flex-col gap-2 hover:border-emerald-500/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Saúde do Sistema</span>
                      <Activity size={16} className="text-emerald-500" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-500">99.9%</div>
                  </div>
                  <div className="p-6 border border-border bg-card rounded-xl shadow-sm flex flex-col gap-2 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Template Global</span>
                      <Building size={16} className="text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">V2.1</div>
                  </div>
                </div>
              </div>
            ),
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
                element: <Tenants />,
              },
              {
                path: 'template',
                element: <TemplateConfig />,
              },
            ]
          }
        ]
      }
    ],
  },
]);
