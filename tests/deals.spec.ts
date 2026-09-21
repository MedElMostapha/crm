import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@orbitcrm.dev");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/dashboard");
}

test.describe("Deals", () => {
  test("stage filter narrows the list via the URL", async ({ page }) => {
    await login(page);
    await page.goto("/deals");

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Won", exact: true }).click();

    await expect(page).toHaveURL(/stage=won/);
    await expect(page.getByText(/deals? found/)).toBeVisible();
  });

  test("kanban drag and drop moves a deal", async ({ page }) => {
    await login(page);
    await page.goto("/deals");
    await page.getByRole("tab", { name: /Kanban/ }).click();

    const source = page.locator('[data-stage="lead"] [data-deal-id]').first();
    await expect(source).toBeVisible();
    const dealId = await source.getAttribute("data-deal-id");
    expect(dealId).toBeTruthy();

    await source.dragTo(page.locator('[data-stage="qualified"]'), {
      targetPosition: { x: 120, y: 60 },
    });
    await expect(page.getByText("Deal moved to Qualified")).toBeVisible();

    const moved = page.locator(`[data-deal-id="${dealId}"]`);
    await moved.dragTo(page.locator('[data-stage="lead"]'), {
      targetPosition: { x: 120, y: 60 },
    });
    await expect(page.getByText("Deal moved to Lead")).toBeVisible();
  });

  test("deals and tasks lists expose CSV export", async ({ page }) => {
    await login(page);

    await page.goto("/deals");
    await expect(
      page.getByRole("button", { name: "Export CSV" })
    ).toBeVisible();

    await page.goto("/tasks");
    await expect(
      page.getByRole("button", { name: "Export CSV" })
    ).toBeVisible();
  });
});
