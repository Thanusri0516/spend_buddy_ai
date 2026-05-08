export const AI_TOOL_PRICING = {
  chatgpt: {
    name: "ChatGPT",
    category: "assistant",
    plans: {
      free: { label: "Free", price: 0, type: "consumer" },
      go: { label: "Go", price: 8, type: "consumer" },
      plus: { label: "Plus", price: 20, type: "consumer" },
      pro100: { label: "Pro ($100)", price: 100, type: "consumer" },
      pro200: { label: "Pro ($200)", price: 200, type: "consumer" },
      teamMonthly: {
        label: "Team Monthly",
        price: 30,
        type: "business",
      },
      teamAnnual: {
        label: "Team Annual",
        price: 25,
        type: "business",
      },
      enterprise: {
        label: "Enterprise",
        price: 60,
        type: "enterprise",
      },
    },
  },

  claude: {
    name: "Claude",
    category: "assistant",
    plans: {
      free: { label: "Free", price: 0, type: "consumer" },
      pro: { label: "Pro", price: 20, type: "consumer" },
      max: { label: "Max", price: 100, type: "consumer" },
      team: { label: "Team", price: 30, type: "business" },
      enterprise: {
        label: "Enterprise",
        price: 75,
        type: "enterprise",
      },
    },
  },

  cursor: {
    name: "Cursor",
    category: "coding",
    plans: {
      hobby: { label: "Hobby", price: 0, type: "consumer" },
      pro: { label: "Pro", price: 20, type: "consumer" },
      business: { label: "Business", price: 40, type: "business" },
      enterprise: {
        label: "Enterprise",
        price: 80,
        type: "enterprise",
      },
    },
  },

  githubCopilot: {
    name: "GitHub Copilot",
    category: "coding",
    plans: {
      individual: {
        label: "Individual",
        price: 10,
        type: "consumer",
      },
      business: {
        label: "Business",
        price: 19,
        type: "business",
      },
      enterprise: {
        label: "Enterprise",
        price: 39,
        type: "enterprise",
      },
    },
  },

  gemini: {
    name: "Gemini",
    category: "assistant",
    plans: {
      free: { label: "Free", price: 0, type: "consumer" },
      pro: { label: "Pro", price: 20, type: "consumer" },
      ultra: { label: "Ultra", price: 40, type: "business" },
    },
  },

  windsurf: {
    name: "Windsurf",
    category: "coding",
    plans: {
      free: { label: "Free", price: 0, type: "consumer" },
      pro: { label: "Pro", price: 15, type: "consumer" },
      teams: { label: "Teams", price: 30, type: "business" },
    },
  },
};