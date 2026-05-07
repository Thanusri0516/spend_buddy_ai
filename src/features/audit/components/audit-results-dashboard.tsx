"use client";

import Link from "next/link";
import { CalendarClock, DollarSign, TrendingDown, WalletCards } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AiSummaryCard } from "@/features/audit/components/ai-summary-card";
import { LeadCaptureCard } from "@/features/audit/components/lead-capture-card";
import { MetricCard } from "@/features/audit/components/metric-card";
import { RecommendationCard } from "@/features/audit/components/recommendation-card";
import { buildAuditReport, formatCurrency } from "@/features/audit/audit-calculations";
import { useAuditStore } from "@/store/audit-store";

export function AuditResultsDashboard() {
  const auditInput = useAuditStore((state) => state.auditInput);
  const report = buildAuditReport(auditInput, "local-preview");
  const savingsAreHigh = report.summary.monthlySavings > 500;
  const savingsAreLow = report.summary.monthlySavings < 75;

  return (
    <section className="bg-muted/35 py-10 sm:py-14">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge>Audit results</Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
              Your SpendBuddy AI is ready.
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              Review savings, plan-fit recommendations, and a shareable report preview.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/audit/new">Edit inputs</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Current Monthly Spend"
            value={formatCurrency(report.summary.currentMonthlySpend)}
            icon={<WalletCards className="size-5" aria-hidden="true" />}
          />
          <MetricCard
            label="Optimized Spend"
            value={formatCurrency(report.summary.optimizedMonthlySpend)}
            icon={<TrendingDown className="size-5" aria-hidden="true" />}
          />
          <MetricCard
            label="Monthly Savings"
            value={formatCurrency(report.summary.monthlySavings)}
            detail={savingsAreLow ? "Already efficient" : "Estimated opportunity"}
            icon={<DollarSign className="size-5" aria-hidden="true" />}
          />
          <MetricCard
            label="Annual Savings"
            value={formatCurrency(report.summary.annualSavings)}
            icon={<CalendarClock className="size-5" aria-hidden="true" />}
          />
        </div>

        {savingsAreLow ? (
          <Card className="border-secondary/30 bg-secondary/5">
            <CardContent className="p-5">
              <h2 className="text-xl font-semibold">Your stack is already well optimized.</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Get notified when new optimizations become available.
              </p>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-8">
            <section>
              <div className="mb-4">
                <h2 className="text-2xl font-semibold tracking-normal">Recommendations</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Frontend-only recommendation UI for the current product prototype.
                </p>
              </div>
              <div className="grid gap-4">
                {report.recommendations.map((recommendation) => (
                  <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold tracking-normal">
                Optimization opportunities
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  "Downgrade recommendation",
                  "Alternative tool recommendation",
                  "API credit optimization",
                ].map((label) => (
                  <Card key={label}>
                    <CardContent className="p-5">
                      <h3 className="font-semibold">{label}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Reserved for the Day 2 intelligence layer and real audit rules.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <AiSummaryCard summary={report.generatedSummary} />

            {savingsAreHigh ? (
              <Card className="border-primary/25 bg-primary/5">
                <CardContent className="grid gap-5 p-6 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <h2 className="text-xl font-semibold">Credex can help go deeper.</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      If your team could save over $500/month, Credex can help unlock additional
                      infrastructure savings.
                    </p>
                  </div>
                  <Button>Book Consultation</Button>
                </CardContent>
              </Card>
            ) : null}
          </div>

          <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
            <LeadCaptureCard />
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold">Shareable report</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Public reports hide email, company name, and personal info.
                </p>
                <Button asChild className="mt-4 w-full" variant="outline">
                  <Link href="/audit/demo">Open public preview</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  );
}
