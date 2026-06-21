import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../../app.module';

describe('TemplateModule (e2e)', () => {
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
      tenantName: 'Template Test Tenant',
      userName: 'Template Admin',
      email: 'template-admin@test.com',
      password: 'Password123!',
    });
    tenantId = onboardRes.body.tenantId;

    const loginRes = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: 'template-admin@test.com',
      password: 'Password123!',
    });
    token = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/templates', () => {
    it('should return an empty template initially', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/templates')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.schema).toEqual([]);
    });
  });

  describe('PUT /api/templates', () => {
    it('should update the template with valid schema', async () => {
      const response = await request(app.getHttpServer())
        .put('/api/templates')
        .set('Authorization', `Bearer ${token}`)
        .send({
          schema: [
            { name: 'clientName', type: 'text', required: true },
            { name: 'age', type: 'number', required: false },
          ],
        })
        .expect(200);

      expect(response.body.schema).toHaveLength(2);
      expect(response.body.schema[0].name).toBe('clientName');
    });

    it('should throw 400 Bad Request if there are duplicate field names', async () => {
      await request(app.getHttpServer())
        .put('/api/templates')
        .set('Authorization', `Bearer ${token}`)
        .send({
          schema: [
            { name: 'duplicate', type: 'text', required: true },
            { name: 'duplicate', type: 'number', required: false },
          ],
        })
        .expect(400);
    });
  });
});
