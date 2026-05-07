import type { AuditCreateInput } from "@/schemas/audit";

export type ApiErrorCode = "VALIDATION_ERROR" | "NOT_FOUND" | "SERVER_ERROR";

export interface ApiErrorResponse {
  ok: false;
  code: ApiErrorCode;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export interface AuditToolDto {
  id: string;
  toolName: string;
  planName: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  totalSpend: number;
  estimatedSavings: number;
  teamSize: number;
  primaryUseCase: AuditCreateInput["primaryUseCase"];
  shareSlug: string | null;
  tools: AuditToolDto[];
}

export interface CreateAuditSuccessResponse {
  ok: true;
  auditId: string;
}

export interface GetAuditSuccessResponse {
  ok: true;
  audit: AuditDto;
}

export type CreateAuditResponse = CreateAuditSuccessResponse | ApiErrorResponse;
export type GetAuditResponse = GetAuditSuccessResponse | ApiErrorResponse;
