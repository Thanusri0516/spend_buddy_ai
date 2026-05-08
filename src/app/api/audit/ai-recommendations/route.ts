import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import type { Recommendation } from "@/features/audit-engine/types";

export async function POST(request: Request) {
  try {
    const input = await request.json();

    if (!env.GROQ_API_KEY) {
      console.log("No GROQ_API_KEY provided, skipping AI recommendations");
      return NextResponse.json({ recommendations: [] });
    }

    const userPrompt = `Based on the following audit input for AI tool subscriptions, suggest 1-3 personalized recommendations for cost optimization or improvements. Input: ${JSON.stringify(input)}. Respond ONLY with a JSON array of objects, each with: tool (string), currentPlan (string), recommendedPlan (string), currentSpend (number), optimizedSpend (number), monthlySavings (number), annualSavings (number), reason (string), type (string like 'upgrade', 'downgrade', 'optimization'). Do not wrap in markdown code fences. Output raw JSON only.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are an AI audit assistant that outputs only valid JSON arrays. Never wrap output in markdown code fences. Output raw JSON only.",
          },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 2048,
        temperature: 0,
        response_format: { type: "json_object" },
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
      console.error(`Groq API error - Status: ${response.status}`, errorPayload);
      return NextResponse.json({ recommendations: [] });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("Groq API returned empty content:", JSON.stringify(data).slice(0, 200));
      return NextResponse.json({ recommendations: [] });
    }

    // Try parsing the content directly first (expected with response_format: json_object)
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Fallback: extract JSON array from markdown-fenced or raw text ([\s\S]*? for multiline)
      const jsonMatch =
        content.match(/```(?:json)?\s*([\s\S]*?)```/) || content.match(/(\[[\s\S]*\])/);
      if (!jsonMatch) {
        console.log("No JSON found in Groq response:", content.slice(0, 200));
        return NextResponse.json({ recommendations: [] });
      }
      try {
        parsed = JSON.parse(jsonMatch[1]);
      } catch (parseErr) {
        console.error("Failed to parse extracted JSON from Groq response:", parseErr);
        return NextResponse.json({ recommendations: [] });
      }
    }

    // Handle both { recommendations: [...] } wrapper and direct array
    const recs: unknown[] = Array.isArray(parsed)
      ? parsed
      : typeof parsed === "object" &&
          parsed !== null &&
          "recommendations" in parsed &&
          Array.isArray((parsed as Record<string, unknown>).recommendations)
        ? ((parsed as Record<string, unknown>).recommendations as unknown[])
        : [];

    if (recs.length === 0) {
      console.log("Groq response parsed but contained no recommendations:", JSON.stringify(parsed).slice(0, 200));
      return NextResponse.json({ recommendations: [] });
    }

    const recommendations = recs.filter((r): r is Recommendation => {
      if (typeof r !== "object" || r === null) return false;
      const rec = r as Record<string, unknown>;
      return (
        typeof rec.tool === "string" &&
        typeof rec.currentPlan === "string" &&
        typeof rec.recommendedPlan === "string" &&
        typeof rec.monthlySavings === "number" &&
        typeof rec.reason === "string" &&
        typeof rec.type === "string"
      );
    });

    return NextResponse.json({ recommendations });
  } catch (err) {
    console.error("AI recommendation error:", err);
    return NextResponse.json({ recommendations: [] });
  }
}
