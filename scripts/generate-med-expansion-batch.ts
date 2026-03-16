import fs from "node:fs";
import path from "node:path";

type MedicationRecord = {
  slug: string;
  name: string;
  class: string;
  keywords?: string[];
  tags?: string[];
};

type OpenFdaCountResponse = {
  results?: Array<{ term?: string; count?: number }>;
};

type CandidateRecord = {
  generic: string;
  slug: string;
  count: number;
  reason: string;
};

const OPEN_FDA_URL = "https://api.fda.gov/drug/label.json";
const ARTIFACT_DIR = path.join(process.cwd(), "docs", "med-expansion");
const BATCH_NAME = process.env.MED_BATCH_NAME || "001";
const JSON_PATH = path.join(ARTIFACT_DIR, `candidate-batch-${BATCH_NAME}.json`);
const MD_PATH = path.join(ARTIFACT_DIR, `candidate-batch-${BATCH_NAME}.md`);
const LIMIT = 1200;
const BATCH_SIZE = 60;

const NON_MEDICATION_TERMS = new Set([
  "water",
  "alcohol",
  "ethyl alcohol",
  "isopropyl alcohol",
  "oxygen",
  "nitrogen",
  "petrolatum",
  "white petrolatum",
  "glycerin",
  "dimethicone",
  "witch hazel",
  "titanium dioxide",
  "zinc oxide",
  "titanium dioxide and zinc oxide",
  "avobenzone",
  "octisalate",
  "octinoxate",
  "homosalate",
  "menthol",
  "eucalyptol",
  "camphor",
  "capsaicin",
  "colloidal oatmeal",
  "chloroxylenol",
  "cetylpyridinium chloride",
  "povidone-iodine",
  "bacitracin zinc",
  "aluminum chlorohydrate",
  "aluminum sesquichlorohydrate",
  "aluminum zirconium tetrachlorohydrex gly",
]);

function cleanText(value?: string) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeGenericName(value: string) {
  return cleanText(value)
    .split(/[;,]/)[0]
    ?.replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function isLikelyMedicationName(value: string) {
  if (!value) return false;
  const normalized = value.toLowerCase();
  if (NON_MEDICATION_TERMS.has(normalized)) return false;
  if (/\b(kit|shampoo|toothpaste|cleanser|soap|deodorant|sunscreen|conditioner|cleaning)\b/i.test(normalized)) {
    return false;
  }
  if (normalized.length < 4) return false;
  return /[a-z]/i.test(value);
}

function candidateReason(name: string) {
  const lower = name.toLowerCase();
  if (/\b(insulin|glargine|lispro|aspart|detemir)\b/.test(lower)) {
    return "high utilization diabetes therapy missing from current dataset";
  }
  if (/\b(sevelamer|cinacalcet|calcitriol|lanthanum)\b/.test(lower)) {
    return "ESRD-relevant medication missing from current dataset";
  }
  if (/\b(tacrolimus|mycophenolate|cyclosporine)\b/.test(lower)) {
    return "high-cost specialty or transplant medication missing from current dataset";
  }
  if (/\b(ustekinumab|dupilumab|adalimumab|secukinumab|guselkumab)\b/.test(lower)) {
    return "high-cost specialty medication missing from current dataset";
  }
  return "high-frequency OpenFDA generic name not present in current dataset";
}

async function fetchOpenFdaCandidates() {
  const url = `${OPEN_FDA_URL}?search=${encodeURIComponent("_exists_:openfda.generic_name")}&count=openfda.generic_name.exact&limit=${LIMIT}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch OpenFDA frequency list: ${response.status}`);
  }

  const data = (await response.json()) as OpenFdaCountResponse;
  return (data.results ?? [])
    .map((item) => ({
      generic: normalizeGenericName(item.term ?? ""),
      count: item.count ?? 0,
    }))
    .filter((item) => isLikelyMedicationName(item.generic));
}

async function main() {
  const { medicationDataset } = await import("../src/data/medications");
  const existingSlugs = new Set(medicationDataset.map((item) => item.slug));
  const existingNames = new Set(
    medicationDataset.flatMap((item: MedicationRecord) => [
      cleanText(item.name).toLowerCase(),
      cleanText(item.name.replace(/\s*\([^)]*\)\s*/g, " ")).toLowerCase(),
    ]),
  );

  const openFda = await fetchOpenFdaCandidates();
  const unique = new Map<string, CandidateRecord>();

  for (const item of openFda) {
    const generic = cleanText(item.generic);
    if (!generic) continue;
    const slug = slugify(generic);
    if (!slug) continue;
    if (existingSlugs.has(slug)) continue;
    if (existingNames.has(generic.toLowerCase())) continue;
    if (unique.has(slug)) continue;

    unique.set(slug, {
      generic: titleCase(generic),
      slug,
      count: item.count,
      reason: candidateReason(generic),
    });
  }

  const batch = Array.from(unique.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, BATCH_SIZE);

  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  fs.writeFileSync(
    JSON_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: "OpenFDA generic_name frequency list",
        existingRuntimeCount: medicationDataset.length,
        batchSize: batch.length,
        candidates: batch,
      },
      null,
      2,
    ),
  );

  const lines = [
    `# Medication Expansion Candidate Batch ${BATCH_NAME}`,
    "",
    `Generated: ${new Date().toISOString()}`,
    `Current runtime medication count: ${medicationDataset.length}`,
    `Candidate batch size: ${batch.length}`,
    "",
    "## Candidates",
    "",
    "| Generic | Slug | Frequency Count | Reason |",
    "| --- | --- | ---: | --- |",
    ...batch.map(
      (item) =>
        `| ${item.generic} | \`${item.slug}\` | ${item.count} | ${item.reason} |`,
    ),
    "",
    "## Next Step",
    "",
    "Normalize, enrich, and validate these candidates into an import-ready batch before merging into `src/data/medications.generated.json`.",
    "",
  ];

  fs.writeFileSync(MD_PATH, `${lines.join("\n")}\n`);

  console.log(`existing_runtime_count\t${medicationDataset.length}`);
  console.log(`candidate_batch_size\t${batch.length}`);
  console.log(`json_artifact\t${JSON_PATH}`);
  console.log(`markdown_artifact\t${MD_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
