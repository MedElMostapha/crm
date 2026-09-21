import { getCustomers } from "@/actions/customers";
import { CustomerTable } from "./customer-table";
import { EmptyState } from "@/components/empty-state";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

interface CustomerListProps {
  search?: string;
  status?: string;
  source?: string;
  page?: number;
}

export async function CustomerList({
  search,
  status,
  source,
  page = 1,
}: CustomerListProps) {
  const result = await getCustomers(search, status, source, page);

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

  return <CustomerTable customers={customers} total={total} />;
}
