import { api } from '../../../shared/services/api';
import { Tenant, TenantUser, UpdateTenantDto, CreateUserDto, UpdateUserDto } from '../types/tenant.types';

export const tenantService = {
  getMyTenant: async (): Promise<Tenant> => {
    const response = await api.get<Tenant>('/api/tenants/me');
    return response.data;
  },

  updateMyTenant: async (data: UpdateTenantDto): Promise<Tenant> => {
    const response = await api.patch<Tenant>('/api/tenants/me', data);
    return response.data;
  },

  getUsers: async (): Promise<TenantUser[]> => {
    const response = await api.get<TenantUser[]>('/api/tenants/me/users');
    return response.data;
  },

  createUser: async (data: CreateUserDto): Promise<TenantUser> => {
    const response = await api.post<TenantUser>('/api/tenants/me/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserDto): Promise<TenantUser> => {
    const response = await api.patch<TenantUser>(`/api/tenants/me/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/tenants/me/users/${id}`);
  },
};
