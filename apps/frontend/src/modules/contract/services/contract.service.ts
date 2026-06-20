import { api } from '@/shared/services/api';
import {
  Contract,
  ContractQuery,
  ContractStatus,
  PaginatedResult,
  ContractHistory,
} from '../types/contract.types';

export const contractService = {
  findAll: async (query?: ContractQuery): Promise<PaginatedResult<Contract>> => {
    const cleanQuery = Object.fromEntries(Object.entries(query || {}).filter(([_, v]) => v !== ''));
    const response = await api.get('/api/contracts', { params: cleanQuery });
    return response.data;
  },

  findById: async (id: string): Promise<Contract> => {
    const response = await api.get(`/api/contracts/${id}`);
    return response.data;
  },

  create: async (payload: Record<string, any>): Promise<Contract> => {
    const response = await api.post('/api/contracts', { payload });
    return response.data;
  },

  update: async (id: string, payload: Record<string, any>): Promise<Contract> => {
    const response = await api.patch(`/api/contracts/${id}`, { payload });
    return response.data;
  },

  changeStatus: async (id: string, status: ContractStatus): Promise<Contract> => {
    const response = await api.patch(`/api/contracts/${id}/status`, { status });
    return response.data;
  },

  getHistory: async (id: string): Promise<ContractHistory[]> => {
    const response = await api.get(`/api/contracts/${id}/history`);
    return response.data;
  },
};
