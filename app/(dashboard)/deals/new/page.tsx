import { PageHeader } from "@/components/layout/page-header";
import { DealForm } from "@/features/deals/deal-form";
import { getCustomersForSelect } from "@/actions/customers";
import { getCompaniesForSelect } from "@/actions/companies";
import { Card, CardContent } from "@/components/ui/card";

export default async function NewDealPage() {
  const [customersResult, companiesResult] = await Promise.all([
    getCustomersForSelect(),
    getCompaniesForSelect(),
  ]);

  const customers = customersResult.success ? customersResult.data : [];
  const companies = companiesResult.success ? companiesResult.data : [];

  return (
    <div className="space-y-6">
      <PageHeader title="New Deal" description="Add a new deal to your pipeline." />
      <Card>
        <CardContent className="p-6">
          <DealForm customers={customers} companies={companies} />
        </CardContent>
      </Card>
    </div>
  );
}
