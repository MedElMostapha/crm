import { getDeals } from "@/actions/deals";
import { DataTable } from "@/components/data-table";
import { ExportCsv } from "@/components/export-csv";
import { dealColumns } from "./deal-columns";
import { EmptyState } from "@/components/empty-state";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { formatDate } from "@/utils";

interface DealListProps {
  search?: string;
  stage?: string;
  page?: number;
}

export async function DealList({ search, stage, page = 1 }: DealListProps) {
  const result = await getDeals(search, stage, page);

  if (!result.success) {
    return <p className="text-sm text-destructive">{result.error}</p>;
  }

  const { deals, total } = result.data;

  if (deals.length === 0) {
    return (
      <EmptyState
        title="No deals found"
        description="Start tracking your sales pipeline by adding a deal."
        icon={Target}
        action={
          <Button asChild>
            <Link href="/deals/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Deal
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} deal{total !== 1 ? "s" : ""} found
        </p>
        <ExportCsv
          data={deals.map((d) => ({
            Title: d.title,
            Customer: d.customer
              ? `${d.customer.firstName} ${d.customer.lastName}`
              : "",
            Company: d.company?.name ?? d.customer?.company?.name ?? "",
            Value: d.value,
            Stage: d.stage,
            Probability: `${d.probability}%`,
            "Expected Close": d.expectedCloseDate
              ? formatDate(d.expectedCloseDate)
              : "",
            Created: formatDate(d.createdAt),
          }))}
          filename="deals.csv"
        />
      </div>
      <DataTable
        columns={dealColumns}
        data={deals}
        searchColumn="title"
        searchPlaceholder="Filter by title..."
      />
    </div>
  );
}
