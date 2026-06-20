import { Injectable } from '@nestjs/common';
import { HealthRepository } from '../repositories/health.repository';

@Injectable()
export class HealthService {
  constructor(private healthRepository: HealthRepository) {}

  async check() {
    try {
      await this.healthRepository.checkDatabaseConnection();
      return { status: 'ok', database: 'connected' };
    } catch (error) {
      return { status: 'error', database: 'disconnected' };
    }
  }
}
