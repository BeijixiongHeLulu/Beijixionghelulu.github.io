import type { PortfolioCase } from "../types";
import thumbnail from "./emotion-paired-illustration-v2.png";

export default {
  slug: "interpersonal-emotion-regulation",
  title: "Both sides of interpersonal emotion regulation",
  summary:
    "How do different emotion-regulation strategies affect the feelings and neural responses of both people in an interaction?",
  description:
    "Behavioral and fNIRS analyses of emotion regulation between two people.",
  status: "Published 2026",
  facts: [{ label: "Journal", value: "Emotion" }],
  thumbnail,
  thumbnailAlt: "",
  resources: [
    {
      label: "Read the published article",
      href: "https://doi.org/10.1037/emo0001683",
      kind: "publication",
    },
  ],
} satisfies PortfolioCase;
