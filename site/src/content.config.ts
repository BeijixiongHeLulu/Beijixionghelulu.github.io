import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number(),
    draft: z.boolean().default(false),
  }),
});
const profile = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/profile" }),
  schema: z.object({ title: z.string() }),
});
const news = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/news" }),
  schema: z.object({ title: z.string(), date: z.coerce.date() }),
});
export const collections = { projects, profile, news };
