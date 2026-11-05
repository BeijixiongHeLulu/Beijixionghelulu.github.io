import { test, expect } from "@playwright/test";

const cases = [
  "honesty-ai-supervision",
  "interpersonal-emotion-regulation",
  "words-and-deeds",
  "driving-takeover",
  "whole-body-motion",
  "community-eeg-modeling",
];
const roles = [
  "Co-first author · Experimental design and analysis",
  "Co-author · Data analysis",
  "Co-author · User-profile design and psychological foundations",
  "Independent project · Design, implementation and analysis",
  "Unity task development · Response-time analysis",
  "Second author · Data analysis",
];

const statuses = [
  "Published 2026",
  "Published 2026",
  "Preprint · Submitted",
  "Manuscript submitted",
  "Manuscript submitted",
  "Manuscript submitted",
];

test("portfolio is reachable and every case can be read and returned from", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const menu = page.locator("#mobile-menu-toggle");
  if (await menu.isVisible()) await menu.click();
  await page
    .locator("header")
    .getByRole("link", { name: "portfolio", exact: true })
    .filter({ visible: true })
    .click();
  await expect(page.locator(".portfolio-card")).toHaveCount(6);
  await page.locator(".portfolio-card img").evaluateAll(async (images) => {
    for (const image of images) {
      if (!(image instanceof HTMLImageElement)) continue;
      image.loading = "eager";
      await image.decode();
    }
  });
  for (const [index, slug] of cases.entries()) {
    await page.locator(`.portfolio-card[href="/portfolio/${slug}/"]`).click();
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".portfolio-contribution")).toBeVisible();
    await expect(page.locator(".portfolio-role")).toHaveText(roles[index]);
    await expect(
      page.locator(".portfolio-context .portfolio-status"),
    ).toHaveText(statuses[index]);
    await page.locator("img").evaluateAll(async (images) => {
      for (const image of images) {
        if (!(image instanceof HTMLImageElement)) continue;
        image.loading = "eager";
        await image.decode();
        if (!image.naturalWidth) throw new Error(`Empty image: ${image.src}`);
      }
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator(".portfolio-resources a")).toHaveCount(1);
    for (const summary of await page.locator("details summary").all()) {
      await summary.focus();
      await page.keyboard.press("Enter");
      await expect(summary.locator("..")).toHaveAttribute("open", "");
      await page.keyboard.press("Enter");
    }
    await page
      .getByRole("link", { name: "Back to portfolio", exact: true })
      .click();
    await expect(page).toHaveURL(/\/portfolio\/$/);
  }
  expect(errors).toEqual([]);
});

test("case meaning survives narrow enlarged text and dark mode", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.addInitScript(() => localStorage.setItem("site-theme", "dark"));
  for (const slug of cases) {
    await page.goto(`/portfolio/${slug}/`);
    await page.addStyleTag({ content: "html { font-size: 32px !important; }" });
    await expect(page.locator("html")).toHaveClass(/dark/);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".portfolio-resources a")).toBeVisible();
  }
});

test("cases link to available papers or preserved research", async ({
  page,
  request,
}) => {
  const resources = [
    "https://doi.org/10.3724/SP.J.1041.2026.0381",
    "https://doi.org/10.1037/emo0001683",
    "https://arxiv.org/abs/2610.36813",
    "/projects/01-driving-takeover/",
    "/projects/02-motion-performance/",
    "/projects/00-eeg-behavioral-modeling/",
  ];
  for (const [index, slug] of cases.entries()) {
    await page.goto(`/portfolio/${slug}/`);
    await expect(page.locator(".portfolio-resources a")).toHaveAttribute(
      "href",
      resources[index],
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://beijixionghelulu.github.io/portfolio/${slug}/`,
    );
    if (resources[index].startsWith("/"))
      expect((await request.get(resources[index])).ok()).toBe(true);
  }
});
