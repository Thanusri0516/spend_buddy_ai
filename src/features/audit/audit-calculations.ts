import { getToolById } from "@/config/ai-tools";
import type {
  AuditInput,
  AuditReport,
  RecommendationKind,
  ToolRecommendation,
} from "@/types/audit";

const HIGH_PLAN_KEYWORDS = ["team", "business", "enterprise", "committed"];

function getRecommendationKind(plan: string, monthlySpend: number): RecommendationKind {
  const normalizedPlan = plan.toLowerCase();

  if (HIGH_PLAN_KEYWORDS.some((keyword) => normalizedPlan.includes(keyword))) {
    return "downgrade";
  }

  if (monthlySpend >= 300) {
    return "usage";
  }

  return "keep";
}

export function buildAuditReport(input: AuditInput, id = "sample-audit"): AuditReport {
  const recommendations: ToolRecommendation[] = input.tools.map((tool) => {
    const toolConfig = getToolById(tool.toolId);
    const kind = getRecommendationKind(tool.plan, tool.monthlySpend);
    const savingsRate = kind === "downgrade" ? 0.35 : kind === "usage" ? 0.2 : 0.05;
    const estimatedMonthlySavings = Math.round(tool.monthlySpend * savingsRate);

    return {
      id: tool.id,
      toolName: toolConfig.name,
      currentPlan: tool.plan,
      kind,
      action:
        kind === "downgrade"
          ? "Review plan tier and seat allocation"
          : kind === "usage"
            ? "Add usage alerts and monthly owner review"
            : "Keep current setup",
      estimatedMonthlySavings,
      reasoning:
        kind === "downgrade"
          ? `${toolConfig.name} ${tool.plan} may be more capacity than this team currently needs.`
          : kind === "usage"
            ? `${toolConfig.name} spend is high enough to benefit from alerts, limits, and owner checks.`
            : `${toolConfig.name} looks reasonable based on the current inputs.`,
    };
  });

  const currentMonthlySpend = input.tools.reduce((total, tool) => total + tool.monthlySpend, 0);
  const monthlySavings = recommendations.reduce(
    (total, item) => total + item.estimatedMonthlySavings,
    0,
  );
  const optimizedMonthlySpend = Math.max(0, currentMonthlySpend - monthlySavings);

  return {
    id,
    input,
    recommendations,
    summary: {
      currentMonthlySpend,
      optimizedMonthlySpend,
      monthlySavings,
      annualSavings: monthlySavings * 12,
    },
    generatedSummary:
      monthlySavings >= 500
        ? "Your AI stack shows meaningful optimization potential across plan tiers, seat ownership, and usage controls. A focused review could reduce recurring spend without slowing down the teams already getting value from these tools."
        : "Your AI stack appears relatively efficient from the current inputs. The best next step is to keep owner visibility high and revisit plan fit as team usage changes.",
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
