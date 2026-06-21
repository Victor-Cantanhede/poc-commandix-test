import { Injectable, ConflictException } from '@nestjs/common';
import { TenantRepository } from '../../repositories/tenant.repository';
import { CreateUserDto } from '../../dtos/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(private tenantRepository: TenantRepository) {}

  async execute(tenantId: string, data: CreateUserDto) {
    const existingUser = await this.tenantRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(data.password, salt);

    return this.tenantRepository.createUser(tenantId, data, passwordHash);
  }
}
