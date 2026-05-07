"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { sampleAuditInput } from "@/features/audit/mock-audit";
import type { AuditInput, LeadCaptureInput } from "@/types/audit";

interface AuditStore {
  auditInput: AuditInput;
  auditId?: string;
  lead?: LeadCaptureInput;
  hasHydrated: boolean;
  updateAuditInput: (input: AuditInput) => void;
  setAuditId: (auditId: string) => void;
  saveLead: (lead: LeadCaptureInput) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  resetAudit: () => void;
}

export const useAuditStore = create<AuditStore>()(
  persist(
    (set) => ({
      auditInput: sampleAuditInput,
      auditId: undefined,
      updateAuditInput: (auditInput) => set({ auditInput }),
      setAuditId: (auditId) => set({ auditId }),
      saveLead: (lead) => set({ lead }),
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      resetAudit: () => set({ auditInput: sampleAuditInput, auditId: undefined, lead: undefined }),
    }),
    {
      name: "ai-spend-audit-state",
      partialize: (state) => ({
        auditInput: state.auditInput,
        auditId: state.auditId,
        lead: state.lead,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
