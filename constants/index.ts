export const DEAL_STAGES = [
  { value: "lead", label: "Lead", color: "bg-zinc-500" },
  { value: "qualified", label: "Qualified", color: "bg-blue-500" },
  { value: "proposal", label: "Proposal", color: "bg-amber-500" },
  { value: "negotiation", label: "Negotiation", color: "bg-purple-500" },
  { value: "won", label: "Won", color: "bg-emerald-500" },
  { value: "lost", label: "Lost", color: "bg-red-500" },
] as const;

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

export const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Customers", href: "/customers", icon: "Users" },
  { label: "Companies", href: "/companies", icon: "Building2" },
  { label: "Deals", href: "/deals", icon: "Target" },
  { label: "Tasks", href: "/tasks", icon: "CheckSquare" },
] as const;

export const PAGE_SIZE = 10;
