import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { ITemplateRepository } from '../interfaces/template-repository.interface';
import { Template, TemplateField } from '../entities/template.entity';

@Injectable()
export class PrismaTemplateRepository implements ITemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenantId(tenantId: string): Promise<Template | null> {
    const template = await this.prisma.template.findUnique({
      where: { tenantId },
    });
    
    if (!template) return null;
    
    return {
      ...template,
      schema: template.schema as any,
    };
  }

  async create(tenantId: string, schema: TemplateField[]): Promise<Template> {
    const template = await this.prisma.template.create({
      data: {
        tenantId,
        schema: schema as any,
      },
    });

    return {
      ...template,
      schema: template.schema as any,
    };
  }

  async update(tenantId: string, schema: TemplateField[]): Promise<Template> {
    const template = await this.prisma.template.update({
      where: { tenantId },
      data: {
        schema: schema as any,
      },
    });

    return {
      ...template,
      schema: template.schema as any,
    };
  }
}
