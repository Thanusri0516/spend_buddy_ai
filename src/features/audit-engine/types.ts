export type RecommendationType =
  | "downgrade"
  | "upgrade"
  | "optimization"
  | "seat-optimization"
  | "consolidation"
  | "credits";

export type Recommendation = {
  tool: string;
  currentPlan: string;
  recommendedPlan: string;
  currentSpend: number;
  optimizedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  type: RecommendationType;
};

export type ToolInput = {
  toolId: string;
  plan: string;
  monthlySpend: number;
  seats: number;
};

export type AuditInput = {
  tools: ToolInput[];
  teamSize: number;
  useCase:
    | "coding"
    | "writing"
    | "research"
    | "data"
    | "mixed";
};

export type AuditResult = {
  totalCurrentSpend: number;
  totalOptimizedSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  recommendations: Recommendation[];
  summary: string;
};