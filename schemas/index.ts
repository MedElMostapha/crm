import { z } from "zod";
import {
  CUSTOMER_STATUSES,
  DEAL_STAGES,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "@/constants";

export const customerSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  companyId: z.string().nullable().optional(),
  email: z.string().email("Invalid email").nullable().optional().catch(null),
  phone: z.string().nullable().optional(),
  status: z.enum(
    CUSTOMER_STATUSES.map((s) => s.value) as [
      string,
      ...string[],
    ]
  ),
  source: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

export const companySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Company name is required"),
  industry: z.string().nullable().optional(),
  website: z.string().url("Invalid URL").nullable().optional().catch(null),
  phone: z.string().nullable().optional(),
  email: z.string().email("Invalid email").nullable().optional().catch(null),
  address: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export type CompanyFormValues = z.infer<typeof companySchema>;

export const dealSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Deal title is required"),
  customerId: z.string().min(1, "Customer is required"),
  companyId: z.string().nullable().optional(),
  value: z.number().min(0, "Value must be positive"),
  probability: z.number().min(0).max(100),
  stage: z.enum(DEAL_STAGES.map((s) => s.value) as [string, ...string[]]),
  expectedCloseDate: z.date().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type DealFormValues = z.infer<typeof dealSchema>;

export const taskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Task title is required"),
  description: z.string().nullable().optional(),
  priority: z.enum(
    TASK_PRIORITIES.map((p) => p.value) as [string, ...string[]]
  ),
  status: z.enum(TASK_STATUSES.map((s) => s.value) as [string, ...string[]]),
  dueDate: z.date().nullable().optional(),
  assignedCustomerId: z.string().nullable().optional(),
  assignedDealId: z.string().nullable().optional(),
  completed: z.boolean(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

export const noteSchema = z.object({
  customerId: z.string(),
  content: z.string().min(1, "Note content is required"),
});

export type NoteFormValues = z.infer<typeof noteSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

export type SearchFormValues = z.infer<typeof searchSchema>;
