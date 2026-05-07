import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { auditRouteParamsSchema } from "@/schemas/audit";
import { getAuditById } from "@/server/audit/repository";
import type { GetAuditResponse } from "@/types/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const parsedParams = auditRouteParamsSchema.parse(await params);
    const audit = await getAuditById(parsedParams.id);

    if (!audit) {
      return NextResponse.json<GetAuditResponse>(
        {
          ok: false,
          code: "NOT_FOUND",
          message: "Audit not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json<GetAuditResponse>({
      ok: true,
      audit,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json<GetAuditResponse>(
        {
          ok: false,
          code: "VALIDATION_ERROR",
          message: "Audit id is invalid.",
          fieldErrors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json<GetAuditResponse>(
      {
        ok: false,
        code: "SERVER_ERROR",
        message: "Unable to fetch audit.",
      },
      { status: 500 },
    );
  }
}
