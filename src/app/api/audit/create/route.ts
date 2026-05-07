import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { auditCreateInputSchema } from "@/schemas/audit";
import { createAudit } from "@/server/audit/repository";
import type { CreateAuditResponse } from "@/types/api";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const input = auditCreateInputSchema.parse(body);
    const audit = await createAudit(input);

    return NextResponse.json<CreateAuditResponse>({
      ok: true,
      auditId: audit.id,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json<CreateAuditResponse>(
        {
          ok: false,
          code: "VALIDATION_ERROR",
          message: "Audit input is invalid.",
          fieldErrors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json<CreateAuditResponse>(
      {
        ok: false,
        code: "SERVER_ERROR",
        message: "Unable to create audit.",
      },
      { status: 500 },
    );
  }
}
