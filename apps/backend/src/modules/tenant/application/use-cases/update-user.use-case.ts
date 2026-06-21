import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TenantRepository } from '../../repositories/tenant.repository';
import { UpdateUserDto } from '../../dtos/user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UpdateUserUseCase {
  constructor(private tenantRepository: TenantRepository) {}

  async execute(tenantId: string, userId: string, data: UpdateUserDto) {
    const user = await this.tenantRepository.findUserById(userId, tenantId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isOwner && data.role !== undefined && data.role !== Role.ADMIN) {
      throw new ForbiddenException('Cannot change the role of the tenant owner');
    }

    return this.tenantRepository.updateUser(userId, data);
  }
}
