import type { AuditCreateInput } from "@/schemas/audit";
import type { CreateAuditResponse, GetAuditResponse } from "@/types/api";

export async function createAuditRequest(input: AuditCreateInput): Promise<CreateAuditResponse> {
  const response = await fetch("/api/audit/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return response.json() as Promise<CreateAuditResponse>;
}

export async function getAuditRequest(id: string): Promise<GetAuditResponse> {
  const response = await fetch(`/api/audit/${id}`);

  return response.json() as Promise<GetAuditResponse>;
}
