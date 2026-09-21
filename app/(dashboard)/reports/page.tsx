import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ReportsView } from "@/components/reports/reports-view";
import { getReports } from "@/actions/reports";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Revenue, win rates and customer performance."
      />
      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
        <ReportsContent />
      </Suspense>
    </div>
  );
}

async function ReportsContent() {
  const result = await getReports();

  if (!result.success) {
    return <p className="text-sm text-destructive">{result.error}</p>;
  }

  return <ReportsView data={result.data} />;
}