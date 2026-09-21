"use client";

import { DataTable } from "@/components/data-table";
import { ExportCsv } from "@/components/export-csv";
import { customerColumns } from "./customer-columns";
import { BulkCustomerActions } from "./bulk-customer-actions";
import { CustomerWithCompany } from "@/types";

interface CustomerTableProps {
  customers: CustomerWithCompany[];
  total: number;
}

export function CustomerTable({ customers, total }: CustomerTableProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} customer{total !== 1 ? "s" : ""} found
        </p>
        <ExportCsv
          data={customers.map((c) => ({
            Name: `${c.firstName} ${c.lastName}`,
            Email: c.email,
            Phone: c.phone,
            Company: c.company?.name ?? "",
            Status: c.status,
            Source: c.source,
            Tags: c.tags,
          }))}
          filename="customers.csv"
        />
      </div>
      <DataTable
        columns={customerColumns}
        data={customers}
        searchColumn="email"
        searchPlaceholder="Filter by email..."
        selectable
        getRowIdValue={(customer) => customer.id}
        bulkActions={(selected, clear) => (
          <BulkCustomerActions customers={selected} clear={clear} />
        )}
      />
    </div>
  );
}