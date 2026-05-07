import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
}

export function MetricCard({ label, value, detail, icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-normal">{value}</p>
          </div>
          {icon ? <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div> : null}
        </div>
        {detail ? <p className="mt-3 text-sm text-muted-foreground">{detail}</p> : null}
      </CardContent>
    </Card>
  );
}
