import { PageHeader } from "@/components/layout/page-header";
import { TaskForm } from "@/features/tasks/task-form";
import { getCustomersForSelect } from "@/actions/customers";
import { getDeals } from "@/actions/deals";
import { Card, CardContent } from "@/components/ui/card";

export default async function NewTaskPage() {
  const [customersResult, dealsResult] = await Promise.all([
    getCustomersForSelect(),
    getDeals(undefined, undefined, 1, 100),
  ]);

  const customers = customersResult.success ? customersResult.data : [];
  const deals = dealsResult.success ? dealsResult.data.deals : [];

  return (
    <div className="space-y-6">
      <PageHeader title="New Task" description="Add a new task to your list." />
      <Card>
        <CardContent className="p-6">
          <TaskForm customers={customers} deals={deals} />
        </CardContent>
      </Card>
    </div>
  );
}
