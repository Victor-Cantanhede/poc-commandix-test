import { ReactNode } from 'react';
import { useAuth } from '../../modules/auth/hooks/useAuth';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { logout, user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Commandix POC</h1>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Olá, {user.name}</span>
            <button 
              onClick={logout} 
              className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
            >
              Sair
            </button>
          </div>
        )}
      </header>
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
