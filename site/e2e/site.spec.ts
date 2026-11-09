import { test, expect, type Page } from "@playwright/test";
async function openMenu(page: Page) {
  const toggle = page.locator("#mobile-menu-toggle");
  if (
    (await toggle.isVisible()) &&
    (await toggle.getAttribute("aria-expanded")) !== "true"
  )
    await toggle.click();
}
test("original navigation, images and responsive layout", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Jianshu Wang", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".profile-biography p")).toHaveCount(3);
  await expect(page.locator("[data-paper-id]")).toHaveCount(6);
  for (const [label, path] of [
    ["publications", "/publications/"],
    ["research", "/projects/"],
    ["CV", "/cv/"],
    ["hobby", "/hobby/"],
    ["about", "/"],
  ]) {
    await openMenu(page);
    await page
      .locator("header")
      .getByRole("link", { name: label, exact: true })
      .filter({ visible: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator("img").evaluateAll(async (images) => {
      for (const img of images) {
        if (!(img instanceof HTMLImageElement)) continue;
        img.loading = "eager";
        await img.decode();
      }
    });
  }
  expect(errors).toEqual([]);
});
test("publication filters, citation formats and copy", async ({ page }) => {
  await page.goto("/publications/");
  await expect(page.locator("[data-paper-id]:visible")).toHaveCount(7);
  for (const [filter, count] of [
    ["published", 2],
    ["submitted", 4],
    ["preprint", 1],
  ] as const) {
    await page.locator(`[data-filter="${filter}"]`).click();
    await expect(page.locator("[data-paper-id]:visible")).toHaveCount(count);
    await page.reload();
    await expect(page.locator("[data-paper-id]:visible")).toHaveCount(count);
  }
  await page.locator("[data-citation-trigger]:visible").click();
  await expect(page.locator("dialog")).toBeVisible();
  await expect(page.locator("[data-citation-output]")).toContainText(
    "2601.12884",
  );
  await page.getByRole("button", { name: "APA 7", exact: true }).click();
  await expect(page.locator("[data-citation-format-label]")).toHaveText(
    "APA 7 citation",
  );
  await page
    .getByRole("button", { name: "Copy citation", exact: true })
    .click();
  await expect(page.locator("[data-copy-status]")).toContainText(
    "citation copied",
  );
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "Wang",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).not.toBeVisible();
});
test("theme survives navigation and original PDF remains available", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await openMenu(page);
  await page.locator("[data-theme-toggle]:visible").click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await openMenu(page);
  await page
    .locator("header")
    .getByRole("link", { name: "CV", exact: true })
    .filter({ visible: true })
    .click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByRole("link", { name: "Download CV" })).toHaveAttribute(
    "href",
    "/assets/pdf/CV_Jianshu_Wang.pdf",
  );
  const pdf = await request.get("/assets/pdf/CV_Jianshu_Wang.pdf");
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});
