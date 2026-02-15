import fs from "fs/promises";
import path from "path";
import { parse } from "csv-parse/sync";
import { medicationDataset } from "../src/data/medications";
import { resolveMedication } from "../src/lib/medication-matcher";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const DOWNLOAD_CODES = ["A", "B", "D", "H", "L", "P", "R", "V"] as const;
const BASE_URL = "https://ddinter.scbdd.com/static/media/download/ddinter_downloads_code_";
const OUTPUT_PATH = path.join(process.cwd(), "src/data/ddinter.interactions.json");

type CsvRow = {
  DDInterID_A: string;
  Drug_A: string;
  DDInterID_B: string;
  Drug_B: string;
  Level: string;
};

const severityRank: Record<string, number> = {
  major: 1,
  moderate: 2,
  minor: 3,
  unknown: 4,
};

function normalizeSeverity(value: string) {
  const normalized = value?.trim()?.toLowerCase() ?? "unknown";
  if (normalized === "major" || normalized === "moderate" || normalized === "minor") {
    return normalized;
  }
  return "unknown";
}

async function fetchCsv(code: string) {
  const url = `${BASE_URL}${code}.csv`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }
  return response.text();
}

async function run() {
  console.log("Downloading DDInter datasets...");
  const csvPayloads = await Promise.all(
    DOWNLOAD_CODES.map(async (code) => {
      console.log(`Fetching code ${code}...`);
      const data = await fetchCsv(code);
      console.log(`Fetched code ${code}`);
      return { code, data };
    }),
  );

  const adjacency = new Map<string, Map<string, string>>();
  const matchedPairs = new Set<string>();
  let totalRows = 0;

  const nameMap = new Map<string, string>();
  medicationDataset.forEach((record) => nameMap.set(record.slug, record.name));

  function upsertPair(aSlug: string, bSlug: string, severity: string) {
    if (!adjacency.has(aSlug)) {
      adjacency.set(aSlug, new Map());
    }
    const partners = adjacency.get(aSlug)!;
    const existing = partners.get(bSlug);
    if (!existing || severityRank[severity] < severityRank[existing]) {
      partners.set(bSlug, severity);
    }
  }

  csvPayloads.forEach(({ data, code }) => {
    const records = parse(data, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CsvRow[];

    totalRows += records.length;

    records.forEach((row) => {
      const a = resolveMedication(row.Drug_A);
      const b = resolveMedication(row.Drug_B);
      if (!a || !b || a.slug === b.slug) return;

      const severity = normalizeSeverity(row.Level);

      const key = [a.slug, b.slug].sort().join("__");
      matchedPairs.add(key);

      upsertPair(a.slug, b.slug, severity);
      upsertPair(b.slug, a.slug, severity);
    });

    console.log(`Processed code ${code}: ${records.length} rows`);
  });

  const adjacencyObject = Object.fromEntries(
    Array.from(adjacency.entries()).map(([slug, partners]) => [
      slug,
      Object.fromEntries(partners.entries()),
    ]),
  );

  const output = {
    meta: {
      source: "DDInter",
      website: "http://ddinter.scbdd.com/",
      license: "CC BY-NC-SA 4.0",
      generatedAt: new Date().toISOString(),
      downloadCodes: DOWNLOAD_CODES,
      totalRows,
      matchedPairs: matchedPairs.size,
    },
    names: Object.fromEntries(nameMap.entries()),
    adjacency: adjacencyObject,
  };

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`Saved ${matchedPairs.size} interactions to ${OUTPUT_PATH}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
