import { Prisma } from "@prisma/client";

import { getToolById } from "@/config/ai-tools";
import type { AuditCreateInput } from "@/schemas/audit";
import { prisma } from "@/server/db/prisma";
import { toAuditDto, toPrismaUseCase } from "@/server/audit/mappers";

export async function createAudit(input: AuditCreateInput) {
  const totalSpend = input.tools.reduce((sum, tool) => sum + tool.monthlySpend, 0);

  const audit = await prisma.audit.create({
    data: {
      totalSpend: new Prisma.Decimal(totalSpend),
      estimatedSavings: new Prisma.Decimal(0),
      teamSize: input.teamSize,
      primaryUseCase: toPrismaUseCase(input.primaryUseCase),
      tools: {
        create: input.tools.map((tool) => {
          const toolConfig = getToolById(tool.toolId);

          return {
            toolName: toolConfig.name,
            planName: tool.plan,
            monthlySpend: new Prisma.Decimal(tool.monthlySpend),
            seats: tool.seats,
          };
        }),
      },
    },
    include: {
      tools: true,
    },
  });

  return toAuditDto(audit);
}

export async function getAuditById(id: string) {
  const audit = await prisma.audit.findUnique({
    where: { id },
    include: {
      tools: true,
    },
  });

  return audit ? toAuditDto(audit) : null;
}
