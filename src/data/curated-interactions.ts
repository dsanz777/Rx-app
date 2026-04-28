export type CuratedInteraction = {
  slugs: [string, string];
  severity: "major" | "moderate" | "minor" | "unknown";
  description: string;
  sourceLabel: string;
  referenceUrl: string;
};

const curatedInteractions: CuratedInteraction[] = [
  {
    slugs: ["alprazolam", "oxycodone"],
    severity: "major",
    description:
      "Avoid or escalate before coadministration unless the benefit clearly outweighs the risk. Concomitant opioid and benzodiazepine use can cause profound sedation, respiratory depression, coma, and death.",
    sourceLabel: "Curated DailyMed",
    referenceUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4f6f340c-08bc-4e35-b331-7b727c2904c1",
  },
  {
    slugs: ["alprazolam", "oxycodone-apap"],
    severity: "major",
    description:
      "Avoid or escalate before coadministration unless the benefit clearly outweighs the risk. Concomitant opioid and benzodiazepine use can cause profound sedation, respiratory depression, coma, and death.",
    sourceLabel: "Curated DailyMed",
    referenceUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4f6f340c-08bc-4e35-b331-7b727c2904c1",
  },
];

function pairKey(slugs: [string, string]) {
  return [...slugs].sort().join("|");
}

const curatedByPair = new Map(curatedInteractions.map((entry) => [pairKey(entry.slugs), entry]));

export function getCuratedInteractionForPair(firstSlug: string, secondSlug: string) {
  return curatedByPair.get(pairKey([firstSlug, secondSlug]));
}

export function getCuratedInteractionSourceMeta() {
  return {
    source: "Curated DailyMed pair overrides",
    website: "https://dailymed.nlm.nih.gov/",
  };
}
