import type { PortfolioCase } from "../types";
import thumbnail from "./agent-figure-01-original.png";

export default {
  slug: "words-and-deeds",
  title: "Predicting decisions in human–agent dialogue",
  summary:
    "How well do language models predict people’s choices from their words and past behavior, across agent personas and user personalities?",
  description:
    "An evaluation of how eight LLMs predict human decisions from dialogue, behavior and personality in human–agent games.",
  status: "Preprint · Submitted",
  facts: [
    { label: "Dataset", value: "Personality-1260" },
    { label: "Evaluation", value: "8 LLM predictors" },
  ],
  thumbnail,
  thumbnailAlt: "",
  resources: [
    {
      label: "Read preprint",
      href: "https://arxiv.org/abs/2610.36813",
      kind: "publication",
    },
  ],
} satisfies PortfolioCase;
