import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { CustomerForm } from "@/features/customers/customer-form";
import { getCustomerById } from "@/actions/customers";
import { getCompaniesForSelect } from "@/actions/companies";
import { Card, CardContent } from "@/components/ui/card";

interface EditCustomerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const { id } = await params;
  const [customerResult, companiesResult] = await Promise.all([
    getCustomerById(id),
    getCompaniesForSelect(),
  ]);

  if (!customerResult.success) {
    notFound();
  }

  const customer = customerResult.data;
  const companies = companiesResult.success ? companiesResult.data : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Customer"
        description="Update customer information."
      />
      <Card>
        <CardContent className="p-6">
          <CustomerForm customer={customer} companies={companies} />
        </CardContent>
      </Card>
    </div>
  );
}
