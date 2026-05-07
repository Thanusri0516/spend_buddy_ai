import { z } from "zod";

import { AI_TOOL_IDS, PRIMARY_USE_CASE_IDS } from "@/config/ai-tools";

export const auditToolInputSchema = z.object({
  id: z.string().min(1),
  toolId: z.enum(AI_TOOL_IDS),
  plan: z.string().min(1, "Select a plan."),
  monthlySpend: z.coerce
    .number()
    .positive("Monthly spend must be greater than 0.")
    .max(250000, "Enter a realistic monthly spend."),
  seats: z.coerce.number().int().min(1, "Add at least one seat.").max(10000),
});

export const auditCreateInputSchema = z.object({
  teamSize: z.coerce.number().int().min(1, "Team size is required.").max(10000),
  primaryUseCase: z.enum(PRIMARY_USE_CASE_IDS),
  tools: z.array(auditToolInputSchema).min(1, "Add at least one AI tool.").max(24),
});

export const auditRouteParamsSchema = z.object({
  id: z.string().min(1),
});

export const leadCaptureSchema = z.object({
  email: z.string().email("Enter a valid work email."),
  companyName: z.string().min(2, "Company name is required.").max(80),
  role: z.string().min(2, "Role is required.").max(80),
});

export type AuditCreateInput = z.infer<typeof auditCreateInputSchema>;
export type AuditToolInput = z.infer<typeof auditToolInputSchema>;
export type LeadCaptureInput = z.infer<typeof leadCaptureSchema>;
