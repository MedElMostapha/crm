import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@orbitcrm.dev");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/dashboard");
}

test.describe("Dashboard", () => {
  test("dashboard shows stats and widgets", async ({ page }) => {
    await login(page);

    await expect(page.getByText("Total Customers").first()).toBeVisible();
    await expect(page.getByText("Active Deals").first()).toBeVisible();
    await expect(page.getByText("Revenue").first()).toBeVisible();
    await expect(page.getByText("Tasks Due Today").first()).toBeVisible();
    await expect(page.getByText("Recent Activity").first()).toBeVisible();
  });

  test("sidebar navigation works", async ({ page }) => {
    await login(page);

    await page.getByRole("link", { name: "Customers" }).click();
    await expect(page).toHaveURL("/customers");

    await page.getByRole("link", { name: "Companies" }).click();
    await expect(page).toHaveURL("/companies");

    await page.getByRole("link", { name: "Deals" }).click();
    await expect(page).toHaveURL("/deals");

    await page.getByRole("link", { name: "Tasks" }).click();
    await expect(page).toHaveURL("/tasks");
  });
});
