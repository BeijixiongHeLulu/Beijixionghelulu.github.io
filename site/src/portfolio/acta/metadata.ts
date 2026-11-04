import type { PortfolioCase } from "../types";
import thumbnail from "./acta-task-vignette.svg";

export default {
  slug: "honesty-ai-supervision",
  title: "Honesty under AI supervision",
  summary:
    "How do supervision and incentives shape honest reporting? In four behavioral experiments, participants predicted a computer-presented coin outcome and then reported whether they had guessed correctly. The experiments used programmed supervision and feedback conditions framed as AI oversight.",
  description:
    "Behavioral experiments on supervision, incentives and honest reporting.",
  role: "Co-first author · Experimental design and analysis",
  status: "Published 2026",
  facts: [{ label: "Journal", value: "Acta Psychologica Sinica" }],
  thumbnail,
  thumbnailAlt: "",
  resources: [
    {
      label: "Read the published article",
      href: "https://doi.org/10.3724/SP.J.1041.2026.0381",
      kind: "publication",
    },
  ],
} satisfies PortfolioCase;
