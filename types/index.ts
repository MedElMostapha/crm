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
};

export type TimelineItem = {
  id: string;
  type: ActivityType;
  description: string;
  createdAt: Date;
  actor?: string;
};
