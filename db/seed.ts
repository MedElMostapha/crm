import { db } from "./index";
import * as schema from "./schema";
import { auth } from "@/lib/auth";
import { generateId } from "@/utils";
import {
  CUSTOMER_STATUSES,
  CUSTOMER_SOURCES,
  DEAL_STAGES,
  INDUSTRIES,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "@/constants";

const firstNames = [
  "James",
  "Mary",
  "Robert",
  "Patricia",
  "John",
  "Jennifer",
  "Michael",
  "Linda",
  "David",
  "Elizabeth",
  "William",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Charles",
  "Karen",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
];

const companyNames = [
  "Acme Corp",
  "Globex",
  "Soylent Corp",
  "Initech",
  "Umbrella Corp",
  "Hooli",
  "Vehement Capital",
  "Massive Dynamic",
];

function pick<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function seed() {
  console.log("Seeding database...");

  // Create default user
  const userEmail = "demo@orbitcrm.dev";
  const userPassword = "password123";

  try {
    await auth.api.signUpEmail({
      body: {
        email: userEmail,
        password: userPassword,
        name: "Demo User",
      },
    });
    console.log("Created default user:", userEmail);
  } catch (error) {
    console.log(
      "Default user may already exist or error:",
      error instanceof Error ? error.message : error
    );
  }

  // Create companies
  const companyIds: string[] = [];
  for (const name of companyNames) {
    const id = generateId();
    companyIds.push(id);
    await db.insert(schema.company).values({
      id,
      name,
      industry: pick(INDUSTRIES),
      website: `https://${name.toLowerCase().replace(/\s+/g, "")}.com`,
      phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(
        Math.floor(Math.random() * 9000) + 1000
      )}`,
      email: `contact@${name.toLowerCase().replace(/\s+/g, "")}.com`,
      address: `${Math.floor(Math.random() * 9000) + 1000} ${pick([
        "Main St",
        "Market St",
        "Broadway",
        "First Ave",
      ])}`,
      country: "USA",
      description: `${name} is a leading company in its industry.`,
      createdAt: randomDate(new Date(2024, 0, 1), new Date()),
      updatedAt: new Date(),
    });
  }
  console.log("Created companies");

  // Create customers
  const customerIds: string[] = [];
  for (let i = 0; i < 20; i++) {
    const id = generateId();
    const firstName = pick(firstNames);
    const lastName = pick(lastNames);
    customerIds.push(id);
    await db.insert(schema.customer).values({
      id,
      firstName,
      lastName,
      companyId: Math.random() > 0.3 ? pick(companyIds) : null,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${pick([
        "gmail.com",
        "outlook.com",
        "company.com",
      ])}`,
      phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(
        Math.floor(Math.random() * 9000) + 1000
      )}`,
      status: pick(CUSTOMER_STATUSES).value,
      source: pick(CUSTOMER_SOURCES),
      tags: pick(["vip", "prospect", "lead", "inactive", ""]),
      notes: Math.random() > 0.5 ? "Key decision maker" : null,
      createdAt: randomDate(new Date(2024, 0, 1), new Date()),
      updatedAt: new Date(),
    });
  }
  console.log("Created customers");

  // Create deals
  const dealIds: string[] = [];
  for (let i = 0; i < 25; i++) {
    const id = generateId();
    const customerId = pick(customerIds);
    const customer = await db.query.customer.findFirst({
      where: (c, { eq }) => eq(c.id, customerId),
    });
    dealIds.push(id);
    await db.insert(schema.deal).values({
      id,
      title: `Deal ${i + 1}: ${pick([
        "Enterprise License",
        "Consulting Project",
        "Software Subscription",
        "Support Contract",
        "Implementation Services",
      ])}`,
      customerId,
      companyId: customer?.companyId,
      value: Math.floor(Math.random() * 100000) + 5000,
      probability: Math.floor(Math.random() * 100),
      stage: pick(DEAL_STAGES).value,
      expectedCloseDate: randomDate(new Date(), new Date(2026, 11, 31)),
      notes: Math.random() > 0.5 ? "Follow up next week" : null,
      createdAt: randomDate(new Date(2024, 0, 1), new Date()),
      updatedAt: new Date(),
    });
  }
  console.log("Created deals");

  // Create tasks
  const taskIds: string[] = [];
  for (let i = 0; i < 30; i++) {
    const id = generateId();
    const assignedCustomerId = Math.random() > 0.3 ? pick(customerIds) : null;
    const assignedDealId = Math.random() > 0.5 ? pick(dealIds) : null;
    taskIds.push(id);
    await db.insert(schema.task).values({
      id,
      title: `Task ${i + 1}: ${pick([
        "Follow up email",
        "Schedule demo",
        "Prepare proposal",
        "Contract review",
        "Call back",
      ])}`,
      description: Math.random() > 0.5 ? "Important follow-up" : null,
      priority: pick(TASK_PRIORITIES).value,
      status: pick(TASK_STATUSES).value,
      dueDate: randomDate(new Date(), new Date(2026, 11, 31)),
      assignedCustomerId,
      assignedDealId,
      completed: Math.random() > 0.7,
      createdAt: randomDate(new Date(2024, 0, 1), new Date()),
      updatedAt: new Date(),
    });
  }
  console.log("Created tasks");

  // Create notes
  for (const customerId of customerIds.slice(0, 10)) {
    await db.insert(schema.note).values({
      id: generateId(),
      customerId,
      content: pick([
        "Met at industry conference. Interested in enterprise plan.",
        "Prefers email communication. Budget approved.",
        "Need to send case studies.",
        "Decision pending from CTO.",
      ]),
      createdAt: randomDate(new Date(2024, 0, 1), new Date()),
      updatedAt: new Date(),
    });
  }
  console.log("Created notes");

  // Create activities
  const activityTypes = [
    "customer_created",
    "customer_updated",
    "deal_moved",
    "task_completed",
    "note_created",
  ] as const;

  for (let i = 0; i < 40; i++) {
    const type = pick(activityTypes);
    await db.insert(schema.activity).values({
      id: generateId(),
      customerId: Math.random() > 0.3 ? pick(customerIds) : null,
      dealId: Math.random() > 0.6 ? pick(dealIds) : null,
      taskId: Math.random() > 0.7 ? pick(taskIds) : null,
      type,
      description: `Activity: ${type}`,
      createdAt: randomDate(new Date(2024, 0, 1), new Date()),
    });
  }
  console.log("Created activities");

  console.log("Seed complete!");
  console.log(`Login with: ${userEmail} / ${userPassword}`);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
