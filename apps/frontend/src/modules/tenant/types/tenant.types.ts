export interface Tenant {
  id: string;
  name: string;
  createdAt: string;
  deletedAt?: string | null;
}

export interface CreateTenantDto {
  name: string;
}

export interface UpdateTenantDto {
  name: string;
}
