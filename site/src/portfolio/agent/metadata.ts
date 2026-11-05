import type { PortfolioCase } from "../types";
import thumbnail from "./agent-figure-01-original.png";

export default {
  slug: "words-and-deeds",
  title: "Predicting decisions from words and deeds",
  summary:
    "When people say they will cooperate, how should an LLM weigh that statement against their earlier actions and the agent they face?",
  description:
    "An evaluation of how eight LLMs predict human decisions from dialogue, behavior and personality in human–agent games.",
  role: "Co-author · User-profile design and psychological foundations",
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
