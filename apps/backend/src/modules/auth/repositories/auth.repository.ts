import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email, deletedAt: null },
      include: { tenant: true },
    });
  }

  async findUserByRefreshToken(token: string) {
    return this.prisma.user.findFirst({
      where: { refreshToken: token, deletedAt: null },
      include: { tenant: true },
    });
  }

  async updateRefreshToken(userId: string, token: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }
}
