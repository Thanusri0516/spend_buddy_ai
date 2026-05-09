import type {
  AuditInput,
  AuditReport,
  RecommendationKind,
  ToolRecommendation,
} from "@/types/audit";
import { generateAuditSync } from "../audit-engine/audit-engine-core";
import type { AuditInput as NewAuditInput, Recommendation } from "../audit-engine/types";

function buildGeneratedSummary(input: AuditInput, summary: AuditReport["summary"], recommendations: ToolRecommendation[]) {
  const toolCount = input.tools.length;
  const top = [...recommendations]
    .filter((rec) => (rec.estimatedMonthlySavings ?? 0) > 0)
    .sort((a, b) => (b.estimatedMonthlySavings ?? 0) - (a.estimatedMonthlySavings ?? 0))
    .slice(0, 2);

  const base = [
    `You're currently spending about ${formatCurrency(summary.currentMonthlySpend)} per month across ${toolCount} tool${
      toolCount === 1 ? "" : "s"
    } for a team of ${input.teamSize}.`,
    `An optimized setup would be around ${formatCurrency(summary.optimizedMonthlySpend)}/month — a potential savings of ${formatCurrency(
      summary.monthlySavings
    )}/month (${formatCurrency(summary.annualSavings)}/year).`,
  ];

  if (top.length > 0) {
    base.push(
      `Top opportunities: ${top
        .map((rec) => `${rec.toolName} (${formatCurrency(rec.estimatedMonthlySavings)}/mo)`)
        .join(", ")}.`
    );
  } else {
    base.push("No high-impact savings opportunities were detected based on the current inputs.");
  }

  return base.join(" ");
}

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
  const normalizedMonthlySavings = Math.max(0, totalMonthlySavings);
  const optimizedMonthlySpend = Math.max(0, baseResult.totalCurrentSpend - normalizedMonthlySavings);

  const recommendations: ToolRecommendation[] = allRecs.map((rec, i) => ({
    id: `rec-${i}`,
    toolName: rec.tool,
    currentPlan: rec.currentPlan,
    kind: rec.type as RecommendationKind,
    action: rec.recommendedPlan,
    estimatedMonthlySavings: rec.monthlySavings ?? 0,
    reasoning: rec.reason,
  }));

  const summary: AuditReport["summary"] = {
    currentMonthlySpend: baseResult.totalCurrentSpend,
    optimizedMonthlySpend,
    monthlySavings: normalizedMonthlySavings,
    annualSavings: normalizedMonthlySavings * 12,
  };

  return {
    id,
    input,
    recommendations,
    summary,
    generatedSummary: buildGeneratedSummary(input, summary, recommendations),
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
    estimatedMonthlySavings: rec.monthlySavings ?? 0,
    reasoning: rec.reason,
  }));

  const summary: AuditReport["summary"] = {
    currentMonthlySpend: auditResult.totalCurrentSpend,
    optimizedMonthlySpend: Math.max(0, auditResult.totalOptimizedSpend),
    monthlySavings: Math.max(0, auditResult.totalMonthlySavings),
    annualSavings: Math.max(0, auditResult.totalAnnualSavings),
  };

  return {
    id,
    input,
    recommendations,
    summary,
    generatedSummary: buildGeneratedSummary(input, summary, recommendations),
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
