import type {
  AuditInput,
  AuditReport,
  RecommendationKind,
  ToolRecommendation,
} from "@/types/audit";
import { generateAuditSync } from "../audit-engine/audit-engine-core";
import type { AuditInput as NewAuditInput, Recommendation } from "../audit-engine/types";

export async function buildAuditReport(input: AuditInput, id = "sample-audit"): Promise<AuditReport> {
  const newInput: NewAuditInput = {
    tools: input.tools.map((tool) => ({
      toolId: tool.toolId,
      plan: tool.plan,
      monthlySpend: tool.monthlySpend,
      seats: tool.seats,
    })),
    teamSize: input.teamSize,
    useCase: input.primaryUseCase === "data-analysis" ? "data" : input.primaryUseCase,
  };

  const baseResult = generateAuditSync(newInput);

  // Call server-side route instead of Grok directly
  let aiRecommendations: Recommendation[] = [];
  try {
    const baseUrl = typeof window !== "undefined" ? "" : process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/audit/ai-recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newInput),
    });

    // Use text() first to guard against empty body
    const text = await res.text();
    if (text && text.trim().length > 0) {
      const data = JSON.parse(text);
      aiRecommendations = data.recommendations ?? [];
    } else {
      console.warn("AI recommendations API returned empty body");
    }
  } catch (e) {
    console.error("Failed to fetch AI recommendations:", e);
  }

  const allRecs = [...baseResult.recommendations, ...aiRecommendations];
  const extraSavings = aiRecommendations.reduce((s, r) => s + (r.monthlySavings ?? 0), 0);
  const totalMonthlySavings = baseResult.totalMonthlySavings + extraSavings;

  return {
    id,
    input,
    recommendations: allRecs.map((rec, i) => ({
      id: `rec-${i}`,
      toolName: rec.tool,
      currentPlan: rec.currentPlan,
      kind: rec.type as RecommendationKind,
      action: rec.recommendedPlan,
      estimatedMonthlySavings: rec.monthlySavings,
      reasoning: rec.reason,
    })),
    summary: {
      currentMonthlySpend: baseResult.totalCurrentSpend,
      optimizedMonthlySpend: baseResult.totalCurrentSpend - totalMonthlySavings,
      monthlySavings: totalMonthlySavings,
      annualSavings: totalMonthlySavings * 12,
    },
    generatedSummary: baseResult.summary,
  };
}

export function buildAuditReportSync(input: AuditInput, id = "sample-audit"): AuditReport {
  const newInput: NewAuditInput = {
    tools: input.tools.map((tool) => ({
      toolId: tool.toolId,
      plan: tool.plan,
      monthlySpend: tool.monthlySpend,
      seats: tool.seats,
    })),
    teamSize: input.teamSize,
    useCase: input.primaryUseCase === "data-analysis" ? "data" : input.primaryUseCase,
  };

  const auditResult = generateAuditSync(newInput);

  const recommendations: ToolRecommendation[] = auditResult.recommendations.map((rec, index) => ({
    id: `rec-${index}`,
    toolName: rec.tool,
    currentPlan: rec.currentPlan,
    kind: rec.type as RecommendationKind,
    action: rec.recommendedPlan,
    estimatedMonthlySavings: rec.monthlySavings,
    reasoning: rec.reason,
  }));

  return {
    id,
    input,
    recommendations,
    summary: {
      currentMonthlySpend: auditResult.totalCurrentSpend,
      optimizedMonthlySpend: auditResult.totalOptimizedSpend,
      monthlySavings: auditResult.totalMonthlySavings,
      annualSavings: auditResult.totalAnnualSavings,
    },
    generatedSummary: auditResult.summary,
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}