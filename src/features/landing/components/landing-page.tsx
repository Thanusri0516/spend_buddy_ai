import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  Layers3,
  Share2,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/features/audit/audit-calculations";
import { sampleAuditReport } from "@/features/audit/mock-audit";
import { LogoMarquee } from "@/features/landing/components/logo-marquee";
import { ProductSurfaceSection } from "@/features/landing/components/product-surface-section";
import { TactileCard } from "@/features/landing/components/tactile-card";

const steps = [
  {
    title: "Add your AI tools",
    description: "Capture plans, seats, and monthly spend across chat, coding, and API tools.",
    icon: Layers3,
  },
  {
    title: "Get savings recommendations",
    description: "See which tools deserve downgrade, usage, or ownership review.",
    icon: SlidersHorizontal,
  },
  {
    title: "Share or export your report",
    description: "Turn messy subscriptions into a clear decision artifact for your team.",
    icon: Share2,
  },
];

export async function LandingPage() {
  const report = await sampleAuditReport;

  return (
    <>
      <section className="relative overflow-hidden border-b bg-[linear-gradient(180deg,hsl(var(--muted))_0%,hsl(var(--background))_78%)]">
        <div className="hero-grid-bg absolute inset-0" aria-hidden="true" />
        <div
          className="absolute right-0 top-0 -z-0 h-[600px] w-[600px] rounded-full bg-blue-50/60 blur-3xl"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute left-[38%] top-[45%] hidden h-px w-[440px] bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-blue-500/0 lg:block" aria-hidden="true">
          <span className="data-packet absolute -top-1 left-0 size-2 rounded-full bg-indigo-500/50 shadow-[0_0_16px_rgba(79,70,229,0.45)]" />
          <span className="data-packet absolute -top-1 left-10 size-1.5 rounded-full bg-blue-500/45 shadow-[0_0_14px_rgba(59,130,246,0.4)] [animation-delay:1.6s]" />
        </div>
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
          <FadeIn>
            <Badge className="badge-shimmer relative mb-5 gap-2 overflow-hidden border-indigo-200 bg-white/80 px-3 py-1.5 shadow-sm after:absolute after:inset-y-0 after:w-14 after:-skew-x-12 after:bg-gradient-to-r after:from-transparent after:via-white/80 after:to-transparent">
              <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
              Built for startup AI cost control
            </Badge>
            <h1 className="text-4xl font-semibold leading-tight tracking-normal text-slate-900 sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Stop Overspending on{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                AI Tools
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Audit your startup&apos;s AI stack in 60 seconds and uncover hidden savings
              opportunities.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-indigo-600 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-600/90 hover:shadow-blue-500/40"
              >
                <Link href="/audit/new">
                  Start Free Audit
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-slate-200 bg-white/80 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
              >
                <Link href="/audit/demo">See Example Report</Link>
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <Card className="hero-card-float overflow-hidden border-white/70 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]">
              <CardContent className="p-0">
                <div className="border-b border-white/10 bg-slate-900/90 p-5 text-background backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-background/70">Example savings preview</p>
                    <Badge className="border-background/20 bg-background/10 text-background">
                      Audit ready
                    </Badge>
                  </div>
                  <p className="mt-4 text-4xl font-semibold">
                    {formatCurrency(report.summary.annualSavings)}/year saved
                  </p>
                </div>
                <div className="grid gap-3 p-5">
                  {report.recommendations.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 rounded-md bg-muted p-4"
                    >
                      <div>
                        <p className="font-medium">{item.toolName}</p>
                        <p className="text-sm text-muted-foreground">{item.action}</p>
                      </div>
                      <p className="font-semibold text-emerald-500">
                        {formatCurrency(item.estimatedMonthlySavings)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      <section className="border-b py-10">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <FadeIn className="grid gap-6">
            <p className="text-center text-sm font-medium text-muted-foreground">
              Trusted by engineering teams optimizing AI costs
            </p>
            <LogoMarquee />
            <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-secondary" aria-hidden="true" />
                Local-first draft saving
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-secondary" aria-hidden="true" />
                No personal data on share pages
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <FadeIn className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-normal text-emerald-500">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-900 sm:text-4xl">
              From scattered AI spend to a board-ready summary.
            </h2>
          </FadeIn>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <FadeIn key={step.title} delay={index * 0.06}>
                <TactileCard>
                  <step.icon className="icon-float size-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-5 font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </TactileCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <ProductSurfaceSection />

      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <FadeIn>
            <div className="rounded-lg border bg-foreground p-6 text-background shadow-lg sm:p-8">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-sm text-background/70">Example savings preview</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-normal">
                    {formatCurrency(report.summary.annualSavings)}/year saved
                  </h2>
                  <p className="mt-3 max-w-2xl text-background/70">
                    A realistic preview of how the audit turns current spend into a focused
                    optimization report.
                  </p>
                </div>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/audit/demo">
                    Open example
                    <BadgeDollarSign className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
