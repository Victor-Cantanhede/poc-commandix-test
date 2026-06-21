import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { handleApiError } from '../../../shared/lib/error-handler';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Command } from 'lucide-react';
import { toast } from 'sonner';

export function Onboarding() {
  const [tenantName, setTenantName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await authService.onboarding({ tenantName, userName, email, password });
      toast.success('Tenant criado com sucesso! Faça login.');
      navigate('/login');
    } catch (err) {
      const errorMessage = handleApiError(err, 'Erro ao criar conta');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 selection:bg-primary/30 py-12">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8 gap-2">
          <div className="bg-primary/10 p-3 rounded-2xl text-primary">
            <Command size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Novo Tenant</h1>
          <p className="text-muted-foreground font-medium text-center">
            Crie sua conta corporativa no Commandix
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm font-medium mb-6 text-center border border-destructive/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Nome da Empresa"
              type="text"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              required
              placeholder="Sua Empresa LTDA"
            />

            <Input
              label="Seu Nome"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              placeholder="João Silva"
            />

            <Input
              label="Email do Administrador"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@empresa.com"
            />

            <Input
              label="Senha de Acesso"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <Button type="submit" isLoading={isLoading} className="mt-2 w-full font-semibold">
              Finalizar Cadastro
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              Já possui uma conta?{' '}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium transition-colors"
              >
                Fazer Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
