import type { PortfolioCase } from "../types";
import apparatus from "./driving-apparatus.png";

const driving: PortfolioCase = {
  slug: "driving-takeover",
  title: "Preparing to take back control",
  subtitle: "A VR study of automated-driving takeovers",
  summary:
    "I studied how drivers prepare to regain control from automation and how their actions unfold after a takeover.",
  description:
    "A VR study connecting staged warnings, situation-awareness probes and the sequence of driving actions.",
  role: "Independent project · Design, implementation and analysis",
  status: "Manuscript submitted",
  facts: [{ label: "Context", value: "VR human-factors experiment" }],
  thumbnail: apparatus,
  thumbnailAlt:
    "A seated person using a VR headset, steering wheel and pedals in the driving experiment.",
  resources: [
    {
      label: "Driving takeover research overview",
      href: "/projects/01-driving-takeover/",
      kind: "context",
    },
  ],
};

export default driving;
