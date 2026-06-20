import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login({ email, password });
      login(response.accessToken, response.refreshToken, response.user);
      navigate('/');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Erro ao realizar login');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 border border-gray-200 rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login - Commandix</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        
        <button 
          type="submit" 
          className="mt-2 p-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
        >
          Entrar
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-gray-600">
        Primeira vez? <Link to="/onboarding" className="text-blue-600 hover:underline">Criar um Tenant</Link>
      </p>
    </div>
  );
}
