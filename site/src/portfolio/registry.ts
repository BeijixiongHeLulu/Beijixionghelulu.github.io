import acta from "./acta/metadata";
import emotion from "./emotion/metadata";
import driving from "./driving/metadata";
import cockpit from "./cockpit/metadata";
import lifedu from "./lifedu/metadata";
import Acta from "./acta/Case.astro";
import Emotion from "./emotion/Case.astro";
import Driving from "./driving/Case.astro";
import Cockpit from "./cockpit/Case.astro";
import Lifedu from "./lifedu/Case.astro";

export const portfolio = [
  { metadata: acta, Component: Acta },
  { metadata: emotion, Component: Emotion },
  { metadata: driving, Component: Driving },
  { metadata: cockpit, Component: Cockpit },
  { metadata: lifedu, Component: Lifedu },
];
