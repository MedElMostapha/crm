"use client";

import { DataTable } from "@/components/data-table";
import { ExportCsv } from "@/components/export-csv";
import { dealColumns } from "./deal-columns";
import { BulkDealActions } from "./bulk-deal-actions";
import { DealWithRelations } from "@/types";
import { formatDate } from "@/utils";

interface DealTableProps {
  deals: DealWithRelations[];
  total: number;
}

export function DealTable({ deals, total }: DealTableProps) {
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
        selectable
        getRowIdValue={(deal) => deal.id}
        bulkActions={(selected, clear) => (
          <BulkDealActions deals={selected} clear={clear} />
        )}
      />
    </div>
  );
}