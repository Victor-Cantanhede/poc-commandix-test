import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from '../../../core/auth/decorators';
import { LoginDto, RefreshDto } from '../dtos/auth.dto';
import { OnboardingDto } from '../../tenant/dtos/tenant.dto';
import { CreateTenantUseCase } from '../../tenant/application/use-cases/create-tenant.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private createTenantUseCase: CreateTenantUseCase,
    private loginUseCase: LoginUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Public()
  @Post('onboarding')
  async onboarding(@Body() body: OnboardingDto) {
    return this.createTenantUseCase.execute(body);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.loginUseCase.execute(body);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() body: RefreshDto) {
    return this.refreshTokenUseCase.execute(body.refreshToken);
  }
}
