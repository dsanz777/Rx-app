import { medicationDataset } from "../data/medications";

export type CanonicalMedication = {
  slug: string;
  name: string;
};

const synonyms = new Map<string, CanonicalMedication>();

export function normalizeMedicationName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function registerSynonym(candidate: string, record: CanonicalMedication) {
  const normalized = normalizeMedicationName(candidate);
  if (!normalized) return;
  if (!synonyms.has(normalized)) {
    synonyms.set(normalized, record);
  }
}

function expandTokens(value: string) {
  return value
    .split(/[\/+,&]|\band\b|\bwith\b/gi)
    .map((token) => token.trim())
    .filter(Boolean);
}

(function seedSynonyms() {
  medicationDataset.forEach((record) => {
    const canonical = { slug: record.slug, name: record.name };
    const values = new Set<string>();

    values.add(record.name);

    const base = record.name.replace(/\(.*?\)/g, " ").replace(/\s+/g, " ").trim();
    if (base) values.add(base);

    const slugName = record.slug.replace(/-/g, " ");
    values.add(slugName);

    record.keywords?.forEach((keyword) => values.add(keyword));

    const parenMatches = record.name.match(/\(([^)]+)\)/g) ?? [];
    parenMatches.forEach((match) => {
      const content = match.replace(/[()]/g, "");
      expandTokens(content).forEach((token) => values.add(token));
    });

    values.forEach((token) => {
      registerSynonym(token, canonical);
      expandTokens(token).forEach((child) => registerSynonym(child, canonical));
    });
  });
})();

export function resolveMedication(value: string): CanonicalMedication | null {
  const normalized = normalizeMedicationName(value);
  if (!normalized) return null;
  return synonyms.get(normalized) ?? null;
}

export function allSynonyms() {
  return new Map(synonyms);
}
