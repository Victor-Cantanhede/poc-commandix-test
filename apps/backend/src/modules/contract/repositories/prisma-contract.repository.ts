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

    if (search) {
      // Usaremos query raw abaixo para busca textual no JSON
    }

    let contracts;
    let total;

    if (search) {
      // Raw query for search text inside JSON
      const searchPattern = `%${search}%`;

      let rawQueryStr = `SELECT * FROM "Contract" WHERE "tenantId" = $1 AND "deletedAt" IS NULL AND "payload"::text ILIKE $2`;
      let countQueryStr = `SELECT COUNT(*) as count FROM "Contract" WHERE "tenantId" = $1 AND "deletedAt" IS NULL AND "payload"::text ILIKE $2`;

      const params: unknown[] = [tenantId, searchPattern];
      let paramIndex = 3;

      if (status) {
        rawQueryStr += ` AND "status" = $${paramIndex}::"ContractStatus"`;
        countQueryStr += ` AND "status" = $${paramIndex}::"ContractStatus"`;
        params.push(status);
        paramIndex++;
      }

      if (startDate) {
        rawQueryStr += ` AND "createdAt" >= $${paramIndex}`;
        countQueryStr += ` AND "createdAt" >= $${paramIndex}`;
        params.push(new Date(startDate));
        paramIndex++;
      }

      if (endDate) {
        // Include entire end date by setting time to 23:59:59 or simply use <= if the date includes time.
        // In DTO, if it's just 'YYYY-MM-DD', new Date() parses it. It's safer to use a Date object directly.
        const endD = new Date(endDate);
        endD.setHours(23, 59, 59, 999);
        rawQueryStr += ` AND "createdAt" <= $${paramIndex}`;
        countQueryStr += ` AND "createdAt" <= $${paramIndex}`;
        params.push(endD);
        paramIndex++;
      }

      // Simplificado sem datas no Raw para não encher de lógica
      rawQueryStr += ` ORDER BY "createdAt" DESC LIMIT ${limit} OFFSET ${skip}`;

      const rawContracts = await this.prisma.$queryRawUnsafe<Record<string, unknown>[]>(
        rawQueryStr,
        ...params,
      );
      const rawCount = await this.prisma.$queryRawUnsafe<{ count: number }[]>(
        countQueryStr,
        ...params,
      );

      contracts = rawContracts.map((c: Record<string, unknown>) => this.toEntity(c));
      total = Number(rawCount[0].count);
    } else {
      const [items, count] = await Promise.all([
        this.prisma.contract.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.contract.count({ where }),
      ]);
      contracts = items.map((c: Record<string, unknown>) => this.toEntity(c));
      total = count;
    }

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
