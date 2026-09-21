import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { getCompanyById } from "@/actions/companies";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEAL_STAGES, STAGE_STYLES } from "@/constants";
import {
  Building2,
  Pencil,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Briefcase,
  CircleDollarSign,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/utils";
import { cn } from "@/lib/utils";

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

  const websiteUrl = company.website
    ? /^\w+:\/\//.test(company.website)
      ? company.website
      : `https://${company.website}`
    : null;

  const dealsCount = company.deals.length;
  const pipelineValue = company.deals.reduce(
    (sum, deal) => (deal.stage !== "lost" ? sum + deal.value : sum),
    0
  );

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

      {company.industry && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Building2 className="h-3.5 w-3.5" />
            {company.industry}
          </span>
          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-input bg-card px-3 py-1 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Globe className="h-3.5 w-3.5" />
              {company.website}
            </a>
          )}
          {company.country && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-input bg-card px-3 py-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {company.country}
            </span>
          )}
        </div>
      )}

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
              {websiteUrl && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-primary"
                  >
                    {company.website}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {[company.address, company.country].filter(Boolean).join(", ") ||
                  "No address"}
              </div>
              {company.description && (
                <p className="text-muted-foreground">{company.description}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Added {formatDate(company.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold tabular-nums">
                    {company.customers.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Customer{company.customers.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold tabular-nums">
                    {dealsCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Deal{dealsCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                  <CircleDollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold tabular-nums">
                    {formatCurrency(pipelineValue)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Pipeline value
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

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
                company.deals.map((deal) => {
                  const stage = DEAL_STAGES.find((s) => s.value === deal.stage);
                  return (
                    <Card key={deal.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <Link
                              href={`/deals/${deal.id}`}
                              className="font-medium transition-colors hover:text-primary"
                            >
                              {deal.title}
                            </Link>
                            {deal.customer && (
                              <p className="text-sm text-muted-foreground">
                                {deal.customer.firstName}{" "}
                                {deal.customer.lastName}
                              </p>
                            )}
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                                STAGE_STYLES[deal.stage] ??
                                  "bg-muted text-muted-foreground"
                              )}
                            >
                              {stage?.label ?? deal.stage}
                            </span>
                            <span className="font-medium tabular-nums">
                              {formatCurrency(deal.value)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}