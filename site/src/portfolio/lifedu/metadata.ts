import type { PortfolioCase } from "../types";
import vignette from "./lifedu-eeg-task-illustration-v2.png";

export default {
  slug: "community-eeg-modeling",
  title: "Community environments and everyday well-being",
  summary:
    "How are community environments associated with residents’ well-being and the way they evaluate their own community?",
  description:
    "Connecting EEG measures with decision models of implicit community evaluations.",
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
