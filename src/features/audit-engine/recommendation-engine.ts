import type { AuditInput, AuditResult, Recommendation } from "./types";
import { env } from "@/lib/env";
import { generateAuditSync as generateAuditSyncCore } from "./audit-engine-core";

function getSummary(totalMonthlySavings: number) {
  if (totalMonthlySavings < 100) {
    return "Your AI stack already appears relatively cost-efficient for your current team size and workflow.";
  }

  if (totalMonthlySavings > 500) {
    return "Your organization may significantly reduce recurring AI infrastructure costs through plan optimization and workload consolidation.";
  }

  return "Your stack contains several opportunities for optimization.";
}

async function generateAIRecommendations(input: AuditInput): Promise<Recommendation[]> {
  if (!env.GROQ_API_KEY) {
    console.log('No GROQ_API_KEY provided, skipping AI recommendations');
    return [];
  }

  const userPrompt = `Based on the following audit input for AI tool subscriptions, suggest 1-3 personalized recommendations for cost optimization or improvements. Input: ${JSON.stringify(input)}. Respond ONLY with a JSON array of objects, each with: tool (string), currentPlan (string), recommendedPlan (string), currentSpend (number), optimizedSpend (number), monthlySavings (number), annualSavings (number), reason (string), type (string like 'upgrade', 'downgrade', 'optimization'). Do not wrap in markdown code fences. Output raw JSON only.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an AI audit assistant that outputs only valid JSON arrays. Never wrap output in markdown code fences. Output raw JSON only.',
          },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 2048,
        temperature: 0,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorPayload: unknown = errorText;
      try {
        errorPayload = JSON.parse(errorText);
      } catch {
        // Keep raw text if JSON parse fails
      }
      console.error(`Grok API error - Status: ${response.status}`, errorPayload);
      return [];
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('Grok API returned empty content:', JSON.stringify(data).slice(0, 200));
      return [];
    }

    // Try parsing the content directly first (expected with response_format: json_object)
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Fallback: extract JSON array from markdown-fenced or raw text ([\s\S]*? for multiline)
      const jsonMatch =
        content.match(/```(?:json)?\s*([\s\S]*?)```/) ||
        content.match(/(\[[\s\S]*\])/);
      if (!jsonMatch) {
        console.log('No JSON found in Grok response:', content.slice(0, 200));
        return [];
      }
      try {
        parsed = JSON.parse(jsonMatch[1]);
      } catch (parseErr) {
        console.error('Failed to parse extracted JSON from Grok response:', parseErr);
        return [];
      }
    }

    // Handle both { recommendations: [...] } wrapper and direct array
    const recs: unknown[] = Array.isArray(parsed)
      ? parsed
      : (typeof parsed === 'object' && parsed !== null && 'recommendations' in parsed && Array.isArray((parsed as Record<string, unknown>).recommendations))
        ? (parsed as Record<string, unknown>).recommendations as unknown[]
        : [];

    if (recs.length === 0) {
      console.log('Grok response parsed but contained no recommendations:', JSON.stringify(parsed).slice(0, 200));
      return [];
    }

    return recs.filter((r): r is Recommendation => {
      return (
        typeof r === "object" &&
        r !== null &&
        "tool" in r &&
        "reason" in r
      );
    });
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return [];
  }
}

export function generateAuditSync(input: AuditInput): AuditResult {
  return generateAuditSyncCore(input);
}

export default async function generateAudit(
  input: AuditInput
): Promise<AuditResult> {
  const baseResult = generateAuditSync(input);
  const aiRecommendations = await generateAIRecommendations(input);

  if (aiRecommendations.length === 0) {
    return baseResult;
  }

  const extraMonthlySavings = aiRecommendations.reduce(
    (sum, recommendation) => sum + recommendation.monthlySavings,
    0,
  );

  const totalMonthlySavings = baseResult.totalMonthlySavings + extraMonthlySavings;
  const totalOptimizedSpend = baseResult.totalCurrentSpend - totalMonthlySavings;
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    ...baseResult,
    recommendations: [...baseResult.recommendations, ...aiRecommendations],
    totalOptimizedSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    summary: getSummary(totalMonthlySavings),
  };
}