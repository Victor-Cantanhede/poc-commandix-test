import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../../app.module';

describe('HistoryModule (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let tenantId: string;
  let contractId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();

    // Onboard and Login to get token
    const onboardRes = await request(app.getHttpServer()).post('/api/auth/onboarding').send({
      tenantName: 'History Test Tenant',
      userName: 'History Admin',
      email: 'history-admin@test.com',
      password: 'Password123!',
    });
    tenantId = onboardRes.body.tenantId;

    const loginRes = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: 'history-admin@test.com',
      password: 'Password123!',
    });
    token = loginRes.body.accessToken;

    // Seed a basic template so we can create a contract
    await request(app.getHttpServer())
      .put('/api/templates')
      .set('Authorization', `Bearer ${token}`)
      .send({
        schema: [
          { name: 'clientName', type: 'text', required: true },
        ],
      });

    // Create a contract (this automatically logs a 'CREATED' history action)
    const contractRes = await request(app.getHttpServer())
      .post('/api/contracts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        payload: {
          clientName: 'History Client',
        },
      });
    
    contractId = contractRes.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/contracts/:contractId/history', () => {
    it('should return the history of actions for the given contract', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contracts/${contractId}/history`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
      
      const creationLog = response.body.find((log: Record<string, unknown>) => log.action === 'CREATED');
      expect(creationLog).toBeDefined();
    });

    it('should log a new action when a contract is updated', async () => {
      // Update the contract
      await request(app.getHttpServer())
        .patch(`/api/contracts/${contractId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          payload: {
            clientName: 'Updated History Client',
          },
        })
        .expect(200);

      // Fetch history again
      const response = await request(app.getHttpServer())
        .get(`/api/contracts/${contractId}/history`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const updateLog = response.body.find((log: Record<string, unknown>) => log.action === 'UPDATED_FIELD');
      expect(updateLog).toBeDefined();
      expect(updateLog.field).toBe('clientName');
      expect(updateLog.newValue).toBe('Updated History Client');
      expect(updateLog.oldValue).toBe('History Client');
    });
  });
});
