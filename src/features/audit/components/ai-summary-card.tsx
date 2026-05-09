"use client";

import { Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function AiSummaryCard({
  summary,
  highlights,
}: {
  summary: string;
  highlights?: string[];
}) {
  return (
    <Card className="border-indigo-200/60 bg-indigo-50/40">
      <CardContent className="grid gap-4 p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
          <Sparkles className="size-4" aria-hidden="true" />
          AI summary
        </div>

        <p className="text-sm leading-6 text-slate-700">{summary}</p>

        {highlights && highlights.length > 0 ? (
          <ul className="grid gap-2 text-sm text-slate-700">
            {highlights.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-500" aria-hidden="true" />
                <span className="leading-6">{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}

