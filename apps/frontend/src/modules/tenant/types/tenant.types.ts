export interface Tenant {
  id: string;
  name: string;
  createdAt: string;
  deletedAt?: string | null;
}

export interface TenantUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'VIEWER';
  isOwner: boolean;
  createdAt: string;
}

export interface UpdateTenantDto {
  name: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'VIEWER';
}

export interface UpdateUserDto {
  name?: string;
  role?: 'ADMIN' | 'VIEWER';
}
