import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  tenantId: string;
  role: Role;
}
