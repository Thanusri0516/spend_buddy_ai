"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Loader2,
  LockKeyhole,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { AI_TOOLS, getToolById, getToolInitials, PRIMARY_USE_CASES } from "@/config/ai-tools";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { auditInputSchema, type AuditInputValues } from "@/features/audit/audit-schema";
import { createAuditRequest } from "@/lib/api/audit-client";
import { useAuditStore } from "@/store/audit-store";
import type { AiToolId } from "@/types/audit";

function createToolRow(index: number) {
  const tool = AI_TOOLS[index % AI_TOOLS.length];

  return {
    id: crypto.randomUUID(),
    toolId: tool.id,
    plan: tool.plans[0],
    monthlySpend: 20,
    seats: 1,
  };
}

export function AuditBuilderForm() {
  const router = useRouter();
  const storedInput = useAuditStore((state) => state.auditInput);
  const updateAuditInput = useAuditStore((state) => state.updateAuditInput);
  const setAuditId = useAuditStore((state) => state.setAuditId);
  const hasHydrated = useAuditStore((state) => state.hasHydrated);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const form = useForm<AuditInputValues>({
    resolver: zodResolver(auditInputSchema),
    defaultValues: storedInput,
    mode: "onBlur",
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tools",
    keyName: "fieldKey",
  });

  useEffect(() => {
    const subscription = watch((value) => {
      const parsed = auditInputSchema.safeParse(value);

      if (parsed.success) {
        updateAuditInput(parsed.data);
        setShowSaved(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [updateAuditInput, watch]);

  useEffect(() => {
    if (!showSaved) {
      return;
    }

    const timeout = window.setTimeout(() => setShowSaved(false), 1400);

    return () => window.clearTimeout(timeout);
  }, [showSaved]);

  function onToolChange(index: number, toolId: AiToolId) {
    const tool = getToolById(toolId);
    setValue(`tools.${index}.toolId`, tool.id, { shouldDirty: true });
    setValue(`tools.${index}.plan`, tool.plans[0], { shouldDirty: true });
  }

  async function onSubmit(values: AuditInputValues) {
    setSubmitError(null);
    updateAuditInput(values);

    const response = await createAuditRequest(values);

    if (!response.ok) {
      setSubmitError(response.message);
      return;
    }

    setAuditId(response.auditId);
    router.push(`/results?auditId=${response.auditId}`);
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
        <Card className="border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:sticky lg:top-24">
          <CardHeader className="border-b bg-slate-50/80 p-5">
            <CardTitle className="text-base">Company context</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-5">
            <div className="grid gap-2">
              <Label htmlFor="teamSize">Team size</Label>
              <Input
                id="teamSize"
                type="number"
                min={1}
                inputMode="numeric"
                aria-invalid={Boolean(errors.teamSize)}
                {...register("teamSize")}
              />
              {errors.teamSize ? (
                <p className="text-sm text-destructive">{errors.teamSize.message}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="primaryUseCase">Primary use case</Label>
              <Select id="primaryUseCase" {...register("primaryUseCase")}>
                {PRIMARY_USE_CASES.map((useCase) => (
                  <option key={useCase.value} value={useCase.value}>
                    {useCase.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="rounded-md border border-indigo-100 bg-indigo-50/70 p-4">
              <div className="flex gap-3">
                <Info className="mt-0.5 size-4 text-indigo-600" aria-hidden="true" />
                <p className="text-sm leading-6 text-slate-600">
                  Most teams find savings by reviewing seat ownership before renewal windows.
                </p>
              </div>
            </div>

            <div className="rounded-md border border-emerald-100 bg-emerald-50/70 p-4">
              <div className="flex gap-3">
                <LockKeyhole className="mt-0.5 size-4 text-emerald-600" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Data encrypted & local-first</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Drafts autosave in this browser before submission.
                  </p>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        <div className="grid gap-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div>
              <h2 className="text-xl font-semibold tracking-normal">AI tools</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add each recurring AI product, plan, spend, and seat count.
              </p>
            </div>
          </div>

          {errors.tools?.root?.message ? (
            <p className="text-sm text-destructive">{errors.tools.root.message}</p>
          ) : null}

          <div className="grid gap-3">
            <div className="hidden grid-cols-[1.2fr_1fr_170px_120px_48px] gap-4 px-5 text-xs font-semibold uppercase tracking-normal text-muted-foreground xl:grid">
              <span>Tool</span>
              <span>Plan</span>
              <span>Monthly spend</span>
              <span>Seats</span>
              <span className="sr-only">Action</span>
            </div>

            {fields.map((field, index) => {
              const selectedTool = getToolById(watch(`tools.${index}.toolId`));
              const fieldPrefix = `tools-${index}`;

              return (
                <Card
                  key={field.fieldKey}
                  className="border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:scale-[1.01] hover:border-indigo-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)]"
                >
                  <CardContent className="grid gap-4 p-5 xl:grid-cols-[1.2fr_1fr_170px_120px_48px] xl:items-end">
                    <div className="grid gap-2">
                      <Label className="xl:hidden" htmlFor={`${fieldPrefix}-tool`}>
                        Tool
                      </Label>
                      <div className="grid grid-cols-[40px_minmax(0,1fr)] gap-2">
                        <div className="flex size-10 items-center justify-center rounded-md border bg-slate-50 text-xs font-semibold text-slate-500">
                          {getToolInitials(watch(`tools.${index}.toolId`))}
                        </div>
                        <Select
                          id={`${fieldPrefix}-tool`}
                          value={watch(`tools.${index}.toolId`)}
                          onChange={(event) => onToolChange(index, event.target.value as AiToolId)}
                        >
                          {AI_TOOLS.map((tool) => (
                            <option key={tool.id} value={tool.id}>
                              {tool.name}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label className="xl:hidden" htmlFor={`${fieldPrefix}-plan`}>
                        Plan
                      </Label>
                      <Select id={`${fieldPrefix}-plan`} {...register(`tools.${index}.plan`)}>
                        {selectedTool.plans.map((plan) => (
                          <option key={plan} value={plan}>
                            {plan}
                          </option>
                        ))}
                      </Select>
                      {errors.tools?.[index]?.plan ? (
                        <p className="text-sm text-destructive">
                          {errors.tools[index]?.plan?.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="grid gap-2">
                      <Label className="xl:hidden" htmlFor={`${fieldPrefix}-spend`}>
                        Monthly spend
                      </Label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                          $
                        </span>
                        <Input
                          id={`${fieldPrefix}-spend`}
                          className="pl-7"
                          type="number"
                          min={0}
                          inputMode="decimal"
                          aria-invalid={Boolean(errors.tools?.[index]?.monthlySpend)}
                          {...register(`tools.${index}.monthlySpend`)}
                        />
                      </div>
                      {errors.tools?.[index]?.monthlySpend ? (
                        <p className="text-sm text-destructive">
                          {errors.tools[index]?.monthlySpend?.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="grid gap-2">
                      <Label className="xl:hidden" htmlFor={`${fieldPrefix}-seats`}>
                        Seats
                      </Label>
                      <Input
                        id={`${fieldPrefix}-seats`}
                        type="number"
                        min={1}
                        inputMode="numeric"
                        aria-invalid={Boolean(errors.tools?.[index]?.seats)}
                        {...register(`tools.${index}.seats`)}
                      />
                      {errors.tools?.[index]?.seats ? (
                        <p className="text-sm text-destructive">
                          {errors.tools[index]?.seats?.message}
                        </p>
                      ) : null}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove tool"
                      onClick={() => remove(index)}
                      className="text-slate-300 hover:text-red-500"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}

            {fields.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <div className="mx-auto flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Plus className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-semibold">No AI tools added yet</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Add your first subscription or API tool to start building the audit.
                </p>
              </div>
            ) : null}

            <Button
              type="button"
              variant="outline"
              className="h-14 border-dashed border-slate-300 bg-white text-base shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:bg-slate-50"
              onClick={() => append(createToolRow(fields.length))}
            >
              <Plus className="size-4" aria-hidden="true" />
              Add another tool
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            {showSaved ? (
              <CheckCircle2 className="size-4 text-secondary" aria-hidden="true" />
            ) : null}
            {hasHydrated
              ? showSaved
                ? "Saved"
                : "Auto-saved locally in this browser."
              : "Restoring saved draft..."}
          </span>
          {submitError ? (
            <p className="mt-2 inline-flex items-center gap-2 text-destructive">
              <AlertCircle className="size-4" aria-hidden="true" />
              {submitError}
            </p>
          ) : null}
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-md shadow-blue-600/20 hover:opacity-95"
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          Submit audit
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>

    </form>
  );
}
