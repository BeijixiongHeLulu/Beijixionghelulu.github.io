import type { ImageMetadata } from "astro";

export interface PortfolioCase {
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  description: string;
  role: string;
  status: "Published 2026" | "Manuscript submitted" | "Preprint · Submitted";
  facts?: { label: string; value: string }[];
  thumbnail: ImageMetadata;
  thumbnailAlt: string;
  resources: {
    label: string;
    href: string;
    kind: "publication" | "context";
  }[];
}

export type CasePart = "intro" | "visual" | "body";
