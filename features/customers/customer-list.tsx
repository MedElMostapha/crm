import { getCustomers } from "@/actions/customers";
import { DataTable } from "@/components/data-table";
import { ExportCsv } from "@/components/export-csv";
import { customerColumns } from "./customer-columns";
import { EmptyState } from "@/components/empty-state";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

interface CustomerListProps {
  search?: string;
  page?: number;
}

export async function CustomerList({ search, page = 1 }: CustomerListProps) {
  const result = await getCustomers(search, page);

  if (!result.success) {
    return <p className="text-sm text-destructive">{result.error}</p>;
  }

  const { customers, total } = result.data;

  if (customers.length === 0) {
    return (
      <EmptyState
        title="No customers found"
        description="Get started by adding your first customer."
        icon={Users}
        action={
          <Button asChild>
            <Link href="/customers/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
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
      />
    </div>
  );
}
