import { PrismaClient, Role, ContractStatus, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed process...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // --- TENANT 1: TechCorp ---
  const tenant1 = await prisma.tenant.create({
    data: {
      name: 'TechCorp',
    },
  });

  const t1Admin = await prisma.user.create({
    data: {
      tenantId: tenant1.id,
      name: 'Admin TechCorp',
      email: 'admin@techcorp.com',
      passwordHash,
      role: Role.ADMIN,
      isOwner: true,
    },
  });

  const t1Viewer = await prisma.user.create({
    data: {
      tenantId: tenant1.id,
      name: 'Viewer TechCorp',
      email: 'viewer@techcorp.com',
      passwordHash,
      role: Role.VIEWER,
      isOwner: false,
    },
  });

  // Create Template for Tenant 1
  const t1Template = await prisma.template.create({
    data: {
      tenantId: tenant1.id,
      schema: [
        { name: 'clientName', type: 'text', required: true },
        { name: 'amount', type: 'number', required: true },
        { name: 'startDate', type: 'date', required: true },
        { name: 'isActive', type: 'boolean', required: false },
      ],
    },
  });

  // Create 5 Contracts for Tenant 1
  const contractsData = [
    { clientName: 'Google', amount: 50000, startDate: '2026-07-01', isActive: true },
    { clientName: 'Microsoft', amount: 75000, startDate: '2026-08-15', isActive: true },
    { clientName: 'Amazon', amount: 120000, startDate: '2026-09-01', isActive: false },
    { clientName: 'Apple', amount: 90000, startDate: '2026-10-10', isActive: true },
    { clientName: 'Meta', amount: 45000, startDate: '2026-11-20', isActive: false },
  ];

  for (const [index, payload] of contractsData.entries()) {
    await prisma.contract.create({
      data: {
        tenantId: tenant1.id,
        status: index % 2 === 0 ? ContractStatus.ACTIVE : ContractStatus.DRAFT,
        templateSnapshot: t1Template.schema as Prisma.InputJsonValue,
        payload: payload as Prisma.InputJsonValue,
      },
    });
  }

  // --- TENANT 2: GlobalLogistics ---
  const tenant2 = await prisma.tenant.create({
    data: {
      name: 'GlobalLogistics',
    },
  });

  const t2Admin = await prisma.user.create({
    data: {
      tenantId: tenant2.id,
      name: 'Admin Global',
      email: 'admin@globallog.com',
      passwordHash,
      role: Role.ADMIN,
      isOwner: true,
    },
  });

  console.log('✅ Seed process completed successfully!');
  console.log('Test credentials:');
  console.log(`- ${t1Admin.email} / password123 (Admin TechCorp)`);
  console.log(`- ${t1Viewer.email} / password123 (Viewer TechCorp)`);
  console.log(`- ${t2Admin.email} / password123 (Admin GlobalLog)`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
