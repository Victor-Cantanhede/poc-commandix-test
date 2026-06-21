import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Deletes all records from all tables to ensure isolation between tests
  const tableNames = [
    'ContractHistory',
    'Contract',
    'Template',
    'User',
    'Tenant',
  ];

  try {
    for (const tableName of tableNames) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" CASCADE;`);
    }
  } catch (error) {
    console.error('Failed to clean test database:', error);
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});
