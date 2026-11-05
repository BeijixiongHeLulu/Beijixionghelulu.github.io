import type { PortfolioCase } from "../types";
import setup from "./cockpit-platform-original.jpeg";

export default {
  slug: "whole-body-motion",
  title: "Human performance during whole-body motion",
  summary:
    "How does physical motion relate to the directional task a person is performing?",
  description:
    "Unity task development and behavioral analysis for a directional-judgment study on a physical motion platform.",
  role: "Unity task development · Response-time analysis",
  status: "Manuscript submitted",
  facts: [
    {
      label: "Institution",
      value: "Institute of Software, Chinese Academy of Sciences",
    },
  ],
  thumbnail: setup,
  thumbnailAlt:
    "Participant seated on a six-degree-of-freedom motion platform facing three displays, with the original face covering retained.",
  resources: [
    {
      label: "Whole-body motion research overview",
      href: "/projects/02-motion-performance/",
      kind: "context",
    },
  ],
} satisfies PortfolioCase;
