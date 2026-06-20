import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { IHistoryRepository } from '../interfaces/history.repository.interface';
import { HistoryEntity } from '../entities/history.entity';
import { LogHistoryDto } from '../dtos/log-history.dto';
import { HistoryResponseDto } from '../dtos/history-response.dto';

@Injectable()
export class HistoryRepository implements IHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: LogHistoryDto): Promise<HistoryEntity> {
    return this.prisma.contractHistory.create({
      data: {
        tenantId,
        contractId: data.contractId,
        userId: data.userId,
        action: data.action,
        field: data.field,
        oldValue: data.oldValue ?? null,
        newValue: data.newValue ?? null,
      },
    }) as unknown as HistoryEntity;
  }

  async findByContractId(tenantId: string, contractId: string): Promise<HistoryResponseDto[]> {
    const records = await this.prisma.contractHistory.findMany({
      where: {
        tenantId,
        contractId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return records as unknown as HistoryResponseDto[];
  }
}
