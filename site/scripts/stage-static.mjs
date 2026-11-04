import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const publicDir = fileURLToPath(new URL("../public/", import.meta.url));
mkdirSync(publicDir, { recursive: true });
cpSync(
  fileURLToPath(new URL("../../assets/", import.meta.url)),
  `${publicDir}/assets`,
  { recursive: true },
);
writeFileSync(`${publicDir}/.nojekyll`, "");
