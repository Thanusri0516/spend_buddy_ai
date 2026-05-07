-- CreateEnum
CREATE TYPE "PrimaryUseCase" AS ENUM ('CODING', 'WRITING', 'RESEARCH', 'DATA_ANALYSIS', 'MIXED');

-- CreateTable
CREATE TABLE "Audit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "totalSpend" DECIMAL(12,2) NOT NULL,
    "estimatedSavings" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "teamSize" INTEGER NOT NULL,
    "primaryUseCase" "PrimaryUseCase" NOT NULL,
    "shareSlug" TEXT,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditTool" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "auditId" TEXT NOT NULL,
    "toolName" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "monthlySpend" DECIMAL(12,2) NOT NULL,
    "seats" INTEGER NOT NULL,

    CONSTRAINT "AuditTool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "auditId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Audit_shareSlug_key" ON "Audit"("shareSlug");

-- CreateIndex
CREATE INDEX "Audit_createdAt_idx" ON "Audit"("createdAt");

-- CreateIndex
CREATE INDEX "AuditTool_auditId_idx" ON "AuditTool"("auditId");

-- CreateIndex
CREATE INDEX "AuditTool_toolName_idx" ON "AuditTool"("toolName");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_auditId_key" ON "Lead"("auditId");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- AddForeignKey
ALTER TABLE "AuditTool" ADD CONSTRAINT "AuditTool_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
