import { copyFileSync } from "node:fs";

// Keep the sitemap address previously served by GitHub Pages.
copyFileSync(
  new URL("../dist/sitemap-0.xml", import.meta.url),
  new URL("../dist/sitemap.xml", import.meta.url),
);
