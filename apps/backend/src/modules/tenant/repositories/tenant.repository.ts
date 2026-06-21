import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { OnboardingDto } from '../dtos/tenant.dto';
import { Role } from '@prisma/client';
import { ITenantRepository } from '../interfaces/tenant-repository.interface';
import { TenantEntity } from '../entities/tenant.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

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
            isOwner: true,
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

  async update(id: string, name: string): Promise<TenantEntity> {
    return this.prisma.tenant.update({
      where: { id },
      data: { name },
    });
  }

  // --- User Management ---

  async findUsersByTenantId(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId, deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isOwner: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findUserById(userId: string, tenantId: string) {
    return this.prisma.user.findFirst({
      where: { id: userId, tenantId, deletedAt: null },
    });
  }

  async createUser(tenantId: string, data: CreateUserDto, passwordHash: string) {
    return this.prisma.user.create({
      data: {
        tenantId,
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        isOwner: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isOwner: true,
        createdAt: true,
      },
    });
  }

  async updateUser(userId: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        role: data.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isOwner: true,
        createdAt: true,
      },
    });
  }

  async softDeleteUser(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
  }
}
