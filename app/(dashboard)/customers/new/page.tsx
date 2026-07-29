import { PageHeader } from "@/components/layout/page-header";
import { CustomerForm } from "@/features/customers/customer-form";
import { getCompaniesForSelect } from "@/actions/companies";
import { Card, CardContent } from "@/components/ui/card";

export default async function NewCustomerPage() {
  const result = await getCompaniesForSelect();
  const companies = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Customer"
        description="Add a new customer to your CRM."
      />
      <Card>
        <CardContent className="p-6">
          <CustomerForm companies={companies} />
        </CardContent>
      </Card>
    </div>
  );
}
