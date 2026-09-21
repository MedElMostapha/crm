import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@orbitcrm.dev");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/dashboard");
}

test.describe("Timeline", () => {
  test("customer timeline shows merged events", async ({ page }) => {
    await login(page);
    await page.goto("/customers");

    await page
      .locator("table tbody tr")
      .first()
      .getByRole("link")
      .first()
      .click();
    await page.getByRole("tab", { name: "Timeline" }).click();

    await expect(page.getByText("Customer created")).toBeVisible();
  });

  test("deal timeline shows merged events", async ({ page }) => {
    await login(page);
    await page.goto("/deals");

    await page
      .locator("table tbody tr")
      .first()
      .getByRole("link")
      .first()
      .click();
    await page.getByRole("tab", { name: "Timeline" }).click();

    await expect(page.getByText("Deal created").first()).toBeVisible();
  });
});

test.describe("Command palette", () => {
  test("opens with the keyboard and shows quick links", async ({ page }) => {
    await login(page);

    await page.keyboard.press("Control+k");
    await expect(page.getByText("Go to")).toBeVisible();
    await expect(page.getByText("Settings")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByText("Go to")).toBeHidden();
  });
});
