import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { OnboardingDto } from '../dtos/tenant.dto';
import { Role } from '@prisma/client';
import { ITenantRepository } from '../interfaces/tenant-repository.interface';
import { TenantEntity } from '../entities/tenant.entity';

@Injectable()
export class TenantRepository implements ITenantRepository {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email, deletedAt: null } });
  }

  async createTenantWithUser(data: OnboardingDto, passwordHash: string) {
    return this.prisma.tenant.create({
      data: {
        name: data.tenantName,
        users: {
          create: {
            name: data.userName,
            email: data.email,
            passwordHash,
            role: Role.ADMIN,
          },
        },
      },
      include: {
        users: true,
      },
    });
  }

  async findById(id: string): Promise<TenantEntity | null> {
    return this.prisma.tenant.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findAll(): Promise<TenantEntity[]> {
    return this.prisma.tenant.findMany({
      where: { deletedAt: null },
    });
  }

  async create(name: string): Promise<TenantEntity> {
    return this.prisma.tenant.create({
      data: { name },
    });
  }

  async update(id: string, name: string): Promise<TenantEntity> {
    return this.prisma.tenant.update({
      where: { id },
      data: { name },
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.tenant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
