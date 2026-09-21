import { Suspense } from "react";
import { StatCard } from "@/components/layout/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { LatestCustomers } from "@/components/dashboard/latest-customers";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { RecentDeals } from "@/components/dashboard/recent-deals";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { PipelineFunnel } from "@/components/dashboard/pipeline-funnel";
import { DateRangeFilter } from "@/components/dashboard/date-range-filter";
import {
  getDashboardStats,
  getDashboardCharts,
  getPipelineAnalytics,
} from "@/actions/dashboard";
import { getActivities } from "@/actions/activities";
import { getCustomers } from "@/actions/customers";
import { getDeals } from "@/actions/deals";
import { getTasks } from "@/actions/tasks";
import {
  Users,
  Target,
  CheckSquare,
  DollarSign,
  Percent,
  GitBranch,
  TrendingUp,
  HandCoins,
} from "lucide-react";
import { formatCurrency } from "@/utils";
import { normalizeDateRange } from "@/lib/date-range";
import type { DateRange } from "@/types";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const range = normalizeDateRange(params.range);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your CRM performance and activities."
        actions={
          <Suspense fallback={null}>
            <DateRangeFilter value={range} />
          </Suspense>
        }
      />
      <Suspense key={range} fallback={<LoadingSkeleton />}>
        <DashboardContent range={range} />
      </Suspense>
    </div>
  );
}

async function DashboardContent({ range }: { range: DateRange }) {
  const [
    statsResult,
    chartsResult,
    pipelineResult,
    activitiesResult,
    customersResult,
    dealsResult,
    tasksResult,
  ] = await Promise.all([
    getDashboardStats(range),
    getDashboardCharts(range),
    getPipelineAnalytics(),
    getActivities(10),
    getCustomers(undefined, 1, 5),
    getDeals(undefined, undefined, 1, 5),
    getTasks(undefined, undefined, undefined, 1, 5),
  ]);

  const stats = statsResult.success ? statsResult.data : null;
  const pipeline = pipelineResult.success ? pipelineResult.data : null;
  const activities = activitiesResult.success ? activitiesResult.data : [];
  const latestCustomers = customersResult.success
    ? customersResult.data.customers
    : [];
  const recentDeals = dealsResult.success ? dealsResult.data.deals : [];
  const upcomingTasks = tasksResult.success ? tasksResult.data.tasks : [];

  const trendLabel = "vs previous period";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-[fade-in-up_0.4s_ease-out]">
          <StatCard
            title="Total Customers"
            value={stats?.totalCustomers ?? 0}
            icon={Users}
            trend={{ value: stats?.trends.customers ?? 0, label: trendLabel }}
          />
        </div>
        <div className="animate-[fade-in-up_0.5s_ease-out]">
          <StatCard
            title="Active Deals"
            value={stats?.activeDeals ?? 0}
            icon={Target}
            trend={{ value: stats?.trends.activeDeals ?? 0, label: trendLabel }}
          />
        </div>
        <div className="animate-[fade-in-up_0.6s_ease-out]">
          <StatCard
            title="Revenue"
            value={formatCurrency(stats?.revenue ?? 0)}
            icon={DollarSign}
            trend={{ value: stats?.trends.revenue ?? 0, label: trendLabel }}
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-[fade-in-up_0.4s_ease-out]">
          <StatCard
            title="Win Rate"
            value={`${pipeline?.winRate ?? 0}%`}
            description={`${pipeline?.wonDeals ?? 0} won · ${pipeline?.lostDeals ?? 0} lost`}
            icon={Percent}
            gradient="emerald"
          />
        </div>
        <div className="animate-[fade-in-up_0.5s_ease-out]">
          <StatCard
            title="Pipeline Value"
            value={formatCurrency(pipeline?.pipelineValue ?? 0)}
            description={`${pipeline?.openDeals ?? 0} open deals`}
            icon={GitBranch}
            gradient="violet"
          />
        </div>
        <div className="animate-[fade-in-up_0.6s_ease-out]">
          <StatCard
            title="Weighted Forecast"
            value={formatCurrency(pipeline?.weightedForecast ?? 0)}
            description="Probability-adjusted"
            icon={TrendingUp}
            gradient="amber"
          />
        </div>
        <div className="animate-[fade-in-up_0.7s_ease-out]">
          <StatCard
            title="Avg Deal Size"
            value={formatCurrency(pipeline?.avgDealSize ?? 0)}
            description="Won deals"
            icon={HandCoins}
            gradient="indigo"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="animate-[fade-in-up_0.6s_ease-out] lg:col-span-2">
          <DashboardCharts data={chartsResult.success ? chartsResult.data : null} />
        </div>
        <div className="animate-[fade-in-up_0.7s_ease-out] lg:col-span-1">
          <PipelineFunnel data={pipeline} />
        </div>
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
