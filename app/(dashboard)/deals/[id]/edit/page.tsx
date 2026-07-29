import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { DealForm } from "@/features/deals/deal-form";
import { getDealById } from "@/actions/deals";
import { getCustomersForSelect } from "@/actions/customers";
import { getCompaniesForSelect } from "@/actions/companies";
import { Card, CardContent } from "@/components/ui/card";

interface EditDealPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDealPage({ params }: EditDealPageProps) {
  const { id } = await params;
  const [dealResult, customersResult, companiesResult] = await Promise.all([
    getDealById(id),
    getCustomersForSelect(),
    getCompaniesForSelect(),
  ]);

  if (!dealResult.success) {
    notFound();
  }

  const customers = customersResult.success ? customersResult.data : [];
  const companies = companiesResult.success ? companiesResult.data : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Deal" description="Update deal information." />
      <Card>
        <CardContent className="p-6">
          <DealForm
            deal={dealResult.data}
            customers={customers}
            companies={companies}
          />
        </CardContent>
      </Card>
    </div>
  );
}
