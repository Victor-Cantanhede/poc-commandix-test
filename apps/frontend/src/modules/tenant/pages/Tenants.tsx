import { useState, useEffect } from 'react';
import { tenantService } from '../services/tenant.service';
import { Tenant } from '../types/tenant.types';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Modal } from '@/shared/components/Modal';
import { Edit2, Trash2, Plus, Building2 } from 'lucide-react';

export function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setIsLoading(true);
      const data = await tenantService.getAll();
      setTenants(data);
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setSelectedTenant(null);
    setFormData({ name: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setFormData({ name: tenant.name });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (selectedTenant) {
        await tenantService.update(selectedTenant.id, formData);
      } else {
        await tenantService.create(formData);
      }
      await fetchTenants();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save tenant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTenant) return;
    try {
      setIsSubmitting(true);
      await tenantService.delete(selectedTenant.id);
      await fetchTenants();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete tenant:', error);
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
    <div className="flex flex-col gap-6 h-full animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Building2 size={24} />
            </div>
            Gestão de Tenants
          </h2>
          <p className="text-muted-foreground mt-1">Gerencie os locatários e empresas do sistema.</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus size={18} className="mr-2" /> Novo Tenant
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-muted-foreground text-sm">
              <th className="py-4 px-6 font-semibold">Nome da Empresa</th>
              <th className="py-4 px-6 font-semibold">Data de Criação</th>
              <th className="py-4 px-6 font-semibold w-24">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map(tenant => (
              <tr key={tenant.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-4 px-6 font-medium text-foreground">{tenant.name}</td>
                <td className="py-4 px-6 text-muted-foreground text-sm">
                  {new Date(tenant.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenEdit(tenant)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleOpenDelete(tenant)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {tenants.length === 0 && (
              <tr>
                <td colSpan={3} className="py-12 text-center text-muted-foreground">
                  Nenhum tenant cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Criar/Editar */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={selectedTenant ? 'Editar Tenant' : 'Novo Tenant'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input 
            label="Nome da Empresa" 
            placeholder="Ex: Acme Corp"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
            autoFocus
          />
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Salvar Tenant
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Excluir */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => !isSubmitting && setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            Tem certeza que deseja excluir o tenant <strong className="text-foreground">{selectedTenant?.name}</strong>? 
            Esta ação removerá o acesso aos dados da empresa.
          </p>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isSubmitting}>
              Sim, Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
