import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@orbitcrm.dev");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/dashboard");
}

test.describe("Company detail", () => {
  test("shows overview stats and related records", async ({ page }) => {
    await login(page);
    await page.goto("/companies");

    const firstCompany = page.locator("tbody tr").first().getByRole("link");
    await expect(firstCompany).toBeVisible();
    await firstCompany.click();
    await page.waitForURL(/\/companies\/[^/]+$/);

    await expect(page.getByText(/Customer(s)?/).first()).toBeVisible();
    await expect(page.getByText(/Deals?$/).first()).toBeVisible();
    await expect(page.getByText("Pipeline value")).toBeVisible();
    await expect(page.getByRole("tab", { name: "Customers" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Deals" })).toBeVisible();
  });

  test("deals tab lists deals with stage badges", async ({ page }) => {
    await login(page);
    await page.goto("/companies");

    const firstCompany = page.locator("tbody tr").first().getByRole("link");
    await firstCompany.click();
    await page.waitForURL(/\/companies\/[^/]+$/);

    await page.getByRole("tab", { name: "Deals" }).click();
    await expect(
      page.getByText(/Won|Lead|Proposal|Negotiation|Qualified|Lost|No deals yet/)
        .first()
    ).toBeVisible();
  });
});