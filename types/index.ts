import * as schema from "@/db/schema";

export type User = typeof schema.user.$inferSelect;
export type Company = typeof schema.company.$inferSelect;
export type Customer = typeof schema.customer.$inferSelect;
export type Deal = typeof schema.deal.$inferSelect;
export type Task = typeof schema.task.$inferSelect;
export type Note = typeof schema.note.$inferSelect;
export type Activity = typeof schema.activity.$inferSelect;

export type DealStage =
  | "lead"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export type CustomerStatus = "lead" | "active" | "inactive" | "churned";

export type TaskPriority = "low" | "medium" | "high";

export type TaskStatus = "todo" | "in_progress" | "done";

export type ActivityType =
  | "customer_created"
  | "customer_updated"
  | "deal_moved"
  | "task_completed"
  | "login"
  | "logout"
  | "note_created";

export type CustomerWithCompany = Customer & {
  company: Company | null;
};

export type DealWithRelations = Deal & {
  customer: CustomerWithCompany | null;
  company: Company | null;
};

export type TaskWithRelations = Task & {
  customer: CustomerWithCompany | null;
  deal: Deal | null;
};

export type ActivityWithRelations = Activity & {
  user: User | null;
  customer: Customer | null;
  deal: Deal | null;
  task: Task | null;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type SearchResult = {
  id: string;
  type: "customer" | "company" | "deal" | "task";
  title: string;
  subtitle: string;
  href: string;
};

export type DashboardStats = {
  totalCustomers: number;
  newCustomers: number;
  activeDeals: number;
  tasksDueToday: number;
  revenue: number;
  monthlyGrowth: number;
  trends: {
    customers: number;
    revenue: number;
    activeDeals: number;
  };
};

export type DateRange = "30d" | "90d" | "12m" | "ytd";

export type PipelineStageMetric = {
  stage: DealStage;
  label: string;
  color: string;
  count: number;
  value: number;
  forecast: number;
};

export type PipelineAnalytics = {
  stages: PipelineStageMetric[];
  pipelineValue: number;
  weightedForecast: number;
  openDeals: number;
  wonDeals: number;
  lostDeals: number;
  winRate: number;
  avgDealSize: number;
};

export type NotificationType =
  | "task_overdue"
  | "task_due_today"
  | "deal_stuck"
  | "deal_closing";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  href: string;
  severity: "danger" | "warning" | "info";
  date: Date;
};

export type TimelineKind =
  | "customer"
  | "company"
  | "deal"
  | "task"
  | "note"
  | "activity";

export type TimelineItem = {
  id: string;
  kind: TimelineKind;
  event: string;
  title: string;
  description?: string;
  date: Date;
  href?: string;
};
