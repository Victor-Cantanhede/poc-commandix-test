export enum ContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

export interface Contract {
  id: string;
  tenantId: string;
  status: ContractStatus;
  templateSnapshot: Record<string, unknown>[];
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ContractQuery {
  page?: number;
  limit?: number;
  status?: ContractStatus | string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ContractHistory {
  id: string;
  contractId: string;
  action: 'CREATED' | 'UPDATED_FIELD' | 'STATUS_CHANGED';
  field?: string;
  oldValue?: unknown;
  newValue?: unknown;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}
