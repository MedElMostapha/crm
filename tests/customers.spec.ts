import { test, expect } from "@playwright/test";

async function login(page: any) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@orbitcrm.dev");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/dashboard");
}

test.describe("Customers", () => {
  test("customers page loads with data", async ({ page }) => {
    await login(page);
    await page.goto("/customers");

    await expect(page.getByRole("heading", { name: "Customers" })).toBeVisible();
    await expect(page.getByText(/customers? found/)).toBeVisible();
  });

  test("can create a new customer", async ({ page }) => {
    await login(page);
    await page.goto("/customers/new");

    await page.getByLabel("First Name").fill("Playwright");
    await page.getByLabel("Last Name").fill("Test");
    await page.getByLabel("Email").fill(`pw-test-${Date.now()}@example.com`);
    await page.getByLabel("Phone").fill("+1 555 1234");

    await page.getByLabel("Status").click();
    await page.getByRole("option", { name: "Active", exact: true }).click();

    await page.getByRole("button", { name: "Create Customer" }).click();

    await page.waitForURL("/customers");
    await expect(page.getByText("Customer created successfully")).toBeVisible();
  });
});
