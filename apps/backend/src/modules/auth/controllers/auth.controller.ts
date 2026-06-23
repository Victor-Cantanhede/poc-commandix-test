import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../../core/auth/decorators';
import { LoginDto, RefreshDto } from '../dtos/auth.dto';
import { OnboardingDto } from '../../tenant/dtos/tenant.dto';
import { CreateTenantUseCase } from '../../tenant/application/use-cases/create-tenant.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token.use-case';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private createTenantUseCase: CreateTenantUseCase,
    private loginUseCase: LoginUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Public()
  @Post('onboarding')
  @ApiOperation({ summary: 'Criar um novo tenant e usuário administrador' })
  @ApiResponse({ status: 201, description: 'Tenant e usuário criados com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou e-mail já em uso.' })
  async onboarding(@Body() body: OnboardingDto) {
    return this.createTenantUseCase.execute(body);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Realizar login' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso. Retorna tokens de acesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() body: LoginDto) {
    return this.loginUseCase.execute(body);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Renovar o token de acesso' })
  @ApiResponse({ status: 200, description: 'Token renovado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido ou expirado.' })
  async refresh(@Body() body: RefreshDto) {
    return this.refreshTokenUseCase.execute(body.refreshToken);
  }
}
