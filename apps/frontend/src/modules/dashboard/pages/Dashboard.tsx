import { Users, Building, Activity, FileText } from 'lucide-react';
import { useAuth } from '../../../modules/auth/hooks/useAuth';
import { useEffect, useState } from 'react';
import { tenantService } from '../../../modules/tenant/services/tenant.service';

export function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    if (isAdmin) {
      tenantService
        .getUsers()
        .then((users) => setUsersCount(users.length))
        .catch(console.error);
    }
  }, [isAdmin]);

  return (
    <div className="flex flex-col gap-6 fade-in-0 duration-500 animate-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Visão geral do sistema Commandix.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isAdmin && (
          <div className="p-6 border border-border bg-card rounded-xl shadow-sm flex flex-col gap-2 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Usuários no Tenant</span>
              <Users size={16} className="text-primary" />
            </div>
            <div className="text-2xl font-bold">{usersCount}</div>
          </div>
        )}
        <div className="p-6 border border-border bg-card rounded-xl shadow-sm flex flex-col gap-2 hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Contratos Ativos</span>
            <FileText size={16} className="text-primary" />
          </div>
          <div className="text-2xl font-bold">-</div>
        </div>
        <div className="p-6 border border-border bg-card rounded-xl shadow-sm flex flex-col gap-2 hover:border-emerald-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Saúde do Sistema</span>
            <Activity size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-500">99.9%</div>
        </div>
        {isAdmin && (
          <div className="p-6 border border-border bg-card rounded-xl shadow-sm flex flex-col gap-2 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Template Global</span>
              <Building size={16} className="text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">Ativo</div>
          </div>
        )}
      </div>
    </div>
  );
}
