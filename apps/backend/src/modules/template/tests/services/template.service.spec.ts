import { Test, TestingModule } from '@nestjs/testing';
import { TemplateService } from '../../services/template.service';
import { ITemplateRepository } from '../../interfaces/template-repository.interface';
import { BadRequestException } from '@nestjs/common';

describe('TemplateService', () => {
  let service: TemplateService;
  let templateRepository: jest.Mocked<ITemplateRepository>;

  beforeEach(async () => {
    const mockTemplateRepository = {
      findByTenantId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateService,
        { provide: ITemplateRepository, useValue: mockTemplateRepository },
      ],
    }).compile();

    service = module.get<TemplateService>(TemplateService);
    templateRepository = module.get(ITemplateRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTemplate', () => {
    it('should return existing template', async () => {
      templateRepository.findByTenantId.mockResolvedValueOnce({ id: '1', schema: [] } as any);

      const result = await service.getTemplate('tenant-1');
      expect(result).toEqual({ id: '1', schema: [] });
      expect(templateRepository.create).not.toHaveBeenCalled();
    });

    it('should create an empty template if none exists', async () => {
      templateRepository.findByTenantId.mockResolvedValueOnce(null);
      templateRepository.create.mockResolvedValueOnce({ id: '2', schema: [] } as any);

      const result = await service.getTemplate('tenant-1');
      expect(templateRepository.create).toHaveBeenCalledWith('tenant-1', []);
      expect(result).toEqual({ id: '2', schema: [] });
    });
  });

  describe('updateTemplate', () => {
    it('should throw BadRequestException if schema has duplicate field names', async () => {
      const invalidSchema = [
        { name: 'Field 1', type: 'text', required: false },
        { name: 'field 1', type: 'number', required: true }, // duplicates the above ignoring case/trim
      ];

      await expect(service.updateTemplate('tenant-1', invalidSchema as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create template if it does not exist on update', async () => {
      templateRepository.findByTenantId.mockResolvedValueOnce(null);
      templateRepository.create.mockResolvedValueOnce({ id: 'new', schema: [] } as any);

      const validSchema = [{ name: 'Field 1', type: 'text', required: false }];
      await service.updateTemplate('tenant-1', validSchema as any);

      expect(templateRepository.create).toHaveBeenCalledWith('tenant-1', validSchema);
      expect(templateRepository.update).not.toHaveBeenCalled();
    });

    it('should update template if it already exists', async () => {
      templateRepository.findByTenantId.mockResolvedValueOnce({ id: 'existing', schema: [] } as any);
      templateRepository.update.mockResolvedValueOnce({ id: 'existing', schema: [] } as any);

      const validSchema = [{ name: 'Field 1', type: 'text', required: false }];
      await service.updateTemplate('tenant-1', validSchema as any);

      expect(templateRepository.update).toHaveBeenCalledWith('tenant-1', validSchema);
      expect(templateRepository.create).not.toHaveBeenCalled();
    });
  });
});
