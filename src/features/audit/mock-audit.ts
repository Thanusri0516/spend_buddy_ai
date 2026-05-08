import type { AuditInput, AuditReport } from "@/types/audit";
import { buildAuditReport } from "./audit-calculations";

export const sampleAuditInput: AuditInput = {
  teamSize: 18,
  primaryUseCase: "coding",
  tools: [
    {
      id: "sample-chatgpt",
      toolId: "chatgpt",
      plan: "Team",
      monthlySpend: 720,
      seats: 18,
    },
    {
      id: "sample-cursor",
      toolId: "cursor",
      plan: "Business",
      monthlySpend: 640,
      seats: 16,
    },
    {
      id: "sample-openai",
      toolId: "openai-api",
      plan: "Usage-based",
      monthlySpend: 1100,
      seats: 3,
    },
  ],
};

export const sampleAuditReport: Promise<AuditReport> = buildAuditReport(sampleAuditInput, "public-sample");
