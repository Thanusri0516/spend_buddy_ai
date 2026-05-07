import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/features/audit/audit-calculations";
import type { ToolRecommendation } from "@/types/audit";

export function RecommendationCard({ recommendation }: { recommendation: ToolRecommendation }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{recommendation.toolName}</h3>
            <Badge>{recommendation.currentPlan}</Badge>
          </div>
          <p className="mt-3 font-medium">{recommendation.action}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{recommendation.reasoning}</p>
        </div>
        <div className="rounded-md bg-secondary/10 px-4 py-3 text-left md:text-right">
          <p className="text-sm text-secondary">Monthly savings</p>
          <p className="mt-1 text-xl font-semibold text-secondary">
            {formatCurrency(recommendation.estimatedMonthlySavings)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
