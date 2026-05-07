"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { leadCaptureSchema, type LeadCaptureValues } from "@/features/audit/audit-schema";
import { useAuditStore } from "@/store/audit-store";

export function LeadCaptureCard() {
  const [isComplete, setIsComplete] = useState(false);
  const saveLead = useAuditStore((state) => state.saveLead);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadCaptureValues>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: {
      email: "",
      companyName: "",
      role: "",
    },
  });

  async function onSubmit(values: LeadCaptureValues) {
    saveLead(values);
    await new Promise((resolve) => setTimeout(resolve, 450));
    setIsComplete(true);
  }

  if (isComplete) {
    return (
      <Card className="border-secondary/30 bg-secondary/5">
        <CardContent className="flex items-start gap-3 p-5">
          <CheckCircle2 className="mt-0.5 size-5 text-secondary" aria-hidden="true" />
          <div>
            <h3 className="font-semibold">Report saved</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You are on the list for new AI spend optimization alerts.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Save this audit</CardTitle>
        <p className="text-sm text-muted-foreground">We&apos;ll never share your data.</p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-2">
            <Label htmlFor="lead-email">Email</Label>
            <Input id="lead-email" type="email" {...register("email")} />
            {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lead-company">Company name</Label>
            <Input id="lead-company" {...register("companyName")} />
            {errors.companyName ? (
              <p className="text-sm text-destructive">{errors.companyName.message}</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lead-role">Role</Label>
            <Input id="lead-role" {...register("role")} />
            {errors.role ? <p className="text-sm text-destructive">{errors.role.message}</p> : null}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            Save report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
