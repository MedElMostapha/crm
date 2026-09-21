import { test, expect, type Page } from "@playwright/test";

test.describe("Landing page", () => {
  test("guests see the landing page at the root", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: "Your sales pipeline, in perfect orbit.",
      })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Built for the whole deal lifecycle" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Up and running in minutes" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Put your pipeline in orbit today" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Get started" }).first()).toBeVisible();
    await expect(page).not.toHaveURL(/dashboard/);
  });

  test("signed-in users are redirected to the dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("demo@orbitcrm.dev");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("/dashboard");

    await page.goto("/");
    await expect(page).toHaveURL("/dashboard");
  });

  test("landing has no horizontal overflow on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
  });

  test("renders the product preview with live charts", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("SAMPLE DATA")).toBeVisible();
    await expect(page.getByText("Closed revenue")).toBeVisible();

    await page.waitForFunction(
      () => document.querySelectorAll(".recharts-wrapper").length >= 2
    );
  });
});