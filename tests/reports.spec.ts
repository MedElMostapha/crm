import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@orbitcrm.dev");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/dashboard");
}

test.describe("Reports", () => {
  test("reports page shows summary cards and charts", async ({ page }) => {
    await login(page);
    await page.goto("/reports");

    await expect(page.getByRole("heading", { name: "Reports" })).toBeVisible();
    await expect(page.getByText("Open Deals", { exact: true })).toBeVisible();
    await expect(page.getByText("Win Rate", { exact: true })).toBeVisible();
    await expect(page.getByText("Avg Deal Size", { exact: true })).toBeVisible();
    await expect(page.getByText("Revenue by Month")).toBeVisible();
    await expect(page.getByText("Win Rate Over Time")).toBeVisible();
    await expect(page.getByText("Deals by Stage")).toBeVisible();
  });

  test("reports is reachable from the sidebar navigation", async ({ page }) => {
    await login(page);
    await expect(page.getByRole("link", { name: "Reports" })).toBeVisible();
    await page.getByRole("link", { name: "Reports" }).click();
    await expect(page).toHaveURL(/\/reports$/);
    await expect(page.getByRole("heading", { name: "Reports" })).toBeVisible();
  });
});