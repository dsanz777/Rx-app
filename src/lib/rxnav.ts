import { medicationDataset } from "@/data/medications";

const synonymMap = new Map<string, string>();
const rxcuiCache = new Map<string, string | null>();

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function registerSynonym(value: string, canonical: string) {
  const cleaned = normalize(value);
  if (cleaned) {
    synonymMap.set(cleaned, canonical);
  }
}

function buildSynonyms() {
  medicationDataset.forEach((item) => {
    const canonical = item.name;
    registerSynonym(canonical, canonical);

    const base = item.name.replace(/\(.*?\)/g, "").trim();
    if (base && base !== canonical) {
      registerSynonym(base, canonical);
    }

    const slug = item.slug.replace(/-/g, " ");
    registerSynonym(slug, canonical);

    const parenMatches = item.name.match(/\(([^)]+)\)/);
    if (parenMatches) {
      parenMatches[1]
        .split(/[\/,&]|\band\b/i)
        .map((token) => token.replace(/[+]/g, "+").trim())
        .filter(Boolean)
        .forEach((token) => registerSynonym(token, canonical));
    }
  });
}

buildSynonyms();

async function fetchJson(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return null;
  return response.json();
}

async function fetchExactRxcui(name: string): Promise<string | null> {
  const query = encodeURIComponent(name);
  const data = (await fetchJson(
    `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${query}&search=1`,
  )) as { idGroup?: { rxnormId?: string[] } } | null;

  return data?.idGroup?.rxnormId?.[0] ?? null;
}

async function fetchApproximateRxcui(name: string): Promise<string | null> {
  const query = encodeURIComponent(name);
  const data = (await fetchJson(
    `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${query}&maxEntries=10&option=1`,
  )) as {
    approximateGroup?: { candidate?: { rxcui?: string; score?: string }[] };
  } | null;

  const candidates = data?.approximateGroup?.candidate ?? [];
  if (!candidates.length) return null;

  const top = candidates
    .map((candidate) => ({
      rxcui: candidate.rxcui ?? null,
      score: Number(candidate.score ?? "0"),
    }))
    .filter((candidate) => Boolean(candidate.rxcui))
    .sort((a, b) => b.score - a.score)[0];

  return top?.rxcui ?? null;
}

function candidateNames(drugName: string) {
  const trimmed = drugName.trim();
  const normalized = normalize(trimmed);
  const canonical = synonymMap.get(normalized) ?? trimmed;

  const candidates = new Set<string>();
  candidates.add(canonical);
  candidates.add(trimmed);
  candidates.add(trimmed.replace(/\+/g, " ")); // handle “APAP + hydrocodone”
  candidates.add(trimmed.replace(/\//g, " "));

  return Array.from(candidates).filter(Boolean);
}

export async function resolveRxcui(drugName: string): Promise<{ name: string; rxcui: string | null }> {
  const key = normalize(drugName);
  if (rxcuiCache.has(key)) {
    return { name: synonymMap.get(key) ?? drugName.trim(), rxcui: rxcuiCache.get(key)! };
  }

  for (const name of candidateNames(drugName)) {
    const exact = await fetchExactRxcui(name);
    if (exact) {
      rxcuiCache.set(key, exact);
      return { name, rxcui: exact };
    }
  }

  const approx = await fetchApproximateRxcui(drugName);
  rxcuiCache.set(key, approx ?? null);
  return { name: drugName.trim(), rxcui: approx ?? null };
}
