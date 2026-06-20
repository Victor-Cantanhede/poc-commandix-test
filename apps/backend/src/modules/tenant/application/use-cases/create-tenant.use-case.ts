import { Injectable, ConflictException } from '@nestjs/common';
import { TenantRepository } from '../../repositories/tenant.repository';
import { OnboardingDto } from '../../dtos/tenant.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateTenantUseCase {
  constructor(private tenantRepository: TenantRepository) {}

  async execute(data: OnboardingDto) {
    const existingUser = await this.tenantRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(data.password, salt);

    const tenant = await this.tenantRepository.createTenantWithUser(data, passwordHash);

    return {
      message: 'Tenant and Admin created successfully',
      tenantId: tenant.id,
      adminId: tenant.users[0].id,
    };
  }
}
