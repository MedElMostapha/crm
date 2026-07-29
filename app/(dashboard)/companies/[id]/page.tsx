import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { getCompanyById } from "@/actions/companies";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Mail, Phone, Globe, MapPin } from "lucide-react";
import { formatDate, formatCurrency } from "@/utils";

interface CompanyPageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params;
  const result = await getCompanyById(id);

  if (!result.success) {
    notFound();
  }

  const company = result.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={company.name}
        description="Company profile and related records."
        actions={
          <Button asChild variant="outline">
            <Link href={`/companies/${company.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {company.email ?? "No email"}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                {company.phone ?? "No phone"}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-4 w-4" />
                {company.website ?? "No website"}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {company.address ?? "No address"}
              </div>
              <p className="text-muted-foreground">{company.description}</p>
              <p className="text-xs text-muted-foreground">
                Added {formatDate(company.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Tabs defaultValue="customers">
            <TabsList>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="deals">Deals</TabsTrigger>
            </TabsList>
            <TabsContent value="customers" className="space-y-4">
              {company.customers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No customers yet.
                </p>
              ) : (
                company.customers.map((customer) => (
                  <Card key={customer.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {customer.email}
                          </p>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/customers/${customer.id}`}>View</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
            <TabsContent value="deals" className="space-y-4">
              {company.deals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No deals yet.</p>
              ) : (
                company.deals.map((deal) => (
                  <Card key={deal.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{deal.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {deal.stage} · {formatCurrency(deal.value)}
                          </p>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/deals/${deal.id}`}>View</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
