import { useState, useEffect } from 'react';
import { tenantService } from '../services/tenant.service';
import { Tenant, TenantUser } from '../types/tenant.types';
import { useAuth } from '../../../modules/auth/hooks/useAuth';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Modal } from '@/shared/components/Modal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Edit2, Trash2, Plus, Building2, UserPlus, Shield } from 'lucide-react';
import { toast } from 'sonner';

export function TenantManagement() {
  const { user: currentUser } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

  // Forms state
  const [tenantFormData, setTenantFormData] = useState({ name: '' });
  const [selectedUser, setSelectedUser] = useState<TenantUser | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'VIEWER' as 'ADMIN' | 'VIEWER',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [tenantData, usersData] = await Promise.all([
        tenantService.getMyTenant(),
        tenantService.getUsers(),
      ]);
      setTenant(tenantData);
      setUsers(usersData);
    } catch (error) {
      toast.error('Erro ao buscar dados do tenant');
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Tenant Handlers ---

  const handleOpenEditTenant = () => {
    if (tenant) {
      setTenantFormData({ name: tenant.name });
      setIsTenantModalOpen(true);
    }
  };

  const handleTenantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await tenantService.updateMyTenant(tenantFormData);
      await fetchData();
      setIsTenantModalOpen(false);
      toast.success('Tenant atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar tenant');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- User Handlers ---

  const handleOpenCreateUser = () => {
    setSelectedUser(null);
    setUserFormData({ name: '', email: '', password: '', role: 'VIEWER' });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user: TenantUser) => {
    setSelectedUser(user);
    setUserFormData({ name: user.name, email: user.email, password: '', role: user.role });
    setIsUserModalOpen(true);
  };

  const handleOpenDeleteUser = (user: TenantUser) => {
    setSelectedUser(user);
    setIsDeleteUserModalOpen(true);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (selectedUser) {
        await tenantService.updateUser(selectedUser.id, {
          name: userFormData.name,
          role: userFormData.role,
        });
        toast.success('Usuário atualizado com sucesso');
      } else {
        await tenantService.createUser({
          name: userFormData.name,
          email: userFormData.email,
          password: userFormData.password,
          role: userFormData.role,
        });
        toast.success('Usuário criado com sucesso');
      }
      await fetchData();
      setIsUserModalOpen(false);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const errObj = error as { response?: { data?: { message?: string } } };
        toast.error(errObj.response?.data?.message || 'Erro ao salvar usuário');
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao salvar usuário');
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      setIsSubmitting(true);
      await tenantService.deleteUser(selectedUser.id);
      await fetchData();
      setIsDeleteUserModalOpen(false);
      toast.success('Usuário excluído com sucesso');
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const errObj = error as { response?: { data?: { message?: string } } };
        toast.error(errObj.response?.data?.message || 'Erro ao excluir usuário');
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao excluir usuário');
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 h-full animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Building2 size={24} />
            </div>
            Gestão do Tenant
          </h2>
          <p className="text-muted-foreground mt-1">
            Gerencie os dados e os usuários da sua empresa.
          </p>
        </div>
      </div>

      {/* Tenant Details Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{tenant?.name}</h3>
          <p className="text-sm text-muted-foreground">
            Membro desde {tenant ? new Date(tenant.createdAt).toLocaleDateString('pt-BR') : ''}
          </p>
        </div>
        <Button variant="outline" onClick={handleOpenEditTenant}>
          <Edit2 size={16} className="mr-2" /> Editar Dados
        </Button>
      </div>

      {/* Users Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Shield size={20} className="text-primary" />
            Usuários
          </h3>
          <Button onClick={handleOpenCreateUser}>
            <UserPlus size={18} className="mr-2" /> Novo Usuário
          </Button>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    {u.name}
                    {u.id === currentUser?.id && <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Você</span>}
                    {u.isOwner && <span className="ml-2 text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full">Dono</span>}
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                      {u.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEditUser(u)}
                        title="Editar"
                      >
                        <Edit2 size={16} className="text-primary" />
                      </Button>
                      {!u.isOwner && u.id !== currentUser?.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDeleteUser(u)}
                          title="Excluir"
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal Edit Tenant */}
      <Modal
        isOpen={isTenantModalOpen}
        onClose={() => !isSubmitting && setIsTenantModalOpen(false)}
        title="Editar Tenant"
      >
        <form onSubmit={handleTenantSubmit} className="flex flex-col gap-5">
          <Input
            label="Nome da Empresa"
            value={tenantFormData.name}
            onChange={(e) => setTenantFormData({ ...tenantFormData, name: e.target.value })}
            required
            autoFocus
          />
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setIsTenantModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Salvar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Create/Edit User */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => !isSubmitting && setIsUserModalOpen(false)}
        title={selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
      >
        <form onSubmit={handleUserSubmit} className="flex flex-col gap-5">
          <Input
            label="Nome"
            value={userFormData.name}
            onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
            required
            autoFocus
          />
          <Input
            label="Email"
            type="email"
            value={userFormData.email}
            onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
            required
            disabled={!!selectedUser} // Não permitir alterar email após criar
          />
          {!selectedUser && (
            <Input
              label="Senha"
              type="password"
              value={userFormData.password}
              onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
              required
              placeholder="••••••••"
            />
          )}
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium leading-none">Papel de Acesso</label>
            <Select 
              value={userFormData.role} 
              onValueChange={(val: 'ADMIN'|'VIEWER') => setUserFormData({ ...userFormData, role: val })}
              disabled={selectedUser?.isOwner}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um papel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Administrador</SelectItem>
                <SelectItem value="VIEWER">Visualizador</SelectItem>
              </SelectContent>
            </Select>
            {selectedUser?.isOwner && (
              <p className="text-xs text-muted-foreground mt-1">O dono do tenant sempre será Administrador.</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setIsUserModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Salvar Usuário
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Delete User */}
      <Modal
        isOpen={isDeleteUserModalOpen}
        onClose={() => !isSubmitting && setIsDeleteUserModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            Tem certeza que deseja remover o acesso do usuário{' '}
            <strong className="text-foreground">{selectedUser?.name}</strong>?
          </p>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setIsDeleteUserModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteUser} isLoading={isSubmitting}>
              Sim, Remover
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
