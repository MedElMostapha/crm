import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/search-input";
import { CompanyList } from "@/features/companies/company-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Companies"
        description="Manage the companies in your pipeline."
        actions={
          <Button asChild>
            <Link href="/companies/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Link>
          </Button>
        }
      />
      <div className="flex items-center gap-4">
        <SearchInput placeholder="Search companies..." />
      </div>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
        <CompanyListWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CompanyListWrapper({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : undefined;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;

  return <CompanyList search={search} page={page} />;
}
