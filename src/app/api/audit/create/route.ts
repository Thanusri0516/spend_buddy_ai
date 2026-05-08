import { NextResponse } from "next/server";
import { createAudit } from "@/server/audit/repository";
import { auditInputSchema } from "@/features/audit/audit-schema";

export async function POST(request: Request) {
  try {
    const input = await request.json();

    // Validate the input
    const parseResult = auditInputSchema.safeParse(input);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          code: "VALIDATION_ERROR" as const,
          message: "Invalid audit input",
          fieldErrors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Create the audit in the database
    const audit = await createAudit(parseResult.data);

    return NextResponse.json(
      {
        ok: true,
        auditId: audit.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Create audit error:", error);
    return NextResponse.json(
      {
        ok: false,
        code: "SERVER_ERROR" as const,
        message: "Failed to create audit",
      },
      { status: 500 }
    );
  }
}