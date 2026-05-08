export type AiToolId =
  | "chatgpt"
  | "claude"
  | "cursor"
  | "github-copilot"
  | "gemini"
  | "openai-api"
  | "anthropic-api"
  | "windsurf";

export type PrimaryUseCase = "coding" | "writing" | "research" | "data-analysis" | "mixed";

export interface AiToolOption {
  id: AiToolId;
  name: string;
  category: "chat" | "coding" | "api" | "research";
  plans: string[];
}

export interface AuditToolInput {
  id: string;
  toolId: AiToolId;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
  tools: AuditToolInput[];
}

export interface SavingsSummary {
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
}

export type RecommendationKind = "downgrade" | "upgrade" | "optimization" | "seat-optimization" | "consolidation" | "credits" | "alternative" | "usage" | "keep";

export interface ToolRecommendation {
  id: string;
  toolName: string;
  currentPlan: string;
  action: string;
  estimatedMonthlySavings: number;
  reasoning: string;
  kind: RecommendationKind;
}

export interface AuditReport {
  id: string;
  input: AuditInput;
  summary: SavingsSummary;
  recommendations: ToolRecommendation[];
  generatedSummary: string;
}

export interface LeadCaptureInput {
  email: string;
  companyName: string;
  role: string;
}
