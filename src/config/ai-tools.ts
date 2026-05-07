import type { AiToolOption, PrimaryUseCase } from "@/types/audit";

export const AI_TOOL_IDS = [
  "chatgpt",
  "claude",
  "cursor",
  "github-copilot",
  "gemini",
  "openai-api",
  "anthropic-api",
  "windsurf",
] as const;

export const PRIMARY_USE_CASE_IDS = [
  "coding",
  "writing",
  "research",
  "data-analysis",
  "mixed",
] as const;

export const AI_TOOLS: AiToolOption[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "chat",
    plans: ["Free", "Plus", "Team", "Enterprise"],
  },
  {
    id: "claude",
    name: "Claude",
    category: "chat",
    plans: ["Free", "Pro", "Team", "Enterprise"],
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "coding",
    plans: ["Hobby", "Pro", "Business"],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "coding",
    plans: ["Individual", "Business", "Enterprise"],
  },
  {
    id: "gemini",
    name: "Gemini",
    category: "research",
    plans: ["Free", "Advanced", "Workspace"],
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    category: "api",
    plans: ["Usage-based", "Committed spend", "Enterprise"],
  },
  {
    id: "anthropic-api",
    name: "Anthropic API",
    category: "api",
    plans: ["Usage-based", "Committed spend", "Enterprise"],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    category: "coding",
    plans: ["Free", "Pro", "Teams"],
  },
];

export const PRIMARY_USE_CASES: Array<{ value: PrimaryUseCase; label: string }> = [
  { value: "coding", label: "Coding" },
  { value: "writing", label: "Writing" },
  { value: "research", label: "Research" },
  { value: "data-analysis", label: "Data Analysis" },
  { value: "mixed", label: "Mixed" },
];

export function getToolById(id: string) {
  return AI_TOOLS.find((tool) => tool.id === id) ?? AI_TOOLS[0];
}

export function getToolInitials(id: string) {
  const initials: Record<string, string> = {
    chatgpt: "CG",
    claude: "CL",
    cursor: "CU",
    "github-copilot": "GH",
    gemini: "GE",
    "openai-api": "OA",
    "anthropic-api": "AN",
    windsurf: "WS",
  };

  return initials[id] ?? "AI";
}
