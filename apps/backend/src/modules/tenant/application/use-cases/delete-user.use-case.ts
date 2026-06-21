import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TenantRepository } from '../../repositories/tenant.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(private tenantRepository: TenantRepository) {}

  async execute(tenantId: string, userId: string) {
    const user = await this.tenantRepository.findUserById(userId, tenantId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isOwner) {
      throw new ForbiddenException('Cannot delete the tenant owner');
    }

    await this.tenantRepository.softDeleteUser(userId);
  }
}
