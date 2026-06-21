import { Test, TestingModule } from '@nestjs/testing';
import { HistoryService } from '../../services/history.service';
import { IHistoryRepository } from '../../interfaces/history.repository.interface';

describe('HistoryService', () => {
  let service: HistoryService;
  let historyRepository: jest.Mocked<IHistoryRepository>;

  beforeEach(async () => {
    const mockHistoryRepository = {
      create: jest.fn(),
      findByContractId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryService,
        { provide: 'IHistoryRepository', useValue: mockHistoryRepository },
      ],
    }).compile();

    service = module.get<HistoryService>(HistoryService);
    historyRepository = module.get('IHistoryRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('log', () => {
    it('should delegate create call to repository', async () => {
      historyRepository.create.mockResolvedValueOnce(undefined as any);

      const logData = {
        contractId: 'contract-1',
        userId: 'user-1',
        action: 'CREATED',
      };

      await service.log('tenant-1', logData);
      expect(historyRepository.create).toHaveBeenCalledWith('tenant-1', logData);
    });
  });

  describe('getContractHistory', () => {
    it('should return contract history from repository', async () => {
      const mockResult = [
        { id: '1', action: 'CREATED', createdAt: new Date(), user: { name: 'Test' } },
      ];
      historyRepository.findByContractId.mockResolvedValueOnce(mockResult as any);

      const result = await service.getContractHistory('tenant-1', 'contract-1');
      expect(historyRepository.findByContractId).toHaveBeenCalledWith('tenant-1', 'contract-1');
      expect(result).toEqual(mockResult);
    });
  });
});
