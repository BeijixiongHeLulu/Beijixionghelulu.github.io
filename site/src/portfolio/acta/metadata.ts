import type { PortfolioCase } from "../types";
import thumbnail from "./acta-figure-03-english.svg";

export default {
  slug: "honesty-ai-supervision",
  title: "Personality and responses to AI oversight",
  summary:
    "How do responses to AI monitoring and incentives vary with personality, and what happens to honesty after rewards or feedback are withdrawn?",
  description:
    "Behavioral experiments on supervision, incentives and honest reporting.",
  status: "Published 2026",
  facts: [{ label: "Journal", value: "Acta Psychologica Sinica" }],
  thumbnail,
  thumbnailAlt:
    "Published comparison of honesty rates and response times across monitoring conditions.",
  resources: [
    {
      label: "Read the published article",
      href: "https://doi.org/10.3724/SP.J.1041.2026.0381",
      kind: "publication",
    },
  ],
} satisfies PortfolioCase;
