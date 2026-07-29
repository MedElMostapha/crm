import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { TaskForm } from "@/features/tasks/task-form";
import { getTaskById } from "@/actions/tasks";
import { getCustomersForSelect } from "@/actions/customers";
import { getDeals } from "@/actions/deals";
import { Card, CardContent } from "@/components/ui/card";

interface EditTaskPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;
  const [taskResult, customersResult, dealsResult] = await Promise.all([
    getTaskById(id),
    getCustomersForSelect(),
    getDeals(undefined, undefined, 1, 100),
  ]);

  if (!taskResult.success) {
    notFound();
  }

  const customers = customersResult.success ? customersResult.data : [];
  const deals = dealsResult.success ? dealsResult.data.deals : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Task" description="Update task details." />
      <Card>
        <CardContent className="p-6">
          <TaskForm
            task={taskResult.data}
            customers={customers}
            deals={deals}
          />
        </CardContent>
      </Card>
    </div>
  );
}
