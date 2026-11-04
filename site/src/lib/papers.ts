import publicationsRaw from "../data/publications.bib?raw";
import { parseBibtex, type BibEntry } from "./bibtex";

const papersCache: BibEntry[] = parseBibtex(publicationsRaw)
  .map((paper) => ({
    ...paper,
    category:
      paper.type === "unpublished"
        ? "Submitted"
        : /arxiv/i.test(paper.venue ?? "")
          ? "Preprint"
          : "Published",
  }))
  .sort(
    (a, b) =>
      Number(a.legacyFields?.profile_order ?? 999) -
      Number(b.legacyFields?.profile_order ?? 999),
  );

export function getAllPapers(): BibEntry[] {
  return papersCache;
}

export function getFeaturedPapers(
  limit = 3,
  papers: BibEntry[] = papersCache,
): BibEntry[] {
  return papers
    .filter(
      (paper) =>
        paper.legacyFields?.selected === "true" ||
        (!paper.legacyFields?.selected && paper.category === "Publication"),
    )
    .slice(0, limit);
}
