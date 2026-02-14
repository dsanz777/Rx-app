import fs from "node:fs";
import path from "node:path";
import fetch from "node-fetch";
import { load } from "cheerio";

const SOURCE_URL = "https://denalirx.com/top-200-drugs/";
const OPEN_FDA_URL = "https://api.fda.gov/drug/label.json";
const OUTPUT_PATH = path.join(process.cwd(), "src/data/medications.generated.json");
const MAX_RECORDS = 200;

export type MedicationRecord = {
  slug: string;
  name: string;
  class: string;
  summary: string;
  dose: string;
  renal: string;
  monitoring: string;
  pearls: string[];
  tags: string[];
  keywords: string[];
};

type TopDrug = {
  generic: string;
  brand: string;
  drugClass: string;
  schedule: string;
};

type OpenFdaLabel = Record<string, string | string[] | undefined>;
type OpenFdaResponse = { results?: OpenFdaLabel[] };

async function fetchTopDrugList() {
  const response = await fetch(SOURCE_URL);
  if (!response.ok) {
    throw new Error(`Failed to download top drug table: ${response.status}`);
  }
  const html = await response.text();
  const $ = load(html);
  const rows = $("table.sorta-table tbody tr");
  const list: TopDrug[] = [];

  rows.each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 2) return;
    const generic = cleanText($(cells[0]).text());
    if (!generic) return;
    if (list.find((item) => item.generic.toLowerCase() === generic.toLowerCase())) {
      return;
    }
    const brand = cleanText($(cells[1]).text());
    const drugClass = cleanText($(cells[2]).text());
    const schedule = cleanText($(cells[3]).text());
    list.push({ generic, brand, drugClass, schedule });
  });

  if (!list.length) {
    throw new Error("Unable to parse any drugs from source table");
  }

  return list.slice(0, MAX_RECORDS);
}

async function fetchOpenFdaLabel(target: { generic: string; brand: string }) {
  const searchValues = Array.from(
    new Set(
      [
        target.generic,
        target.brand,
        target.generic.split("+")[0]?.trim(),
      ]
        .filter(Boolean)
        .map((value) => value.replace(/"/g, "\\\""))
    )
  );

  for (const value of searchValues) {
    const query = encodeURIComponent(`openfda.generic_name:"${value}"`);
    const url = `${OPEN_FDA_URL}?search=${query}&limit=1`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        continue;
      }
      const data = (await response.json()) as OpenFdaResponse;
      if (data.results?.length) {
        return data.results[0];
      }
    } catch {
      // Ignore and fall back to next strategy.
    }
  }

  for (const value of searchValues) {
    const query = encodeURIComponent(`openfda.brand_name:"${value}"`);
    const url = `${OPEN_FDA_URL}?search=${query}&limit=1`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        continue;
      }
      const data = (await response.json()) as OpenFdaResponse;
      if (data.results?.length) {
        return data.results[0];
      }
    } catch {
      // Ignore and keep searching.
    }
  }

  return null;
}

function buildRecord(source: TopDrug, label: OpenFdaLabel | null): MedicationRecord {
  const displayName = source.brand
    ? `${titleCase(source.generic)} (${source.brand})`
    : titleCase(source.generic);
  const slug = slugify(source.generic || source.brand || displayName);
  const summary =
    selectText(label, ["indications_and_usage", "description"]) ||
    `Review prescribing info for ${titleCase(source.generic)}.`;
  const dosing =
    selectText(label, ["dosage_and_administration", "dosage_forms_and_strengths"]) ||
    "See full prescribing information for dosing details.";
  const renal = pickRenal(label) || "No renal guidance found in the fetched label.";
  const monitoring =
    selectText(label, ["warnings_and_precautions", "warnings", "precautions"]) ||
    "Monitor per standard of care when initiating or adjusting therapy.";
  const pearls = buildPearls(label);
  const tags = buildTags(source.drugClass, source.schedule);
  const keywords = buildKeywords(source.generic, source.brand, source.drugClass, tags);

  return {
    slug,
    name: displayName,
    class: source.drugClass || "",
    summary,
    dose: dosing,
    renal,
    monitoring,
    pearls,
    tags,
    keywords,
  };
}

function selectText(label: OpenFdaLabel | null, keys: string[]) {
  if (!label) return "";
  for (const key of keys) {
    const value = label?.[key];
    if (value) {
      return shortenSentences(Array.isArray(value) ? value.join(" ") : value, 2);
    }
  }
  return "";
}

function pickRenal(label: OpenFdaLabel | null) {
  if (!label) return "";
  const renalKeys = [
    "use_in_specific_populations",
    "clinical_pharmacology",
    "drug_interactions",
  ];
  for (const key of renalKeys) {
    const value = label?.[key];
    if (value) {
      const text = Array.isArray(value) ? value.join(" ") : value;
      const renalSentence = splitSentences(text).find((sentence) =>
        /renal|kidney|dialysis|creatinine|crcl/i.test(sentence),
      );
      if (renalSentence) {
        return renalSentence;
      }
    }
  }
  return "";
}

function buildPearls(label: OpenFdaLabel | null) {
  if (!label) return [];
  const sources = [
    "patient_counseling_information",
    "information_for_patients",
    "general_precautions",
    "medication_guide",
  ];
  const pearls: string[] = [];
  for (const key of sources) {
    const value = label?.[key];
    if (!value) continue;
    const text = Array.isArray(value) ? value.join(" ") : value;
    splitSentences(text)
      .filter((sentence) => sentence.length < 240)
      .slice(0, 3 - pearls.length)
      .forEach((sentence) => pearls.push(sentence));
    if (pearls.length >= 3) break;
  }
  return pearls;
}

function buildTags(drugClass: string, schedule: string) {
  const tokens = drugClass
    .split(/[,/]| and | & |\+/i)
    .map((token) => token.replace(/\(.*?\)/g, "").trim())
    .filter(Boolean)
    .map(titleCase);
  if (schedule && schedule !== "-") {
    tokens.push(schedule.toUpperCase());
  }
  return Array.from(new Set(tokens));
}

function buildKeywords(
  generic: string,
  brand: string,
  drugClass: string,
  tags: string[],
) {
  const keywords = new Set<string>();
  [generic, brand, drugClass, ...tags]
    .filter(Boolean)
    .forEach((value) => {
      value
        .split(/[\s/,+]+/)
        .map((token) => token.toLowerCase())
        .filter(Boolean)
        .forEach((token) => keywords.add(token));
    });
  return Array.from(keywords);
}

function cleanText(value?: string | null) {
  return (value || "").replace(/\s+/g, " ").replace(/[\u00A0]/g, " ").trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function shortenSentences(text: string, sentenceCount: number) {
  const sentences = splitSentences(text);
  return sentences.slice(0, sentenceCount).join(" ") || cleanText(text).slice(0, 280);
}

function splitSentences(text: string) {
  return cleanText(text)
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

async function main() {
  const topDrugs = await fetchTopDrugList();
  const records: MedicationRecord[] = [];
  console.log(`Fetched ${topDrugs.length} drugs from source table.`);

  for (let index = 0; index < topDrugs.length; index += 1) {
    const item = topDrugs[index];
    const label = await fetchOpenFdaLabel(item);
    const record = buildRecord(item, label);
    records.push(record);
    const status = label ? "ok" : "fallback";
    console.log(`[${index + 1}/${topDrugs.length}] ${item.generic} — ${status}`);
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(records, null, 2));
  console.log(`Wrote ${records.length} records to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
