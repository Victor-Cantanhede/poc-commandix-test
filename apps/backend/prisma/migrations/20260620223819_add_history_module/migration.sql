-- CreateTable
CREATE TABLE "ContractHistory" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "field" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContractHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContractHistory_tenantId_idx" ON "ContractHistory"("tenantId");

-- CreateIndex
CREATE INDEX "ContractHistory_contractId_idx" ON "ContractHistory"("contractId");

-- AddForeignKey
ALTER TABLE "ContractHistory" ADD CONSTRAINT "ContractHistory_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractHistory" ADD CONSTRAINT "ContractHistory_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractHistory" ADD CONSTRAINT "ContractHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
