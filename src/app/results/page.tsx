"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuditResultsDashboard } from "@/features/audit/components/audit-results-dashboard";
import type { AuditDto } from "@/types/api";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const auditId = searchParams.get("auditId");
  const [audit, setAudit] = useState<AuditDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auditId) {
      setError("No audit ID provided");
      setLoading(false);
      return;
    }

    async function fetchAudit() {
      try {
        const response = await fetch(`/api/audit/${auditId}`);
        const data = await response.json();

        if (!data.ok) {
          setError(data.message || "Failed to load audit");
          setLoading(false);
          return;
        }

        setAudit(data.audit);
      } catch (err) {
        setError("Failed to load audit");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAudit();
  }, [auditId]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  if (!audit) return <div className="flex items-center justify-center min-h-screen">No audit data found</div>;

  return <AuditResultsDashboard audit={audit} />;
}
