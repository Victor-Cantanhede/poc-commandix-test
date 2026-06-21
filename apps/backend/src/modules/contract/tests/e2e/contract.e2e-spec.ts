import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../../app.module';

describe('ContractModule (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let tenantId: string;

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
      tenantName: 'Contract Test Tenant',
      userName: 'Contract Admin',
      email: 'contract-admin@test.com',
      password: 'Password123!',
    });
    
    tenantId = onboardRes.body.tenantId;

    const loginRes = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: 'contract-admin@test.com',
      password: 'Password123!',
    });
    token = loginRes.body.accessToken;

    // Seed a basic template for this tenant so we can test dynamic payload validation
    await request(app.getHttpServer())
      .put('/api/templates')
      .set('Authorization', `Bearer ${token}`)
      .send({
        schema: [
          { name: 'clientName', type: 'text', required: true },
          { name: 'contractValue', type: 'number', required: false },
        ],
      })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Contract Creation & Validation', () => {
    it('should fail (400) if required payload field is missing', async () => {
      await request(app.getHttpServer())
        .post('/api/contracts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          payload: {
            contractValue: 1000,
            // missing clientName
          },
        })
        .expect(400);
    });

    it('should fail (400) if payload field type is invalid (expected number, got text)', async () => {
      await request(app.getHttpServer())
        .post('/api/contracts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          payload: {
            clientName: 'Acme Corp',
            contractValue: 'mil reais', // should be number
          },
        })
        .expect(400);
    });

    it('should create contract (201) if payload is valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contracts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          payload: {
            clientName: 'Valid Client LLC',
            contractValue: 5000,
          },
        })
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.payload.clientName).toBe('Valid Client LLC');
      expect(response.body.status).toBe('DRAFT');
    });
  });

  describe('Contract JSON Search & Filters', () => {
    beforeAll(async () => {
      // Create some contracts to search
      await request(app.getHttpServer())
        .post('/api/contracts')
        .set('Authorization', `Bearer ${token}`)
        .send({ payload: { clientName: 'Apple Inc', contractValue: 9999 } });

      await request(app.getHttpServer())
        .post('/api/contracts')
        .set('Authorization', `Bearer ${token}`)
        .send({ payload: { clientName: 'Microsoft Corp', contractValue: 8888 } });
    });

    it('should find contract by partial JSON text search (native Prisma)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/contracts?search=Apple')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const contracts = response.body.data;
      expect(contracts.length).toBeGreaterThan(0);
      expect(contracts[0].payload.clientName).toContain('Apple');
      
      // Should not contain Microsoft
      const foundMicrosoft = contracts.find((c: Record<string, unknown>) => (c.payload as Record<string, unknown>).clientName?.toString().includes('Microsoft'));
      expect(foundMicrosoft).toBeUndefined();
    });
  });
});
