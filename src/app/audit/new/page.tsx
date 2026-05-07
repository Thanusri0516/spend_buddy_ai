import { AuditBuilderForm } from "@/features/audit/components/audit-builder-form";

export default function NewAuditPage() {
  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] py-10 sm:py-14">
      <div className="audit-mesh-bg" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-normal text-secondary">
            Free audit
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">
            Add your AI stack.
          </h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            Build a clean spend profile across subscriptions, seats, and API usage. Your draft
            auto-saves locally as you go.
          </p>
        </div>
        <AuditBuilderForm />
      </div>
    </section>
  );
}
