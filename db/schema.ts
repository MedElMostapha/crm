import { relations, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

// Better Auth tables
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  activities: many(activity),
}));

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// CRM tables
export const company = sqliteTable("company", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry"),
  website: text("website"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  country: text("country"),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const companyRelations = relations(company, ({ many }) => ({
  customers: many(customer),
  deals: many(deal),
}));

export const customer = sqliteTable("customer", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  companyId: text("company_id").references(() => company.id, {
    onDelete: "set null",
  }),
  email: text("email"),
  phone: text("phone"),
  status: text("status").notNull().default("lead"),
  source: text("source"),
  tags: text("tags"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const customerRelations = relations(customer, ({ one, many }) => ({
  company: one(company, {
    fields: [customer.companyId],
    references: [company.id],
  }),
  deals: many(deal),
  tasks: many(task),
  noteList: many(note),
  activities: many(activity),
}));

export const deal = sqliteTable("deal", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  customerId: text("customer_id").references(() => customer.id, {
    onDelete: "cascade",
  }),
  companyId: text("company_id").references(() => company.id, {
    onDelete: "set null",
  }),
  value: integer("value").notNull().default(0),
  probability: integer("probability").notNull().default(0),
  stage: text("stage").notNull().default("lead"),
  expectedCloseDate: integer("expected_close_date", { mode: "timestamp" }),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const dealRelations = relations(deal, ({ one, many }) => ({
  customer: one(customer, {
    fields: [deal.customerId],
    references: [customer.id],
  }),
  company: one(company, {
    fields: [deal.companyId],
    references: [company.id],
  }),
  tasks: many(task),
  activities: many(activity),
}));

export const task = sqliteTable("task", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull().default("medium"),
  status: text("status").notNull().default("todo"),
  dueDate: integer("due_date", { mode: "timestamp" }),
  assignedCustomerId: text("assigned_customer_id").references(() => customer.id, {
    onDelete: "set null",
  }),
  assignedDealId: text("assigned_deal_id").references(() => deal.id, {
    onDelete: "set null",
  }),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const taskRelations = relations(task, ({ one, many }) => ({
  customer: one(customer, {
    fields: [task.assignedCustomerId],
    references: [customer.id],
  }),
  deal: one(deal, {
    fields: [task.assignedDealId],
    references: [deal.id],
  }),
  activities: many(activity),
}));

export const note = sqliteTable("note", {
  id: text("id").primaryKey(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customer.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const noteRelations = relations(note, ({ one }) => ({
  customer: one(customer, {
    fields: [note.customerId],
    references: [customer.id],
  }),
}));

export const activity = sqliteTable("activity", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  customerId: text("customer_id").references(() => customer.id, {
    onDelete: "cascade",
  }),
  dealId: text("deal_id").references(() => deal.id, { onDelete: "cascade" }),
  taskId: text("task_id").references(() => task.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  description: text("description").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const activityRelations = relations(activity, ({ one }) => ({
  user: one(user, {
    fields: [activity.userId],
    references: [user.id],
  }),
  customer: one(customer, {
    fields: [activity.customerId],
    references: [customer.id],
  }),
  deal: one(deal, {
    fields: [activity.dealId],
    references: [deal.id],
  }),
  task: one(task, {
    fields: [activity.taskId],
    references: [task.id],
  }),
}));
