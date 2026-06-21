import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { IContractRepository } from '../interfaces/contract.repository.interface';
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
            if (isNaN(Number(value)))
              throw new BadRequestException(`Field ${field.name} must be a number`);
            break;
          case 'boolean':
            if (typeof value !== 'boolean')
              throw new BadRequestException(`Field ${field.name} must be a boolean`);
            break;
          case 'date':
            if (isNaN(Date.parse(value)))
              throw new BadRequestException(`Field ${field.name} must be a valid date`);
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
      templateSnapshot: template.schema as unknown as Record<string, unknown>[],
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

  async update(
    tenantId: string,
    userId: string,
    id: string,
    data: UpdateContractDto,
  ): Promise<ContractEntity> {
    const contract = await this.findById(tenantId, id);

    if (data.payload && contract.status !== ContractStatus.DRAFT) {
      throw new BadRequestException('Cannot edit contract payload unless status is DRAFT');
    }

    const oldPayload = contract.payload as Record<string, any>;

    if (data.payload) {
      const mergedPayload = { ...oldPayload, ...data.payload };
      this.validatePayload(contract.templateSnapshot as unknown as TemplateField[], mergedPayload);
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

  async changeStatus(
    tenantId: string,
    userId: string,
    id: string,
    status: ContractStatus,
  ): Promise<ContractEntity> {
    const contract = await this.findById(tenantId, id);

    if (contract.status === ContractStatus.CLOSED) {
      throw new BadRequestException('Cannot change status of a CLOSED contract');
    }

    if (contract.status === ContractStatus.ACTIVE && status !== ContractStatus.CLOSED) {
      throw new BadRequestException('ACTIVE contracts can only be transitioned to CLOSED');
    }

    if (
      contract.status === ContractStatus.DRAFT &&
      status !== ContractStatus.ACTIVE &&
      status !== ContractStatus.CLOSED
    ) {
      throw new BadRequestException('Invalid status transition from DRAFT');
    }

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
    let searchFields: string[] = [];

    if (query.search) {
      const template = await this.templateService.getTemplate(tenantId);
      if (template && template.schema) {
        searchFields = template.schema
          .filter((field) => field.type === 'text')
          .map((field) => field.name);
      }
    }

    return this.contractRepository.findAll(tenantId, query, searchFields);
  }

  async remove(tenantId: string, userId: string, id: string): Promise<void> {
    const contract = await this.findById(tenantId, id);

    if (contract.status !== ContractStatus.DRAFT && contract.status !== ContractStatus.CLOSED) {
      throw new BadRequestException('Can only delete DRAFT or CLOSED contracts');
    }

    if (this.contractRepository.softDelete) {
      await this.contractRepository.softDelete(id, tenantId);
      await this.historyService.log(tenantId, {
        contractId: id,
        userId,
        action: 'DELETED',
      });
    } else {
      throw new BadRequestException('Contract soft deletion is not implemented in the repository.');
    }
  }
}
