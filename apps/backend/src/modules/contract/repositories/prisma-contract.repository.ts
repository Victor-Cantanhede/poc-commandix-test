import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { IContractRepository, PaginatedResult } from '../interfaces/contract.repository.interface';
import { ContractEntity, ContractStatus } from '../entities/contract.entity';
import { ContractQueryDto } from '../dtos/contract-query.dto';

@Injectable()
export class PrismaContractRepository implements IContractRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(model: Record<string, unknown>): ContractEntity {
    return new ContractEntity(
      model.id as string,
      model.tenantId as string,
      model.status as ContractStatus,
      model.templateSnapshot as Record<string, unknown>[],
      model.payload as Record<string, unknown>,
      model.createdAt as Date,
      model.updatedAt as Date,
      model.deletedAt as Date | null,
    );
  }

  async create(
    data: Omit<ContractEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<ContractEntity> {
    const contract = await this.prisma.contract.create({
      data: {
        tenantId: data.tenantId,
        status: data.status,
        templateSnapshot: data.templateSnapshot as unknown as Exclude<
          Parameters<typeof this.prisma.contract.create>[0]['data']['templateSnapshot'],
          undefined
        >,
        payload: data.payload as unknown as Exclude<
          Parameters<typeof this.prisma.contract.create>[0]['data']['payload'],
          undefined
        >,
      },
    });
    return this.toEntity(contract);
  }

  async findById(id: string, tenantId: string): Promise<ContractEntity | null> {
    const contract = await this.prisma.contract.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    return contract ? this.toEntity(contract) : null;
  }

  async update(
    id: string,
    tenantId: string,
    data: Partial<ContractEntity>,
  ): Promise<ContractEntity> {
    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.payload !== undefined) updateData.payload = data.payload;

    const contract = await this.prisma.contract.update({
      where: { id, tenantId },
      data: updateData,
    });
    return this.toEntity(contract);
  }

  async findAll(
    tenantId: string,
    query: ContractQueryDto,
    searchFields?: string[],
  ): Promise<PaginatedResult<ContractEntity>> {
    const { page = 1, limit = 10, status, search, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      tenantId,
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        if (!where.createdAt) where.createdAt = {};
        (where.createdAt as any).gte = new Date(startDate);
      }
      if (endDate) {
        if (!where.createdAt) where.createdAt = {};
        (where.createdAt as any).lte = new Date(endDate);
      }
    }

    if (search && searchFields && searchFields.length > 0) {
      where.OR = searchFields.map((field) => ({
        payload: {
          path: [field],
          string_contains: search,
        },
      }));
    }

    const [items, count] = await Promise.all([
      this.prisma.contract.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contract.count({ where }),
    ]);

    const contracts = items.map((c: Record<string, unknown>) => this.toEntity(c));
    const total = count;

    return {
      data: contracts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async softDelete(id: string, tenantId: string): Promise<void> {
    await this.prisma.contract.update({
      where: { id, tenantId },
      data: { deletedAt: new Date() },
    });
  }
}
