export const DEAL_STAGES = [
  { value: "lead", label: "Lead", color: "bg-zinc-500" },
  { value: "qualified", label: "Qualified", color: "bg-blue-500" },
  { value: "proposal", label: "Proposal", color: "bg-amber-500" },
  { value: "negotiation", label: "Negotiation", color: "bg-purple-500" },
  { value: "won", label: "Won", color: "bg-emerald-500" },
  { value: "lost", label: "Lost", color: "bg-red-500" },
] as const;

export const STAGE_STYLES: Record<string, string> = {
  lead: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  qualified:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  proposal:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  negotiation:
    "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  won: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  lost: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export const CUSTOMER_STATUSES = [
  { value: "lead", label: "Lead" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "churned", label: "Churned" },
] as const;

export const CUSTOMER_SOURCES = [
  "Website",
  "Referral",
  "Social Media",
  "Email",
  "Phone",
  "Event",
  "Advertisement",
  "Other",
] as const;

export const TASK_PRIORITIES = [
  { value: "low", label: "Low", color: "bg-blue-500" },
  { value: "medium", label: "Medium", color: "bg-amber-500" },
  { value: "high", label: "High", color: "bg-red-500" },
] as const;

export const TASK_STATUSES = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
] as const;

export const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Real Estate",
  "Marketing",
  "Consulting",
  "Other",
] as const;

export const ACTIVITY_TYPES = [
  { value: "customer_created", label: "Customer created" },
  { value: "customer_updated", label: "Customer updated" },
  { value: "deal_moved", label: "Deal moved" },
  { value: "task_completed", label: "Task completed" },
  { value: "login", label: "Login" },
  { value: "logout", label: "Logout" },
  { value: "note_created", label: "Note created" },
] as const;

export const APP_NAME = "Orbit CRM";

export const DATE_RANGES = [
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "12m", label: "12 months" },
  { value: "ytd", label: "Year to date" },
] as const;

export const DEFAULT_DATE_RANGE = "90d";

export const STUCK_DEAL_DAYS = 14;

export const CLOSING_SOON_DAYS = 7;

export const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Customers", href: "/customers", icon: "Users" },
  { label: "Companies", href: "/companies", icon: "Building2" },
  { label: "Deals", href: "/deals", icon: "Target" },
  { label: "Tasks", href: "/tasks", icon: "CheckSquare" },
  { label: "Reports", href: "/reports", icon: "BarChart3" },
] as const;

export const PAGE_SIZE = 10;
