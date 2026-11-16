import { test, expect } from "@playwright/test";
import { VISITOR_API } from "../src/lib/visitor-config";

const summary = {
  totals: {
    views: 4,
    visitors: 3,
    countries: 2,
    firstVisit: 1794800000000,
    lastVisit: 1794810000000,
  },
  locations: [
    { country: "CN", lat: 40, lng: 116, views: 3 },
    { country: "GB", lat: 52, lng: 0, views: 1 },
  ],
  countries: [
    { country: "CN", views: 3 },
    { country: "GB", views: 1 },
  ],
  daily: [{ day: "2026-11-16", views: 4 }],
  generatedAt: 1794810000000,
};

test("visitor atlas filters real API-shaped data, handles outages, and keeps private records hidden", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const requests: string[] = [];
  let unavailable = false;
  await page.route(`${VISITOR_API}/api/**`, async (route) => {
    const url = route.request().url();
    requests.push(url);
    await route.fulfill({
      status: unavailable ? 503 : 200,
      json: url.includes("days=7")
        ? { ...summary, totals: { ...summary.totals, views: 2 } }
        : summary,
    });
  });
  await page.goto("/visitors/");
  await expect(page.locator("[data-visitor-views]")).toHaveText("4");
  await expect(page.locator("[data-visitor-country-list]")).toContainText(
    "China",
  );
  await expect(page.locator("[data-owner-records]")).toBeHidden();
  await expect(
    page.getByRole("link", { name: "Owner sign-in" }),
  ).toHaveAttribute("href", `${VISITOR_API}/admin/`);
  await page.getByLabel("Time period").selectOption("7");
  await expect(page.locator("[data-visitor-views]")).toHaveText("2");
  await expect(page.locator("[data-visitor-range]")).toHaveText("Last 7 days");
  await page.locator("[data-globe-rotate]").click();
  await expect(page.locator("[data-globe-rotate]")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  unavailable = true;
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  await expect(page.locator("[data-visitor-views]")).toHaveText("2");
  unavailable = false;
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("button", { name: "Try again" })).toBeHidden();
  expect(requests.some((url) => url.includes("records"))).toBe(false);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("owner interface switches grouped IPs and visit events with search and time zones", async ({
  page,
  request,
}) => {
  const html = await (await request.get("/visitors/")).text();
  const local = "http://127.0.0.1:4321";
  await page.route(`${local}/admin/`, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: html.replaceAll(VISITOR_API, local),
    }),
  );
  const calls: string[] = [];
  await page.route(`${local}/api/**`, async (route) => {
    const url = new URL(route.request().url());
    calls.push(url.href);
    if (url.pathname === "/api/summary")
      return route.fulfill({ json: summary });
    const record = {
      ip: "192.0.2.8",
      country: "CN",
      city: "Beijing",
      region: "Beijing",
      views: 3,
      firstVisit: 1794800000000,
      lastVisit: 1794810000000,
      visited_at: 1794810000000,
      path: "/portfolio/",
      referrer: "example.com",
      browser: "Chrome",
      device: "Desktop",
    };
    return route.fulfill({
      json: {
        records: url.searchParams.get("q") ? [] : [record],
        total: url.searchParams.get("q") ? 0 : 1,
        pageSize: 50,
      },
    });
  });
  await page.goto("/admin/");
  await expect(page.locator("[data-owner-records]")).toBeVisible();
  await expect(page.locator("[data-record-body]")).toContainText("192.0.2.8");
  await expect(page.locator("[data-record-head]")).toContainText("First visit");
  await page.getByRole("button", { name: "Visit log", exact: true }).click();
  await expect(page.locator("[data-record-head]")).toContainText("Referrer");
  await expect(page.locator("[data-record-body]")).toContainText("/portfolio/");
  await page.getByLabel("Time zone").selectOption("UTC");
  await expect(page.locator("[data-record-status]")).toContainText("UTC");
  await page.getByLabel("Search visit records").fill("no-such-ip");
  await expect(page.locator("[data-record-status]")).toContainText(
    "No matching records",
  );
  expect(calls.some((url) => url.includes("mode=ips"))).toBe(true);
  expect(calls.some((url) => url.includes("mode=events"))).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
