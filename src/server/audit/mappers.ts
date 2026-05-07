import type { Audit, AuditTool, PrimaryUseCase as PrismaPrimaryUseCase } from "@prisma/client";

import type { AuditCreateInput } from "@/schemas/audit";
import type { AuditDto } from "@/types/api";

const prismaUseCaseMap: Record<AuditCreateInput["primaryUseCase"], PrismaPrimaryUseCase> = {
  coding: "CODING",
  writing: "WRITING",
  research: "RESEARCH",
  "data-analysis": "DATA_ANALYSIS",
  mixed: "MIXED",
};

const apiUseCaseMap: Record<PrismaPrimaryUseCase, AuditCreateInput["primaryUseCase"]> = {
  CODING: "coding",
  WRITING: "writing",
  RESEARCH: "research",
  DATA_ANALYSIS: "data-analysis",
  MIXED: "mixed",
};

export function toPrismaUseCase(useCase: AuditCreateInput["primaryUseCase"]) {
  return prismaUseCaseMap[useCase];
}

export function toAuditDto(audit: Audit & { tools: AuditTool[] }): AuditDto {
  return {
    id: audit.id,
    createdAt: audit.createdAt.toISOString(),
    updatedAt: audit.updatedAt.toISOString(),
    totalSpend: Number(audit.totalSpend),
    estimatedSavings: Number(audit.estimatedSavings),
    teamSize: audit.teamSize,
    primaryUseCase: apiUseCaseMap[audit.primaryUseCase],
    shareSlug: audit.shareSlug,
    tools: audit.tools.map((tool) => ({
      id: tool.id,
      toolName: tool.toolName,
      planName: tool.planName,
      monthlySpend: Number(tool.monthlySpend),
      seats: tool.seats,
    })),
  };
}
