import ddinterData from "@/data/ddinter.interactions.json";
import { resolveMedication, type CanonicalMedication } from "@/lib/medication-matcher";

type Severity = "major" | "moderate" | "minor" | "unknown";

type DdinterPayload = {
  meta: {
    source: string;
    website?: string;
    license?: string;
    generatedAt?: string;
  };
  names: Record<string, string>;
  adjacency: Record<string, Record<string, Severity>>;
};

export type DdinterInteraction = {
  severity: Severity;
  drugs: [string, string];
  slugs: [string, string];
};

const payload = ddinterData as DdinterPayload;

const severityRank: Record<Severity, number> = {
  major: 1,
  moderate: 2,
  minor: 3,
  unknown: 4,
};

const severityCopy: Record<Severity, string> = {
  major: "Avoid or escalate before coadministration unless the benefit clearly outweighs the risk.",
  moderate: "Use with a mitigation plan and closer monitoring.",
  minor: "Usually manageable, but still worth counseling and routine monitoring.",
  unknown: "Signal exists in DDInter, but severity is not clearly classified in the matched dataset.",
};

function dedupeMedications(items: CanonicalMedication[]) {
  return Array.from(new Map(items.map((item) => [item.slug, item])).values());
}

export function getInteractionForPair(
  first: string | CanonicalMedication,
  second: string | CanonicalMedication,
): DdinterInteraction | null {
  const a = typeof first === "string" ? resolveMedication(first) : first;
  const b = typeof second === "string" ? resolveMedication(second) : second;

  if (!a || !b || a.slug === b.slug) return null;

  const severity = payload.adjacency[a.slug]?.[b.slug];
  if (!severity) return null;

  return {
    severity,
    drugs: [a.name, b.name],
    slugs: [a.slug, b.slug],
  };
}

export function getInteractionsForMedications(drugs: Array<string | CanonicalMedication>) {
  const resolved = dedupeMedications(
    drugs
      .map((item) => (typeof item === "string" ? resolveMedication(item) : item))
      .filter((item): item is CanonicalMedication => Boolean(item)),
  );

  const matches: DdinterInteraction[] = [];

  for (let i = 0; i < resolved.length; i++) {
    for (let j = i + 1; j < resolved.length; j++) {
      const match = getInteractionForPair(resolved[i], resolved[j]);
      if (match) matches.push(match);
    }
  }

  return matches.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
}

export function describeDdinterInteraction(interaction: DdinterInteraction) {
  return `${interaction.drugs.join(" + ")}: ${interaction.severity.toUpperCase()} severity. ${severityCopy[interaction.severity]}`;
}

export function getDdinterSeverityGuidance(severity: Severity) {
  return severityCopy[severity];
}

export function getDdinterSourceMeta() {
  return payload.meta;
}
