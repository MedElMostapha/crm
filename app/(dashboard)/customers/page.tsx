import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/search-input";
import { FilterSelect } from "@/components/filter-select";
import { CustomerList } from "@/features/customers/customer-list";
import { CustomerImport } from "@/features/customers/customer-import";
import { Button } from "@/components/ui/button";
import { CUSTOMER_SOURCES, CUSTOMER_STATUSES } from "@/constants";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customer relationships."
        actions={
          <>
            <CustomerImport />
            <Button asChild>
              <Link href="/customers/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Link>
            </Button>
          </>
        }
      />
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="Search customers..." />
        <FilterSelect
          param="status"
          allLabel="All statuses"
          options={CUSTOMER_STATUSES}
        />
        <FilterSelect
          param="source"
          allLabel="All sources"
          options={CUSTOMER_SOURCES.map((source) => ({
            value: source,
            label: source,
          }))}
        />
      </div>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
        <CustomerListWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CustomerListWrapper({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const source = typeof params.source === "string" ? params.source : undefined;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;

  return <CustomerList search={search} status={status} source={source} page={page} />;
}
