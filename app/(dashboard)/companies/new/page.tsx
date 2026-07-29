import { PageHeader } from "@/components/layout/page-header";
import { CompanyForm } from "@/features/companies/company-form";
import { Card, CardContent } from "@/components/ui/card";

export default function NewCompanyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New Company"
        description="Add a new company to your CRM."
      />
      <Card>
        <CardContent className="p-6">
          <CompanyForm />
        </CardContent>
      </Card>
    </div>
  );
}
