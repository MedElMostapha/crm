import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/search-input";
import { DealList } from "@/features/deals/deal-list";
import { DealKanban } from "@/features/deals/deal-kanban";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { getDeals } from "@/actions/deals";

export default function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Deals"
        description="Track and manage your sales pipeline."
        actions={
          <Button asChild>
            <Link href="/deals/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Deal
            </Link>
          </Button>
        }
      />
      <div className="flex items-center gap-4">
        <SearchInput placeholder="Search deals..." />
      </div>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
        <DealsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function DealsContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : undefined;
  const stage = typeof params.stage === "string" ? params.stage : undefined;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const view = typeof params.view === "string" ? params.view : "list";

  const result = await getDeals(search, stage, page);
  if (!result.success) {
    return <p className="text-sm text-destructive">{result.error}</p>;
  }

  return (
    <Tabs defaultValue={view}>
      <TabsList className="mb-4">
        <TabsTrigger value="list">
          <List className="mr-2 h-4 w-4" />
          List
        </TabsTrigger>
        <TabsTrigger value="kanban">
          <LayoutGrid className="mr-2 h-4 w-4" />
          Kanban
        </TabsTrigger>
      </TabsList>
      <TabsContent value="list">
        <DealList search={search} stage={stage} page={page} />
      </TabsContent>
      <TabsContent value="kanban">
        <DealKanban deals={result.data.deals} />
      </TabsContent>
    </Tabs>
  );
}
