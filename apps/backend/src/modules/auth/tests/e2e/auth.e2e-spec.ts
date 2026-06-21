import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../../app.module';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/auth/onboarding (POST)', () => {
    it('should create a new tenant and user', async () => {
      const payload = {
        tenantName: 'E2E Tenant',
        userName: 'E2E Admin',
        email: 'admin@e2e.com',
        password: 'Password123!',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/onboarding')
        .send(payload)
        .expect(201);

      expect(response.body.message).toBe('Tenant and Admin created successfully');
      expect(response.body.tenantId).toBeDefined();
    });

    it('should fail with 400 when missing fields', async () => {
      const payload = {
        tenantName: 'E2E Tenant',
        // missing userName, email, password
      };

      await request(app.getHttpServer())
        .post('/api/auth/onboarding')
        .send(payload)
        .expect(400);
    });

    it('should fail with 409 if email already exists', async () => {
      const payload = {
        tenantName: 'E2E Tenant 2',
        userName: 'E2E Admin 2',
        email: 'admin@e2e.com', // same email
        password: 'Password123!',
      };

      // Create first
      await request(app.getHttpServer())
        .post('/api/auth/onboarding')
        .send(payload);

      // Try again
      await request(app.getHttpServer())
        .post('/api/auth/onboarding')
        .send(payload)
        .expect(409);
    });
  });

  describe('/api/auth/login (POST)', () => {
    it('should login and return tokens', async () => {
      const payload = {
        tenantName: 'Login Tenant',
        userName: 'Login Admin',
        email: 'login@e2e.com',
        password: 'Password123!',
      };

      await request(app.getHttpServer())
        .post('/api/auth/onboarding')
        .send(payload)
        .expect(201);

      const loginRes = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'login@e2e.com',
          password: 'Password123!',
        })
        .expect(200);

      expect(loginRes.body.accessToken).toBeDefined();
      expect(loginRes.body.refreshToken).toBeDefined();
      expect(loginRes.body.user.email).toBeUndefined(); // we shouldn't return email based on DTO
      expect(loginRes.body.user.id).toBeDefined();
    });

    it('should fail with 401 for wrong password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'login@e2e.com',
          password: 'WrongPassword!',
        })
        .expect(401);
    });
  });
});
