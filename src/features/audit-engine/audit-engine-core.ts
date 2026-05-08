import type { AuditInput, AuditResult, Recommendation } from "./types";

const TOOL_LABELS: Record<string, string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  cursor: "Cursor",
  "github-copilot": "GitHub Copilot",
  gemini: "Gemini",
  windsurf: "Windsurf",
  "openai-api": "OpenAI API",
  "anthropic-api": "Anthropic API",
};

function getToolLabel(toolId: string) {
  return TOOL_LABELS[toolId] ?? toolId;
}

function getSummary(totalMonthlySavings: number) {
  if (totalMonthlySavings < 100) {
    return "Your AI stack already appears relatively cost-efficient for your current team size and workflow.";
  }

  if (totalMonthlySavings > 500) {
    return "Your organization may significantly reduce recurring AI infrastructure costs through plan optimization and workload consolidation.";
  }

  return "Your stack contains several opportunities for optimization.";
}

export function generateAuditSync(input: AuditInput): AuditResult {
  const { tools, teamSize, useCase } = input;

  const recommendations: Recommendation[] = [];
  let totalCurrentSpend = 0;
  let totalOptimizedSpend = 0;

  for (const tool of tools) {
    totalCurrentSpend += tool.monthlySpend;
  }

  for (const tool of tools) {
    const { toolId, plan, monthlySpend, seats } = tool;
    let optimizedSpend = monthlySpend;
    const displayName = getToolLabel(toolId);

    if (toolId === "chatgpt" && plan === "Team" && teamSize <= 2) {
      optimizedSpend = seats * 20;
      recommendations.push({
        tool: displayName,
        currentPlan: plan,
        recommendedPlan: "Plus",
        currentSpend: monthlySpend,
        optimizedSpend,
        monthlySavings: monthlySpend - optimizedSpend,
        annualSavings: (monthlySpend - optimizedSpend) * 12,
        reason: "Team collaboration features appear unnecessary for a small team.",
        type: "downgrade",
      });
    }

    if (toolId === "chatgpt" && plan === "Enterprise" && teamSize <= 20) {
      optimizedSpend = seats * 30;
      recommendations.push({
        tool: displayName,
        currentPlan: plan,
        recommendedPlan: "Team",
        currentSpend: monthlySpend,
        optimizedSpend,
        monthlySavings: monthlySpend - optimizedSpend,
        annualSavings: (monthlySpend - optimizedSpend) * 12,
        reason: "Enterprise features are often overkill for small teams. Team is a more appropriate plan tier.",
        type: "downgrade",
      });
    }

    if (toolId === "claude" && plan === "Enterprise" && teamSize < 20) {
      optimizedSpend = seats * 30;
      recommendations.push({
        tool: displayName,
        currentPlan: plan,
        recommendedPlan: "Team",
        currentSpend: monthlySpend,
        optimizedSpend,
        monthlySavings: monthlySpend - optimizedSpend,
        annualSavings: (monthlySpend - optimizedSpend) * 12,
        reason: "Enterprise collaboration features may exceed your current operational requirements.",
        type: "downgrade",
      });
    }

    if (toolId === "cursor" && plan === "Business" && teamSize < 5) {
      optimizedSpend = seats * 20;
      recommendations.push({
        tool: displayName,
        currentPlan: plan,
        recommendedPlan: "Pro",
        currentSpend: monthlySpend,
        optimizedSpend,
        monthlySavings: monthlySpend - optimizedSpend,
        annualSavings: (monthlySpend - optimizedSpend) * 12,
        reason: "Business-tier collaboration features may be underutilized for smaller engineering teams.",
        type: "downgrade",
      });
    }

    if (toolId === "github-copilot" && plan === "Enterprise" && teamSize < 10) {
      optimizedSpend = seats * 19;
      recommendations.push({
        tool: displayName,
        currentPlan: plan,
        recommendedPlan: "Business",
        currentSpend: monthlySpend,
        optimizedSpend,
        monthlySavings: monthlySpend - optimizedSpend,
        annualSavings: (monthlySpend - optimizedSpend) * 12,
        reason: "Enterprise governance capabilities may be unnecessary for your current scale.",
        type: "downgrade",
      });
    }

    if (toolId === "gemini" && plan === "Workspace" && teamSize < 5) {
      optimizedSpend = seats * 20;
      recommendations.push({
        tool: displayName,
        currentPlan: plan,
        recommendedPlan: "Advanced",
        currentSpend: monthlySpend,
        optimizedSpend,
        monthlySavings: monthlySpend - optimizedSpend,
        annualSavings: (monthlySpend - optimizedSpend) * 12,
        reason: "Workspace-level collaboration may be more than needed for a small research or product team.",
        type: "downgrade",
      });
    }

    if (toolId === "windsurf" && plan === "Teams" && teamSize < 5) {
      optimizedSpend = seats * 15;
      recommendations.push({
        tool: displayName,
        currentPlan: plan,
        recommendedPlan: "Pro",
        currentSpend: monthlySpend,
        optimizedSpend,
        monthlySavings: monthlySpend - optimizedSpend,
        annualSavings: (monthlySpend - optimizedSpend) * 12,
        reason: "Team-focused features may not justify additional costs at your current scale.",
        type: "downgrade",
      });
    }

    if (useCase === "writing" && ["cursor", "github-copilot", "windsurf"].includes(toolId)) {
      recommendations.push({
        tool: displayName,
        currentPlan: plan,
        recommendedPlan: "Evaluate necessity",
        currentSpend: monthlySpend,
        optimizedSpend: monthlySpend * 0.7,
        monthlySavings: monthlySpend * 0.3,
        annualSavings: monthlySpend * 0.3 * 12,
        reason: "Engineering-focused tooling may not align with your reported workflow.",
        type: "optimization",
      });
    }

    if (useCase === "research" && ["Free", "Plus"].includes(plan)) {
      recommendations.push({
        tool: displayName,
        currentPlan: plan,
        recommendedPlan: "Higher reasoning tier",
        currentSpend: monthlySpend,
        optimizedSpend: monthlySpend + 20,
        monthlySavings: 0,
        annualSavings: 0,
        reason: "Research workflows often benefit from larger context windows and advanced reasoning capabilities.",
        type: "upgrade",
      });
    }

    if (seats > teamSize) {
      const extraSeats = seats - teamSize;
      const savingsPerSeat = monthlySpend / seats;
      recommendations.push({
        tool: displayName,
        currentPlan: plan,
        recommendedPlan: "Reduce unused seats",
        currentSpend: monthlySpend,
        optimizedSpend: monthlySpend - extraSeats * savingsPerSeat,
        monthlySavings: extraSeats * savingsPerSeat,
        annualSavings: extraSeats * savingsPerSeat * 12,
        reason: "Your subscription count exceeds your reported team size.",
        type: "seat-optimization",
      });
    }

    totalOptimizedSpend += optimizedSpend;
  }

  const hasCursor = tools.some((t) => t.toolId === "cursor");
  const hasCopilot = tools.some((t) => t.toolId === "github-copilot");
  const hasWindsurf = tools.some((t) => t.toolId === "windsurf");
  const codingToolCount = [hasCursor, hasCopilot, hasWindsurf].filter(Boolean).length;

  if (useCase === "coding" && codingToolCount >= 2) {
    recommendations.push({
      tool: "Coding Stack",
      currentPlan: "Multiple coding assistants",
      recommendedPlan: "Consolidate tooling",
      currentSpend: 0,
      optimizedSpend: 0,
      monthlySavings: 20,
      annualSavings: 240,
      reason: "Your coding stack contains overlapping AI development assistants.",
      type: "consolidation",
    });
    totalOptimizedSpend -= 20;
  }

  for (const tool of tools) {
    if (tool.toolId === "openai-api" && tool.monthlySpend > 500) {
      recommendations.push({
        tool: "OpenAI API",
        currentPlan: "Usage-based",
        recommendedPlan: "Discounted infrastructure credits",
        currentSpend: tool.monthlySpend,
        optimizedSpend: tool.monthlySpend * 0.8,
        monthlySavings: tool.monthlySpend * 0.2,
        annualSavings: tool.monthlySpend * 0.2 * 12,
        reason: "High-volume inference workloads may benefit from negotiated infrastructure pricing.",
        type: "credits",
      });
      totalOptimizedSpend -= tool.monthlySpend * 0.2;
    }

    if (tool.toolId === "anthropic-api" && tool.monthlySpend > 400) {
      recommendations.push({
        tool: "Anthropic API",
        currentPlan: "Usage-based",
        recommendedPlan: "Blended model routing",
        currentSpend: tool.monthlySpend,
        optimizedSpend: tool.monthlySpend * 0.85,
        monthlySavings: tool.monthlySpend * 0.15,
        annualSavings: tool.monthlySpend * 0.15 * 12,
        reason: "Model routing strategies may reduce unnecessary high-cost inference usage.",
        type: "optimization",
      });
      totalOptimizedSpend -= tool.monthlySpend * 0.15;
    }
  }

  const totalMonthlySavings = totalCurrentSpend - totalOptimizedSpend;
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    totalCurrentSpend,
    totalOptimizedSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    recommendations,
    summary: getSummary(totalMonthlySavings),
  };
}
