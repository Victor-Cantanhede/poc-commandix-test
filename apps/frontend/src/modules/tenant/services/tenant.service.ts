import { api } from '../../../shared/services/api';
import { Tenant, CreateTenantDto, UpdateTenantDto } from '../types/tenant.types';

export const tenantService = {
  getAll: async (): Promise<Tenant[]> => {
    const response = await api.get<Tenant[]>('/api/tenants');
    return response.data;
  },

  getById: async (id: string): Promise<Tenant> => {
    const response = await api.get<Tenant>(`/api/tenants/${id}`);
    return response.data;
  },

  create: async (data: CreateTenantDto): Promise<Tenant> => {
    const response = await api.post<Tenant>('/api/tenants', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTenantDto): Promise<Tenant> => {
    const response = await api.patch<Tenant>(`/api/tenants/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/tenants/${id}`);
  },
};
