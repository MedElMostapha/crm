import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { getCustomerById } from "@/actions/customers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Mail, Phone, Building2, Calendar } from "lucide-react";
import { formatDate, formatCurrency } from "@/utils";
import { CUSTOMER_STATUSES } from "@/constants";
import { CustomerTimeline } from "@/features/customers/customer-timeline";
import { CustomerNotes } from "@/features/customers/customer-notes";
import { ActivityWithRelations } from "@/types";
interface CustomerPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { id } = await params;
  const result = await getCustomerById(id);

  if (!result.success) {
    notFound();
  }

  const customer = result.data;
  const status = CUSTOMER_STATUSES.find((s) => s.value === customer.status);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${customer.firstName} ${customer.lastName}`}
        description="Customer profile and history."
        actions={
          <Button asChild variant="outline">
            <Link href={`/customers/${customer.id}/edit`}>
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
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{status?.label ?? customer.status}</Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {customer.email ?? "No email"}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                {customer.phone ?? "No phone"}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                {customer.company?.name ?? "No company"}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Added {formatDate(customer.createdAt)}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Tabs defaultValue="deals">
            <TabsList>
              <TabsTrigger value="deals">Deals</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            <TabsContent value="deals" className="space-y-4">
              {customer.deals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No deals yet.</p>
              ) : (
                customer.deals.map((deal) => (
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
            <TabsContent value="tasks" className="space-y-4">
              {customer.tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks yet.</p>
              ) : (
                customer.tasks.map((task) => (
                  <Card key={task.id}>
                    <CardContent className="p-4">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.status} · Due {formatDate(task.dueDate)}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
            <TabsContent value="notes">
              <CustomerNotes customerId={customer.id} notes={customer.noteList} />
            </TabsContent>
            <TabsContent value="timeline">
              <CustomerTimeline
                customer={{
                  ...customer,
                  activities: customer.activities as ActivityWithRelations[],
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
