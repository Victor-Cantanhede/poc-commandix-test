import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async execute(token: string) {
    const user = await this.authRepository.findUserByRefreshToken(token);
    if (!user) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const payload = { sub: user.id, tid: user.tenantId, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const newRefreshToken = crypto.randomBytes(32).toString('hex');
    await this.authRepository.updateRefreshToken(user.id, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
