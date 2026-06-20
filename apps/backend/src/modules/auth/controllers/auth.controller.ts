import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Public } from '../../../core/auth/decorators';
import { LoginDto, RefreshDto } from '../dtos/auth.dto';
import { OnboardingDto } from '../../tenant/dtos/tenant.dto';
import { CreateTenantUseCase } from '../../tenant/application/use-cases/create-tenant.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private createTenantUseCase: CreateTenantUseCase,
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
    return this.authService.login(body);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() body: RefreshDto) {
    return this.authService.refreshToken(body.refreshToken);
  }
}
