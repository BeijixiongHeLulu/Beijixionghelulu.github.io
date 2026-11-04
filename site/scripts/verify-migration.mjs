import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { parse } from "yaml";

const site = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const root = resolve(site, "..");
const dist = join(site, "dist");
const origin = "https://beijixionghelulu.github.io";
const read = (path) => readFileSync(path, "utf8");
const hash = (path) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");
const baseline = JSON.parse(
  read(join(site, "tests/fixtures/migration-baseline.json")),
);
const pageFile = (path) =>
  join(dist, path, path.endsWith("/") ? "index.html" : "");
const decode = (value) =>
  value
    .replace(/&#(?:x([a-f0-9]+)|(\d+));/gi, (_, hex, num) =>
      String.fromCodePoint(parseInt(hex || num, hex ? 16 : 10)),
    )
    .replace(
      /&(amp|lt|gt|quot|apos|nbsp);/g,
      (_, x) =>
        ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " })[x],
    );
const normalize = (value) =>
  decode(value)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
const text = (html) =>
  normalize(
    html
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
      .replace(/<\/(p|h[1-6]|div|li|section|article|dd|dt)>/gi, " ")
      .replace(/<[^>]+>/g, ""),
  );
const splitMarkdown = (path) => {
  const [, front, body] = read(path).split(/^---\s*$/m);
  return { data: parse(front), body: body.trim() };
};
const plainMarkdown = (body) =>
  normalize(
    body
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/<[^>]+>/g, "")
      .replace(/\*|_|`|^#+\s/gm, ""),
  );
const assertRendered = (html, value, label) =>
  assert.ok(
    text(html).includes(normalize(value)),
    `Missing rendered content: ${label}: ${value}`,
  );

let routes = 0;
for (const page of baseline.pages) {
  if (page.previousStatus === 404) continue;
  assert.ok(
    existsSync(pageFile(page.path)),
    `Original URL missing: ${page.path}`,
  );
  routes++;
}
assert.ok(
  !existsSync(pageFile("/projects/04-human-ai-trust/")),
  "Unpublished project must remain unpublished",
);
assert.ok(existsSync(join(dist, ".nojekyll")));
assert.ok(existsSync(join(dist, "sitemap.xml")));

const home = read(pageFile("/"));
const publications = read(pageFile("/publications/"));
const cvHtml = read(pageFile("/cv/"));
assertRendered(
  home,
  plainMarkdown(splitMarkdown(join(site, "src/content/profile/about.md")).body),
  "biography",
);
assertRendered(home, "jishuu825@gmail.com", "contact");
for (const collection of ["projects", "news"]) {
  for (const file of readdirSync(join(site, `src/content/${collection}`))) {
    const { data, body } = splitMarkdown(
      join(site, `src/content/${collection}`, file),
    );
    if (data.draft) continue;
    const html = read(pageFile(`/${collection}/${file.replace(/\.md$/, "")}/`));
    assertRendered(html, data.title, `${collection} title`);
    assertRendered(html, plainMarkdown(body), `${collection}/${file}`);
  }
}
const cv = parse(read(join(site, "src/data/cv.yml"))).cv;
assertRendered(cvHtml, cv.summary, "CV summary");
for (const [section, entries] of Object.entries(cv.sections)) {
  assertRendered(cvHtml, section, "CV section");
  for (const entry of entries) {
    for (const [key, value] of Object.entries(entry)) {
      if (
        !value ||
        ["url", "start_date", "end_date", "releaseDate"].includes(key)
      )
        continue;
      for (const item of Array.isArray(value) ? value : [value])
        assertRendered(cvHtml, item, `CV ${key}`);
    }
  }
}

function* walk(dir) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) yield* walk(path);
    else yield path;
  }
}
let assets = 0;
for (const asset of walk(join(root, "assets"))) {
  const relative = asset.slice(root.length + 1);
  assert.equal(
    hash(join(dist, relative)),
    hash(asset),
    `Changed asset: ${relative}`,
  );
  assets++;
}
let links = 0;
for (const file of walk(dist)) {
  if (!file.endsWith(".html") || file.startsWith(join(dist, "assets")))
    continue;
  const html = read(file);
  const path = file
    .slice(dist.length)
    .replaceAll("\\", "/")
    .replace(/index\.html$/, "");
  for (const [, attr, raw] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    const url = new URL(decode(raw), origin + path);
    if (url.origin !== origin) continue;
    const target = decodeURIComponent(url.pathname);
    assert.ok(
      existsSync(pageFile(target)),
      `Broken ${attr} in ${path}: ${raw}`,
    );
    if (url.hash && attr === "href" && target.endsWith("/")) {
      const targetHtml = read(pageFile(target));
      assert.ok(
        targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
        `Broken anchor: ${raw}`,
      );
    }
    links++;
  }
}

if (process.argv.includes("--baseline")) {
  for (const [file, expected] of Object.entries(baseline.sourceHashes))
    assert.equal(
      hash(join(site, file)),
      expected,
      `Migration source modified: ${file}`,
    );
  for (const [oldDir, newDir] of [
    ["_projects", "projects"],
    ["_news", "news"],
  ]) {
    for (const file of readdirSync(join(root, oldDir)))
      assert.equal(
        splitMarkdown(join(root, oldDir, file)).body,
        splitMarkdown(join(site, `src/content/${newDir}`, file)).body,
        `Changed original text: ${file}`,
      );
  }
  assert.equal(
    splitMarkdown(join(root, "_pages/about.md")).body,
    splitMarkdown(join(site, "src/content/profile/about.md")).body,
  );
  assert.equal((home.match(/data-paper-id=/g) || []).length, 5);
  assert.equal((publications.match(/data-paper-id=/g) || []).length, 7);
  for (const href of [
    "mailto:jishuu825@gmail.com",
    "https://scholar.google.com/citations?user=Zs9zJOMAAAAJ",
    "/assets/pdf/CV_Jianshu_Wang.pdf",
  ])
    assert.ok(home.includes(href), `Original contact URL missing: ${href}`);
}
console.log(
  `Content verified: ${routes} original routes, ${assets} unchanged assets, ${links} local links; biography, research, news and CV rendered in full${process.argv.includes("--baseline") ? "; migration baseline matches" : ""}.`,
);
