import { medicationDataset } from "../data/medications";

export type CanonicalMedication = {
  slug: string;
  name: string;
};

const synonyms = new Map<string, CanonicalMedication>();
const synonymEntries: Array<[string, CanonicalMedication]> = [];

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

  // Exact canonical names should win over broader keyword collisions.
  medicationDataset.forEach((record) => {
    const canonical = { slug: record.slug, name: record.name };
    const base = record.name.replace(/\(.*?\)/g, " ").replace(/\s+/g, " ").trim();
    const slugName = record.slug.replace(/-/g, " ");

    [record.name, base, slugName].forEach((candidate) => {
      const normalized = normalizeMedicationName(candidate);
      if (normalized) {
        synonyms.set(normalized, canonical);
      }
    });
  });

  synonymEntries.push(
    ...Array.from(synonyms.entries()).sort((a, b) => b[0].length - a[0].length || a[0].localeCompare(b[0])),
  );
})();

export function resolveMedication(value: string): CanonicalMedication | null {
  const normalized = normalizeMedicationName(value);
  if (!normalized) return null;
  return synonyms.get(normalized) ?? null;
}

export function allSynonyms() {
  return new Map(synonyms);
}

export function extractMedicationsFromText(value: string) {
  const normalized = normalizeMedicationName(value);
  if (!normalized) return [];

  const haystack = ` ${normalized} `;
  const matches = new Map<string, CanonicalMedication>();

  for (const [synonym, medication] of synonymEntries) {
    if (!synonym || synonym.length < 3) continue;
    if (haystack.includes(` ${synonym} `)) {
      matches.set(medication.slug, medication);
    }
  }

  return Array.from(matches.values());
}
