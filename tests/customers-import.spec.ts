import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@orbitcrm.dev");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/dashboard");
}

test.describe("CSV import", () => {
  test("imports customers from an uploaded CSV file", async ({ page }) => {
    await login(page);
    await page.goto("/customers");

    const email = `import-e2e-${Date.now()}@example.com`;
    const dir = mkdtempSync(join(tmpdir(), "orbit-csv-"));
    const csvPath = join(dir, "customers.csv");
    writeFileSync(
      csvPath,
      [
        "first_name,last_name,email,phone,status,source,tags",
        `Import,Test,${email},+1 555 0000,active,Referral,e2e`,
      ].join("\n")
    );

    await page
      .locator('input[type="file"]')
      .setInputFiles(csvPath);

    await expect(page.getByText("1 customer imported")).toBeVisible();
    await expect(page.getByText(email)).toBeVisible();
  });

  test("import button is available on the customers page", async ({ page }) => {
    await login(page);
    await page.goto("/customers");
    await expect(
      page.getByRole("button", { name: "Import CSV" })
    ).toBeVisible();
  });
});