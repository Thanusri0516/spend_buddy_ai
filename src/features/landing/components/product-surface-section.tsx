"use client";

import type { MouseEvent } from "react";
import { BarChart3, FileText, SlidersHorizontal, Sparkles, UsersRound } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  "AI spend analysis",
  "Plan optimization",
  "Tool alternatives",
  "Personalized recommendations",
  "Shareable reports",
];

export function ProductSurfaceSection() {
  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = `${event.clientX - rect.left}px`;
    const y = `${event.clientY - rect.top}px`;

    event.currentTarget.style.setProperty("--spotlight-x", x);
    event.currentTarget.style.setProperty("--spotlight-y", y);
  }

  return (
    <section
      className="relative overflow-hidden border-y bg-slate-50 py-16 sm:py-20"
      onMouseMove={handleMouseMove}
    >
      <div className="technical-dot-grid absolute inset-0 opacity-35" aria-hidden="true" />
      <div className="spotlight-layer absolute inset-0 transition-opacity duration-300" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
        <FadeIn>
          <p className="text-sm font-medium uppercase tracking-normal text-emerald-500">
            Product surface
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-900 sm:text-4xl">
            Built for real SaaS workflows, not spreadsheet theater.
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            The frontend is structured around a clean audit flow: collect spend, inspect
            recommendations, save leads, and share a redacted report.
          </p>
        </FadeIn>

        <div className="grid gap-4 md:grid-cols-6">
          {features.map((feature, index) => {
            const icons = [BarChart3, SlidersHorizontal, UsersRound, Sparkles, FileText];
            const Icon = icons[index];
            const positionClass =
              index < 3
                ? "md:col-span-2"
                : index === 3
                  ? "md:col-span-2 md:col-start-2"
                  : "md:col-span-2";

            return (
              <FadeIn key={feature} delay={index * 0.04} className={positionClass}>
                <Card className="h-full border-slate-200 bg-white/90 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_24px_rgba(79,70,229,0.22)]">
                  <CardContent className="p-5">
                    <Icon className="icon-float size-5 text-primary" aria-hidden="true" />
                    <h3 className="mt-4 font-semibold text-slate-900">{feature}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Clear UI patterns for finance, ops, and engineering leaders to act quickly.
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
