import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeDollarSign, EyeOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MetricCard } from "@/features/audit/components/metric-card";
import { RecommendationCard } from "@/features/audit/components/recommendation-card";
import { ShareActions } from "@/features/audit/components/share-actions";
import { buildAuditReportSync, formatCurrency } from "@/features/audit/audit-calculations";
import { getToolByName, getToolById } from "@/config/ai-tools";
import { getAuditById } from "@/server/audit/repository";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `SpendBuddy AI Report ${id}`,
    description: "A redacted SpendBuddy AI report with savings summary and recommendations.",
    openGraph: {
      title: "SpendBuddy AI Report",
      description: "Review AI tool spend, savings opportunities, and recommendations.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "SpendBuddy AI Report",
      description: "Review AI tool spend, savings opportunities, and recommendations.",
    },
  };
}

export default async function PublicAuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const audit = await getAuditById(id);
  if (!audit) {
    notFound();
  }

  const auditInput = {
    teamSize: audit.teamSize,
    primaryUseCase: audit.primaryUseCase,
    tools: audit.tools.map((tool) => {
      const toolConfig = getToolByName(tool.toolName);
      return {
        id: tool.id,
        toolId: toolConfig.id,
        plan: tool.planName,
        monthlySpend: tool.monthlySpend,
        seats: tool.seats,
      };
    }),
  };

  // Public reports are deterministic + redacted; we avoid calling AI endpoints here.
  const report = buildAuditReportSync(auditInput, audit.id);

  return (
    <section className="bg-muted/35 py-10 sm:py-14">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Badge className="gap-2">
              <EyeOff className="size-3.5" aria-hidden="true" />
              Public redacted report
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
              SpendBuddy AI report
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              This page shows tools, savings, and recommendations only. It does not display email,
              company name, or personal information.
            </p>
          </div>
          <ShareActions />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Current Monthly Spend"
            value={formatCurrency(report.summary.currentMonthlySpend)}
          />
          <MetricCard
            label="Optimized Spend"
            value={formatCurrency(report.summary.optimizedMonthlySpend)}
          />
          <MetricCard
            label="Monthly Savings"
            value={formatCurrency(report.summary.monthlySavings)}
          />
          <MetricCard
            label="Annual Savings"
            value={formatCurrency(report.summary.annualSavings)}
            icon={<BadgeDollarSign className="size-5" aria-hidden="true" />}
          />
        </div>

        <section>
          <h2 className="mb-4 text-2xl font-semibold tracking-normal">AI tools used</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {report.input.tools.map((tool) => {
              const toolConfig = getToolById(tool.toolId);

              return (
                <Card key={tool.id}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold">{toolConfig.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{tool.plan}</p>
                    <p className="mt-4 text-2xl font-semibold">
                      {formatCurrency(tool.monthlySpend)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{tool.seats} seats</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold tracking-normal">Recommendations</h2>
          <div className="grid gap-4">
            {report.recommendations.map((recommendation) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
