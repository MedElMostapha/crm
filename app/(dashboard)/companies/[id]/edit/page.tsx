import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { CompanyForm } from "@/features/companies/company-form";
import { getCompanyById } from "@/actions/companies";
import { Card, CardContent } from "@/components/ui/card";

interface EditCompanyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCompanyPage({ params }: EditCompanyPageProps) {
  const { id } = await params;
  const result = await getCompanyById(id);

  if (!result.success) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Company"
        description="Update company information."
      />
      <Card>
        <CardContent className="p-6">
          <CompanyForm company={result.data} />
        </CardContent>
      </Card>
    </div>
  );
}
