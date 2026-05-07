"use client";

import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AiSummaryCardProps {
  summary: string;
}

export function AiSummaryCard({ summary }: AiSummaryCardProps) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const timer = window.setTimeout(() => setState("ready"), 700);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI personalized summary</CardTitle>
      </CardHeader>
      <CardContent>
        {state === "loading" ? (
          <div className="grid gap-3" aria-label="Loading personalized summary">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : null}
        {state === "error" ? (
          <div className="flex gap-3 rounded-md border bg-muted p-4">
            <AlertCircle className="size-5 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Summary is unavailable right now. Your recommendations are still shown below.
            </p>
          </div>
        ) : null}
        {state === "ready" ? <p className="leading-7 text-muted-foreground">{summary}</p> : null}
      </CardContent>
    </Card>
  );
}
