import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { OnboardingDto } from '../dtos/tenant.dto';
import { Role } from '@prisma/client';

@Injectable()
export class TenantRepository {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
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
}
