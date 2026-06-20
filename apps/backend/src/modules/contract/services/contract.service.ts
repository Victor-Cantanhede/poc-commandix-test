import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { IContractRepository } from '../repositories/contract.repository.interface';
import { TemplateService } from '../../template/services/template.service';
import { CreateContractDto } from '../dtos/create-contract.dto';
import { UpdateContractDto } from '../dtos/update-contract.dto';
import { ContractQueryDto } from '../dtos/contract-query.dto';
import { ContractEntity, ContractStatus } from '../entities/contract.entity';
import { TemplateField } from '../../template/entities/template.entity';

import { HistoryService } from '../../history/services/history.service';

@Injectable()
export class ContractService {
  constructor(
    @Inject('IContractRepository')
    private readonly contractRepository: IContractRepository,
    private readonly templateService: TemplateService,
    private readonly historyService: HistoryService,
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

  async create(tenantId: string, userId: string, data: CreateContractDto): Promise<ContractEntity> {
    const template = await this.templateService.getTemplate(tenantId);
    if (!template) {
      throw new BadRequestException('No active template found for this tenant');
    }

    this.validatePayload(template.schema, data.payload);

    const contract = await this.contractRepository.create({
      tenantId,
      status: ContractStatus.DRAFT,
      templateSnapshot: template.schema,
      payload: data.payload,
    });

    await this.historyService.log(tenantId, {
      contractId: contract.id,
      userId,
      action: 'CREATED',
    });

    return contract;
  }

  async findById(tenantId: string, id: string): Promise<ContractEntity> {
    const contract = await this.contractRepository.findById(id, tenantId);
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }
    return contract;
  }

  async update(tenantId: string, userId: string, id: string, data: UpdateContractDto): Promise<ContractEntity> {
    const contract = await this.findById(tenantId, id);
    const oldPayload = contract.payload as Record<string, any>;

    if (data.payload) {
      const mergedPayload = { ...oldPayload, ...data.payload };
      this.validatePayload(contract.templateSnapshot as TemplateField[], mergedPayload);
      data.payload = mergedPayload;
    }

    const updated = await this.contractRepository.update(id, tenantId, data);

    if (data.payload) {
      const newPayload = data.payload as Record<string, any>;
      // Identify changed fields
      for (const key of Object.keys(newPayload)) {
        if (oldPayload[key] !== newPayload[key]) {
          await this.historyService.log(tenantId, {
            contractId: id,
            userId,
            action: 'UPDATED_FIELD',
            field: key,
            oldValue: oldPayload[key],
            newValue: newPayload[key],
          });
        }
      }
    }

    return updated;
  }

  async changeStatus(tenantId: string, userId: string, id: string, status: ContractStatus): Promise<ContractEntity> {
    const contract = await this.findById(tenantId, id);
    const updated = await this.contractRepository.update(id, tenantId, { status });

    await this.historyService.log(tenantId, {
      contractId: id,
      userId,
      action: 'STATUS_CHANGED',
      oldValue: contract.status,
      newValue: status,
    });

    return updated;
  }

  async findAll(tenantId: string, query: ContractQueryDto) {
    return this.contractRepository.findAll(tenantId, query);
  }
}
