import { describe, expect, it } from "vitest";

import { auditCreateInputSchema } from "@/schemas/audit";
import { sampleAuditInput } from "@/features/audit/mock-audit";

describe("auditCreateInputSchema", () => {
  it("accepts a valid multi-tool audit", () => {
    expect(auditCreateInputSchema.safeParse(sampleAuditInput).success).toBe(true);
  });

  it("requires positive monthly spend", () => {
    const result = auditCreateInputSchema.safeParse({
      ...sampleAuditInput,
      tools: [{ ...sampleAuditInput.tools[0], monthlySpend: 0 }],
    });

    expect(result.success).toBe(false);
  });

  it("requires at least one tool", () => {
    expect(auditCreateInputSchema.safeParse({ ...sampleAuditInput, tools: [] }).success).toBe(false);
  });
});
