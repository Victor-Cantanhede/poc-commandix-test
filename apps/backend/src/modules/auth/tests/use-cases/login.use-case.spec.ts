import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { AuthRepository } from '../../repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

jest.mock('bcrypt');

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let authRepository: jest.Mocked<AuthRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockAuthRepository = {
      findUserByEmail: jest.fn(),
      updateRefreshToken: jest.fn(),
    };

    const mockJwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        { provide: AuthRepository, useValue: mockAuthRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
    authRepository = module.get(AuthRepository);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw UnauthorizedException if user not found', async () => {
    authRepository.findUserByEmail.mockResolvedValueOnce(null);

    await expect(
      useCase.execute({ email: 'test@test.com', password: '123' })
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password does not match', async () => {
    authRepository.findUserByEmail.mockResolvedValueOnce({
      id: '1',
      passwordHash: 'hashed',
    } as any);

    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    await expect(
      useCase.execute({ email: 'test@test.com', password: 'wrong' })
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return tokens and user info if credentials are valid', async () => {
    authRepository.findUserByEmail.mockResolvedValueOnce({
      id: 'user-1',
      tenantId: 'tenant-1',
      role: 'ADMIN',
      name: 'Test',
      passwordHash: 'hashed',
      tenant: { name: 'TenantName' },
    } as any);

    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
    jwtService.signAsync.mockResolvedValueOnce('access-token');

    const result = await useCase.execute({ email: 'test@test.com', password: '123' });

    expect(authRepository.updateRefreshToken).toHaveBeenCalledWith('user-1', expect.any(String));
    expect(result).toEqual(expect.objectContaining({
      accessToken: 'access-token',
      refreshToken: expect.any(String),
      user: {
        id: 'user-1',
        name: 'Test',
        role: 'ADMIN',
        tenantId: 'tenant-1',
        tenantName: 'TenantName',
      },
    }));
  });
});
