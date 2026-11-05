import type { PortfolioCase } from "../types";
import apparatus from "./driving-apparatus.png";

const driving: PortfolioCase = {
  slug: "driving-takeover",
  title: "From preparation to action in driving takeovers",
  summary:
    "How do drivers’ prior tendencies and preparation relate to braking and steering as they take over from automation?",
  description:
    "A VR study of driver preparation and the development of braking and steering after a takeover.",
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
