import { ReactNode } from 'react';
import { useAuth } from '../../modules/auth/hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Command } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { logout, user } = useAuth();
  const location = useLocation();
  
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Command size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Commandix</h1>
            <p className="text-xs text-muted-foreground font-medium">Tenant Manager</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link 
            to="/" 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-md transition-all font-medium text-sm group",
              location.pathname === '/' 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <LayoutDashboard size={18} className={cn(location.pathname === '/' ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground transition-colors")} />
            Dashboard
          </Link>
          
          {isAdmin && (
            <Link 
              to="/tenants" 
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-all font-medium text-sm group",
                location.pathname === '/tenants' 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Users size={18} className={cn(location.pathname === '/tenants' ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground transition-colors")} />
              Tenants
            </Link>
          )}
        </nav>
        
        {user && (
          <div className="p-4 border-t border-border bg-card/50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold truncate max-w-[140px]">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.role}</span>
            </div>
            <button 
              onClick={logout} 
              className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-md hover:bg-destructive/10"
              title="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}
