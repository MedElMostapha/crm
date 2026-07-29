import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { getDealById } from "@/actions/deals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, User, Building2, Calendar, TrendingUp } from "lucide-react";
import { formatDate, formatCurrency } from "@/utils";
import { DEAL_STAGES } from "@/constants";

interface DealPageProps {
  params: Promise<{ id: string }>;
}

export default async function DealPage({ params }: DealPageProps) {
  const { id } = await params;
  const result = await getDealById(id);

  if (!result.success) {
    notFound();
  }

  const deal = result.data;
  const stage = DEAL_STAGES.find((s) => s.value === deal.stage);

  return (
    <div className="space-y-6">
      <PageHeader
        title={deal.title}
        description="Deal details and related tasks."
        actions={
          <Button asChild variant="outline">
            <Link href={`/deals/${deal.id}/edit`}>
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
            <Badge variant="secondary">{stage?.label ?? deal.stage}</Badge>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                {formatCurrency(deal.value)}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                {deal.customer
                  ? `${deal.customer.firstName} ${deal.customer.lastName}`
                  : "No customer"}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                {deal.company?.name ?? "No company"}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Expected close {formatDate(deal.expectedCloseDate)}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Tabs defaultValue="tasks">
            <TabsList>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks" className="space-y-4">
              {deal.tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks yet.</p>
              ) : (
                deal.tasks.map((task) => (
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
            <TabsContent value="activity" className="space-y-4">
              {deal.activities.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No activity yet.
                </p>
              ) : (
                deal.activities.map((activity) => (
                  <Card key={activity.id}>
                    <CardContent className="p-4">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(activity.createdAt)}
                      </p>
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
