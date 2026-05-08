import { NextResponse } from "next/server";
import { getAuditById } from "@/server/audit/repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          ok: false,
          code: "VALIDATION_ERROR" as const,
          message: "Audit ID is required",
        },
        { status: 400 }
      );
    }

    const audit = await getAuditById(id);

    if (!audit) {
      return NextResponse.json(
        {
          ok: false,
          code: "NOT_FOUND" as const,
          message: "Audit not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        audit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get audit error:", error);
    return NextResponse.json(
      {
        ok: false,
        code: "SERVER_ERROR" as const,
        message: "Failed to retrieve audit",
      },
      { status: 500 }
    );
  }
}