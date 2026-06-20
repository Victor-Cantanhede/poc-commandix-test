import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';

export function Onboarding() {
  const [tenantName, setTenantName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.onboarding({ tenantName, userName, email, password });
      alert('Tenant criado com sucesso! Faça login.');
      navigate('/login');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Erro ao criar Tenant');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border border-gray-200 rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Novo Tenant - Commandix</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
          <input 
            type="text" 
            value={tenantName} 
            onChange={e => setTenantName(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
          <input 
            type="text" 
            value={userName} 
            onChange={e => setUserName(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email do Admin</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha do Admin</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500" 
          />
        </div>
        
        <button 
          type="submit" 
          className="mt-2 p-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded transition-colors"
        >
          Finalizar Onboarding
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-gray-600">
        Já tem conta? <Link to="/login" className="text-green-600 hover:underline">Fazer Login</Link>
      </p>
    </div>
  );
}
