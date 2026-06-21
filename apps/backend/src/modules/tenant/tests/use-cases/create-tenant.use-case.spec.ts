import { Test, TestingModule } from '@nestjs/testing';
import { CreateTenantUseCase } from '../../application/use-cases/create-tenant.use-case';
import { TenantRepository } from '../../repositories/tenant.repository';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('CreateTenantUseCase', () => {
  let useCase: CreateTenantUseCase;
  let tenantRepository: jest.Mocked<TenantRepository>;

  beforeEach(async () => {
    const mockTenantRepository = {
      findUserByEmail: jest.fn(),
      createTenantWithUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTenantUseCase,
        {
          provide: TenantRepository,
          useValue: mockTenantRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateTenantUseCase>(CreateTenantUseCase);
    tenantRepository = module.get(TenantRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw ConflictException if email is already in use', async () => {
    tenantRepository.findUserByEmail.mockResolvedValueOnce({ id: 'any-id' } as any);

    await expect(
      useCase.execute({
        tenantName: 'Acme',
        userName: 'John Doe',
        email: 'john@acme.com',
        password: 'Password123!',
      })
    ).rejects.toThrow(ConflictException);

    expect(tenantRepository.createTenantWithUser).not.toHaveBeenCalled();
  });

  it('should create tenant and user if email is free', async () => {
    tenantRepository.findUserByEmail.mockResolvedValueOnce(null);
    tenantRepository.createTenantWithUser.mockResolvedValueOnce({
      id: 'tenant-123',
      users: [{ id: 'user-123' }],
    } as any);

    (bcrypt.genSalt as jest.Mock).mockResolvedValueOnce('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed-password');

    const result = await useCase.execute({
      tenantName: 'Acme',
      userName: 'John Doe',
      email: 'john@acme.com',
      password: 'Password123!',
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 'salt');
    expect(tenantRepository.createTenantWithUser).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'john@acme.com' }),
      'hashed-password'
    );
    expect(result).toEqual({
      message: 'Tenant and Admin created successfully',
      tenantId: 'tenant-123',
      adminId: 'user-123',
    });
  });
});
