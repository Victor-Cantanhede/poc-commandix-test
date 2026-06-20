import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Command } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await authService.login({ email, password });
      login(response.accessToken, response.refreshToken, response.user);
      navigate('/');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Erro ao realizar login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 selection:bg-primary/30">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8 gap-2">
          <div className="bg-primary/10 p-3 rounded-2xl text-primary">
            <Command size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Commandix</h1>
          <p className="text-muted-foreground font-medium">Faça login para acessar seu tenant</p>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm font-medium mb-6 text-center border border-destructive/20">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input 
              label="Email corporativo"
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="seu@email.com"
            />
            
            <Input 
              label="Senha"
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
            
            <Button type="submit" isLoading={isLoading} className="mt-2 w-full font-semibold">
              Entrar na plataforma
            </Button>
          </form>
          
          <div className="mt-8 text-center border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              Primeira vez por aqui?{' '}
              <Link to="/onboarding" className="text-primary hover:underline font-medium transition-colors">
                Criar um Tenant
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
