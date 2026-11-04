import type { PortfolioCase } from "../types";
import vignette from "./lifedu-model-inputs.svg";

export default {
  slug: "community-eeg-modeling",
  title: "Community evaluations and evidence accumulation",
  summary: "How are community evaluations reflected in decisions?",
  description:
    "Connecting EEG measures with decision models of implicit community evaluations.",
  role: "Second author · Data analysis",
  status: "Manuscript submitted",
  facts: [
    { label: "Institution", value: "Lifedu Educational Technology Co., Ltd." },
    { label: "Supervision", value: "Dr. Ze Geng, Principal Investigator" },
  ],
  thumbnail: vignette,
  thumbnailAlt: "",
  resources: [
    {
      label: "Community evaluations research overview",
      href: "/projects/00-eeg-behavioral-modeling/",
      kind: "context",
    },
  ],
} satisfies PortfolioCase;
