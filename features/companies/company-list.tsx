import { getCompanies } from "@/actions/companies";
import { DataTable } from "@/components/data-table";
import { companyColumns } from "./company-columns";
import { EmptyState } from "@/components/empty-state";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

interface CompanyListProps {
  search?: string;
  page?: number;
}

export async function CompanyList({ search, page = 1 }: CompanyListProps) {
  const result = await getCompanies(search, page);

  if (!result.success) {
    return <p className="text-sm text-destructive">{result.error}</p>;
  }

  const { companies, total } = result.data;

  if (companies.length === 0) {
    return (
      <EmptyState
        title="No companies found"
        description="Add companies to associate them with customers and deals."
        icon={Building2}
        action={
          <Button asChild>
            <Link href="/companies/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <p className="mb-2 text-sm text-muted-foreground">
        {total} compan{total !== 1 ? "ies" : "y"} found
      </p>
      <DataTable
        columns={companyColumns}
        data={companies}
        searchColumn="name"
        searchPlaceholder="Filter by name..."
      />
    </div>
  );
}
