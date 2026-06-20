import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { IContractRepository } from '../repositories/contract.repository.interface';
import { TemplateService } from '../../template/services/template.service';
import { CreateContractDto } from '../dtos/create-contract.dto';
import { UpdateContractDto } from '../dtos/update-contract.dto';
import { ContractQueryDto } from '../dtos/contract-query.dto';
import { ContractEntity, ContractStatus } from '../entities/contract.entity';
import { TemplateField } from '../../template/entities/template.entity';

@Injectable()
export class ContractService {
  constructor(
    @Inject('IContractRepository')
    private readonly contractRepository: IContractRepository,
    private readonly templateService: TemplateService,
  ) {}

  private validatePayload(schema: TemplateField[], payload: Record<string, any>) {
    for (const field of schema) {
      const value = payload[field.name];

      if (field.required && (value === undefined || value === null || value === '')) {
        throw new BadRequestException(`Field ${field.name} is required`);
      }

      if (value !== undefined && value !== null && value !== '') {
        switch (field.type) {
          case 'number':
            if (isNaN(Number(value))) throw new BadRequestException(`Field ${field.name} must be a number`);
            break;
          case 'boolean':
            if (typeof value !== 'boolean') throw new BadRequestException(`Field ${field.name} must be a boolean`);
            break;
          case 'date':
            if (isNaN(Date.parse(value))) throw new BadRequestException(`Field ${field.name} must be a valid date`);
            break;
          // text can be anything that converts to string
        }
      }
    }
  }

  async create(tenantId: string, data: CreateContractDto): Promise<ContractEntity> {
    const template = await this.templateService.getTemplate(tenantId);
    if (!template) {
      throw new BadRequestException('No active template found for this tenant');
    }

    this.validatePayload(template.schema, data.payload);

    return this.contractRepository.create({
      tenantId,
      status: ContractStatus.DRAFT,
      templateSnapshot: template.schema,
      payload: data.payload,
    });
  }

  async findById(tenantId: string, id: string): Promise<ContractEntity> {
    const contract = await this.contractRepository.findById(id, tenantId);
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }
    return contract;
  }

  async update(tenantId: string, id: string, data: UpdateContractDto): Promise<ContractEntity> {
    const contract = await this.findById(tenantId, id);

    if (data.payload) {
      const mergedPayload = { ...contract.payload, ...data.payload };
      this.validatePayload(contract.templateSnapshot as TemplateField[], mergedPayload);
      data.payload = mergedPayload;
    }

    return this.contractRepository.update(id, tenantId, data);
  }

  async changeStatus(tenantId: string, id: string, status: ContractStatus): Promise<ContractEntity> {
    const contract = await this.findById(tenantId, id);
    return this.contractRepository.update(id, tenantId, { status });
  }

  async findAll(tenantId: string, query: ContractQueryDto) {
    return this.contractRepository.findAll(tenantId, query);
  }
}
