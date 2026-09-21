import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@orbitcrm.dev");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/dashboard");
}

test.describe("Bulk table actions", () => {
  test("selecting rows shows the bulk bar and counts", async ({ page }) => {
    await login(page);
    await page.goto("/deals");

    const firstRowCheckbox = page.locator("tbody tr").first().getByRole("checkbox");
    await expect(firstRowCheckbox).toBeVisible();
    await firstRowCheckbox.click();

    await expect(page.getByText("1 deal selected")).toBeVisible();

    const headerCheckbox = page
      .locator("thead tr")
      .first()
      .getByRole("checkbox");
    await headerCheckbox.click();

    const count = await page
      .locator("tbody tr")
      .count();
    await expect(
      page.getByText(new RegExp(`^${count} of ${count} row\\(s\\)`))
    ).toBeVisible();
  });

  test("deleting from the bulk bar asks for confirmation only", async ({
    page,
  }) => {
    await login(page);
    await page.goto("/customers");

    await page.locator("tbody tr").first().getByRole("checkbox").click();
    await expect(page.getByText("1 customer selected")).toBeVisible();

    let dialogMessage = "";
    page.once("dialog", async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.dismiss();
    });

    await page.getByRole("button", { name: "Delete" }).click();
    expect(dialogMessage).toContain("Delete 1 customer");

    await expect(page.getByText("1 customer selected")).toBeVisible();
  });

  test("bulk complete keeps tasks visible after refresh", async ({ page }) => {
    await login(page);
    await page.goto("/tasks");

    await page.locator("tbody tr").first().getByRole("checkbox").click();
    await expect(page.getByText("1 task selected")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Complete" })
    ).toBeVisible();
  });
});