import { Test, TestingModule } from '@nestjs/testing';
import { ContractService } from '../../services/contract.service';
import { IContractRepository } from '../../interfaces/contract.repository.interface';
import { TemplateService } from '../../../template/services/template.service';
import { HistoryService } from '../../../history/services/history.service';
import { BadRequestException } from '@nestjs/common';
import { ContractStatus } from '../../entities/contract.entity';

describe('ContractService', () => {
  let service: ContractService;
  let contractRepository: jest.Mocked<IContractRepository>;
  let templateService: jest.Mocked<TemplateService>;
  let historyService: jest.Mocked<HistoryService>;

  beforeEach(async () => {
    const mockContractRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      softDelete: jest.fn(),
    };

    const mockTemplateService = {
      getTemplate: jest.fn(),
    };

    const mockHistoryService = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractService,
        { provide: 'IContractRepository', useValue: mockContractRepository },
        { provide: TemplateService, useValue: mockTemplateService },
        { provide: HistoryService, useValue: mockHistoryService },
      ],
    }).compile();

    service = module.get<ContractService>(ContractService);
    contractRepository = module.get('IContractRepository');
    templateService = module.get(TemplateService);
    historyService = module.get(HistoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw BadRequestException if tenant has no active template', async () => {
      templateService.getTemplate.mockResolvedValueOnce(null as any);

      await expect(
        service.create('tenant-1', 'user-1', { payload: { name: 'Test' } })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if payload fails validation', async () => {
      templateService.getTemplate.mockResolvedValueOnce({
        schema: [
          { name: 'clientName', type: 'text', required: true },
          { name: 'age', type: 'number', required: true },
        ],
      } as any);

      // Missing age
      await expect(
        service.create('tenant-1', 'user-1', { payload: { clientName: 'Test' } })
      ).rejects.toThrow(BadRequestException);

      // Invalid number
      await expect(
        service.create('tenant-1', 'user-1', { payload: { clientName: 'Test', age: 'abc' } })
      ).rejects.toThrow(BadRequestException);
    });

    it('should create contract and history if validation passes', async () => {
      const mockSchema = [{ name: 'clientName', type: 'text', required: true }];
      templateService.getTemplate.mockResolvedValueOnce({ schema: mockSchema } as any);

      contractRepository.create.mockResolvedValueOnce({ id: 'contract-1' } as any);

      const result = await service.create('tenant-1', 'user-1', {
        payload: { clientName: 'Test Corp' },
      });

      expect(contractRepository.create).toHaveBeenCalledWith({
        tenantId: 'tenant-1',
        status: ContractStatus.DRAFT,
        templateSnapshot: mockSchema,
        payload: { clientName: 'Test Corp' },
      });

      expect(historyService.log).toHaveBeenCalledWith('tenant-1', {
        contractId: 'contract-1',
        userId: 'user-1',
        action: 'CREATED',
      });

      expect(result.id).toEqual('contract-1');
    });
  });
});
