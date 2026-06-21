import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../../app.module';
import { PrismaService } from '../../../../core/prisma/prisma.service';

describe('TenantModule (e2e) - Isolation & RBAC', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let tokenA: string;
  let adminAId: string;

  let tokenB: string;
  let adminBId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    prisma = app.get(PrismaService);
    await app.init();

    // Setup: Create Tenant A
    await request(app.getHttpServer()).post('/api/auth/onboarding').send({
      tenantName: 'Tenant A',
      userName: 'Admin A',
      email: 'adminA@test.com',
      password: 'Password123!',
    });
    const loginA = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: 'adminA@test.com',
      password: 'Password123!',
    });
    tokenA = loginA.body.accessToken;
    adminAId = loginA.body.user.id;

    // Setup: Create Tenant B
    await request(app.getHttpServer()).post('/api/auth/onboarding').send({
      tenantName: 'Tenant B',
      userName: 'Admin B',
      email: 'adminB@test.com',
      password: 'Password123!',
    });
    const loginB = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: 'adminB@test.com',
      password: 'Password123!',
    });
    tokenB = loginB.body.accessToken;
    adminBId = loginB.body.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Multi-Tenant Isolation', () => {
    it('Tenant A should only see users from Tenant A', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/tenants/me/users')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      // Verify that admin B is not in the list
      const users = response.body;
      expect(users.length).toBeGreaterThan(0);
      const foundAdminB = users.find((u: Record<string, unknown>) => u.email === 'adminB@test.com');
      expect(foundAdminB).toBeUndefined();
    });

    it('Tenant A should NOT be able to delete Admin B from Tenant B', async () => {
      // Even if Admin A tries to hit delete endpoint with Admin B's ID, it should fail (NotFound or Forbidden, handled implicitly by tenantId filter)
      const response = await request(app.getHttpServer())
        .delete(`/api/tenants/me/users/${adminBId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(404); // usually 404 because user is not found within Tenant A's scope
    });
  });

  describe('RBAC & Owner Protection', () => {
    it('Admin A should not be able to delete themselves (isOwner)', async () => {
      await request(app.getHttpServer())
        .delete(`/api/tenants/me/users/${adminAId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(403); // ForbiddenException
    });

    it('Admin A should not be able to downgrade themselves to VIEWER', async () => {
      await request(app.getHttpServer())
        .patch(`/api/tenants/me/users/${adminAId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ role: 'VIEWER' })
        .expect(403); // Cannot downgrade owner
    });
  });
});
