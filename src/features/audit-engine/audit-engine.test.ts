import { describe, it, expect } from 'vitest';
import generateAudit from './recommendation-engine';
import type { AuditInput } from './types';

describe('Audit Engine', () => {
  describe('Recommendation Engine', () => {
    it('recommends downgrading ChatGPT Team for small team', async () => {
      const input: AuditInput = {
        teamSize: 2,
        useCase: 'coding',
        tools: [
          {
            toolId: 'chatgpt',
            plan: 'Team',
            monthlySpend: 60,
            seats: 2,
          },
        ],
      };

      const result = await generateAudit(input);
      expect(result.recommendations).toHaveLength(1);
      expect(result.recommendations[0].type).toBe('downgrade');
      expect(result.recommendations[0].recommendedPlan).toBe('Plus');
      expect(result.totalMonthlySavings).toBe(20);
    });

    it('detects unused seats', async () => {
      const input: AuditInput = {
        teamSize: 5,
        useCase: 'coding',
        tools: [
          {
            toolId: 'cursor',
            plan: 'Pro',
            monthlySpend: 20,
            seats: 10,
          },
        ],
      };

      const result = await generateAudit(input);
      expect(result.recommendations.some((r) => r.type === 'seat-optimization')).toBe(true);
    });

    it('shows honest message for efficient stack', async () => {
      const input: AuditInput = {
        teamSize: 10,
        useCase: 'coding',
        tools: [
          {
            toolId: 'cursor',
            plan: 'Pro',
            monthlySpend: 20,
            seats: 1,
          },
        ],
      };

      const result = await generateAudit(input);
      expect(result.recommendations).toHaveLength(0);
      expect(result.totalMonthlySavings).toBe(0);
    });

    it('recommends enterprise downgrade for small team', async () => {
      const input: AuditInput = {
        teamSize: 15,
        useCase: 'coding',
        tools: [
          {
            toolId: 'claude',
            plan: 'Enterprise',
            monthlySpend: 1125,
            seats: 15,
          },
        ],
      };

      const result = await generateAudit(input);
      expect(result.recommendations[0].type).toBe('downgrade');
      expect(result.recommendations[0].recommendedPlan).toBe('Team');
    });

    it('recommends API optimization for high spend', async () => {
      const input: AuditInput = {
        teamSize: 50,
        useCase: 'data',
        tools: [
          {
            toolId: 'openai-api',
            plan: 'Usage-based',
            monthlySpend: 6000,
            seats: 1,
          },
        ],
      };

      const result = await generateAudit(input);
      expect(result.recommendations[0].type).toBe('credits');
      expect(result.totalMonthlySavings).toBe(1200);
    });
  });
});