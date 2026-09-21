import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@orbitcrm.dev");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/dashboard");
}

test.describe("Responsive", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("mobile shows the sheet menu instead of the desktop sidebar", async ({
    page,
  }) => {
    await login(page);
    await expect(
      page.getByRole("button", { name: "Open menu" })
    ).toBeVisible();
    await expect(page.locator("aside")).toBeHidden();
  });

  test("pages do not overflow horizontally on mobile", async ({ page }) => {
    await login(page);

    for (const path of ["/customers", "/companies", "/deals", "/tasks"]) {
      await page.goto(path);
      await page.waitForTimeout(600);

      const overflows = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1
      );
      expect(overflows, `${path} overflows horizontally`).toBe(false);
    }
  });
});
