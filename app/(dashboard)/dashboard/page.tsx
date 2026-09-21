import { Suspense } from "react";
import { StatCard } from "@/components/layout/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { LatestCustomers } from "@/components/dashboard/latest-customers";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { RecentDeals } from "@/components/dashboard/recent-deals";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { getDashboardStats, getDashboardCharts } from "@/actions/dashboard";
import { getActivities } from "@/actions/activities";
import { getCustomers } from "@/actions/customers";
import { getDeals } from "@/actions/deals";
import { getTasks } from "@/actions/tasks";
import {
  Users,
  Target,
  CheckSquare,
  DollarSign,
} from "lucide-react";
import { formatCurrency } from "@/utils";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your CRM performance and activities."
      />
      <Suspense fallback={<LoadingSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const statsResult = await getDashboardStats();
  const chartsResult = await getDashboardCharts();
  const activitiesResult = await getActivities(10);
  const customersResult = await getCustomers(undefined, 1, 5);
  const dealsResult = await getDeals(undefined, undefined, 1, 5);
  const tasksResult = await getTasks(undefined, undefined, undefined, 1, 5);

  const stats = statsResult.success ? statsResult.data : null;
  const activities = activitiesResult.success ? activitiesResult.data : [];
  const latestCustomers = customersResult.success
    ? customersResult.data.customers
    : [];
  const recentDeals = dealsResult.success ? dealsResult.data.deals : [];
  const upcomingTasks = tasksResult.success ? tasksResult.data.tasks : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-[fade-in-up_0.4s_ease-out]">
          <StatCard
            title="Total Customers"
            value={stats?.totalCustomers ?? 0}
            icon={Users}
            trend={{ value: 12, label: "from last month" }}
          />
        </div>
        <div className="animate-[fade-in-up_0.5s_ease-out]">
          <StatCard
            title="Active Deals"
            value={stats?.activeDeals ?? 0}
            icon={Target}
            trend={{ value: 8, label: "from last month" }}
          />
        </div>
        <div className="animate-[fade-in-up_0.6s_ease-out]">
          <StatCard
            title="Revenue"
            value={formatCurrency(stats?.revenue ?? 0)}
            icon={DollarSign}
            trend={{ value: 24, label: "from last month" }}
          />
        </div>
        <div className="animate-[fade-in-up_0.7s_ease-out]">
          <StatCard
            title="Tasks Due Today"
            value={stats?.tasksDueToday ?? 0}
            icon={CheckSquare}
            description="Pending tasks"
          />
        </div>
      </div>

      <div className="animate-[fade-in-up_0.6s_ease-out]">
        <DashboardCharts data={chartsResult.success ? chartsResult.data : null} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-[fade-in-up_0.7s_ease-out]">
          <LatestCustomers customers={latestCustomers} />
        </div>
        <div className="animate-[fade-in-up_0.8s_ease-out]">
          <RecentDeals deals={recentDeals} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-[fade-in-up_0.9s_ease-out]">
          <UpcomingTasks tasks={upcomingTasks} />
        </div>
        <div className="animate-[fade-in-up_1s_ease-out]">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
