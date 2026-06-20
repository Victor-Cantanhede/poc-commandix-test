import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';

@Injectable()
export class HealthRepository {
  constructor(private prisma: PrismaService) {}

  async checkDatabaseConnection(): Promise<number> {
    const result = await this.prisma.$queryRaw<[{ '?column?': number }]>`SELECT 1`;
    return result[0]['?column?'];
  }
}
