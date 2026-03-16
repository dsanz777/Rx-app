import fs from "node:fs";
import path from "node:path";

type MedicationRecord = {
  slug: string;
  name: string;
  class: string;
  mechanism: string;
  summary: string;
  dose: string;
  renal: string;
  sideEffects: string;
  monitoring: string;
  pearls: string[];
  tags: string[];
  keywords: string[];
};

type CandidateRecord = {
  generic: string;
  slug: string;
  count: number;
  reason: string;
};

type OpenFdaLabel = Record<string, string | string[] | undefined>;
type OpenFdaResponse = { results?: OpenFdaLabel[] };

const OPEN_FDA_URL = "https://api.fda.gov/drug/label.json";
const DATA_PATH = path.join(process.cwd(), "src/data/medications.generated.json");
const ARTIFACT_DIR = path.join(process.cwd(), "docs", "med-expansion");
const BATCH_NAME = process.env.MED_BATCH_NAME || "001";
const CANDIDATE_BATCH_NAME = process.env.CANDIDATE_BATCH_NAME || BATCH_NAME || "001";
const DEFAULT_CANDIDATE_PATH = path.join(process.cwd(), "docs", "med-expansion", "candidate-batch-001.json");
const CANDIDATE_PATH = path.join(process.cwd(), "docs", "med-expansion", `candidate-batch-${CANDIDATE_BATCH_NAME}.json`);
const IMPORT_JSON_PATH = path.join(ARTIFACT_DIR, `import-ready-batch-${BATCH_NAME}.json`);
const IMPORT_MD_PATH = path.join(ARTIFACT_DIR, `import-ready-batch-${BATCH_NAME}.md`);
const BACKUP_PATH = path.join(ARTIFACT_DIR, `medications.generated.before-batch-${BATCH_NAME}.json`);

const BATCH_SLUGS: Record<string, string[]> = {
  "001": [
    "lidocaine",
    "loratadine",
    "diclofenac-sodium",
    "cetirizine-hydrochloride",
    "levothyroxine-sodium",
    "cyclobenzaprine-hydrochloride",
    "buspirone-hydrochloride",
    "metoprolol-succinate",
    "metoprolol-tartrate",
    "doxycycline-hyclate",
    "tadalafil",
    "hydroxyzine-hydrochloride",
    "losartan-potassium",
    "estradiol",
    "propranolol-hydrochloride",
    "venlafaxine-hydrochloride",
    "pravastatin-sodium",
    "divalproex-sodium",
    "rosuvastatin-calcium",
    "sertraline-hydrochloride",
  ],
  "002": [
    "aspirin",
    "hydrocortisone",
    "naproxen-sodium",
    "atorvastatin-calcium",
    "bupropion-hydrochloride",
    "esomeprazole-magnesium",
    "fluticasone-propionate",
    "clotrimazole",
    "miconazole-nitrate",
    "loperamide-hydrochloride",
    "docusate-sodium",
    "calcium-carbonate",
    "benzocaine",
    "minoxidil",
  ],
  "003": [
    "metformin-hydrochloride",
    "amoxicillin-and-clavulanate-potassium",
    "zolpidem-tartrate",
    "amlodipine-besylate",
    "diltiazem-hydrochloride",
    "albuterol-sulfate",
    "fluoxetine-hydrochloride",
    "hydralazine-hydrochloride",
    "tramadol-hydrochloride",
    "pantoprazole-sodium",
    "nystatin",
    "dexamethasone",
    "quetiapine-fumarate",
    "trazodone-hydrochloride",
    "labetalol-hydrochloride",
  ],
  "004": [
    "acetaminophen",
    "salicylic-acid",
    "benzalkonium-chloride",
    "sodium-fluoride",
    "nicotine-polacrilex",
    "diphenhydramine-hydrochloride",
    "simethicone",
    "bismuth-subsalicylate",
    "triamcinolone-acetonide",
    "benzoyl-peroxide",
    "sodium-chloride",
    "tolnaftate",
    "oxymetazoline-hydrochloride",
    "ketorolac-tromethamine",
    "stannous-fluoride"
  ],
};

const SELECTED_SLUGS = new Set(BATCH_SLUGS[BATCH_NAME] ?? BATCH_SLUGS["001"]);

function cleanText(value?: string | null) {
  return (value || "").replace(/\s+/g, " ").replace(/[\u00A0]/g, " ").trim();
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function splitSentences(text: string) {
  return cleanText(text)
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function shortenSentences(text: string, sentenceCount: number) {
  const sentences = splitSentences(text);
  return sentences.slice(0, sentenceCount).join(" ") || cleanText(text).slice(0, 280);
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
  for (const key of ["use_in_specific_populations", "clinical_pharmacology", "drug_interactions"]) {
    const value = label?.[key];
    if (!value) continue;
    const text = Array.isArray(value) ? value.join(" ") : value;
    const renalSentence = splitSentences(text).find((sentence) =>
      /renal|kidney|dialysis|creatinine|crcl/i.test(sentence),
    );
    if (renalSentence) return renalSentence;
  }
  return "";
}

function buildPearls(label: OpenFdaLabel | null) {
  if (!label) return [];
  const pearls: string[] = [];
  for (const key of [
    "patient_counseling_information",
    "information_for_patients",
    "general_precautions",
    "medication_guide",
  ]) {
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

function inferMechanism(label: OpenFdaLabel | null) {
  const text =
    selectText(label, ["clinical_pharmacology", "mechanism_of_action", "description"]) || "";
  return text ? splitSentences(text)[0] || "" : "";
}

function inferSideEffects(label: OpenFdaLabel | null) {
  return selectText(label, ["adverse_reactions", "warnings_and_precautions", "boxed_warning"]) || "";
}

function inferMonitoring(label: OpenFdaLabel | null) {
  const text =
    selectText(label, ["warnings_and_precautions", "drug_interactions", "use_in_specific_populations"]) || "";
  if (!text) return "";
  const sentences = splitSentences(text).filter((sentence) =>
    /monitor|assess|check|periodic|baseline|follow-up|cbc|lft|electrolyte|blood pressure|renal/i.test(
      sentence,
    ),
  );
  return sentences.slice(0, 2).join(" ");
}

function buildTags(generic: string) {
  const lower = generic.toLowerCase();
  if (/(losartan|metoprolol|propranolol|pravastatin|rosuvastatin)/.test(lower)) return ["Cardiology"];
  if (/(levothyroxine|estradiol)/.test(lower)) return ["Endocrine"];
  if (/(sertraline|venlafaxine|buspirone|hydroxyzine|divalproex|cyclobenzaprine)/.test(lower)) return ["Neuropsych"];
  if (/(atorvastatin|aspirin|minoxidil)/.test(lower)) return ["Cardiology"];
  if (/(hydrocortisone|fluticasone|clotrimazole|miconazole|benzocaine)/.test(lower)) return ["Primary Care"];
  if (/(esomeprazole|loperamide|docusate|calcium carbonate)/.test(lower)) return ["Gastroenterology"];
  if (/(doxycycline|lidocaine|diclofenac|cetirizine|loratadine)/.test(lower)) return ["Primary Care"];
  return ["General Medicine"];
}

function buildKeywords(generic: string, tags: string[]) {
  const keywords = new Set<string>();
  [generic, ...tags]
    .flatMap((value) => value.split(/[\s/,+-]+/))
    .map((value) => value.toLowerCase())
    .filter(Boolean)
    .forEach((value) => keywords.add(value));
  return Array.from(keywords);
}

async function fetchOpenFdaLabel(generic: string) {
  const searchValues = Array.from(
    new Set([
      generic,
      generic.split(/\s+(hydrochloride|hcl|sodium|potassium|calcium|tartrate|succinate|acetate|hyclate)\b/i)[0]?.trim(),
    ].filter(Boolean)),
  );

  for (const value of searchValues) {
    const query = encodeURIComponent(`openfda.generic_name:"${value.replace(/"/g, '\\"')}"`);
    const url = `${OPEN_FDA_URL}?search=${query}&limit=1`;
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const data = (await response.json()) as OpenFdaResponse;
      if (data.results?.length) return data.results[0];
    } catch {
      // Ignore and try next.
    }
  }

  return null;
}

function buildRecord(candidate: CandidateRecord, label: OpenFdaLabel | null): MedicationRecord {
  const generic = titleCase(candidate.generic);
  const tags = buildTags(generic);
  return {
    slug: slugify(candidate.slug),
    name: generic,
    class: "",
    mechanism: inferMechanism(label),
    summary:
      selectText(label, ["indications_and_usage", "description"]) ||
      `Review prescribing information for ${generic}.`,
    dose:
      selectText(label, ["dosage_and_administration", "dosage_forms_and_strengths"]) ||
      "Dose based on indication, patient factors, and product labeling.",
    renal: pickRenal(label) || "Adjust or monitor per renal function and product labeling.",
    sideEffects: inferSideEffects(label),
    monitoring: inferMonitoring(label) || "Monitor response, tolerability, and safety labs per indication.",
    pearls: buildPearls(label),
    tags,
    keywords: buildKeywords(generic, tags),
  };
}

async function main() {
  const current = JSON.parse(fs.readFileSync(DATA_PATH, "utf8")) as MedicationRecord[];
  const existing = new Set(current.map((item) => item.slug));
  const candidatePath = fs.existsSync(CANDIDATE_PATH) ? CANDIDATE_PATH : DEFAULT_CANDIDATE_PATH;
  const candidatePayload = JSON.parse(fs.readFileSync(candidatePath, "utf8")) as {
    candidates: CandidateRecord[];
  };

  const chosen = candidatePayload.candidates.filter((item) => SELECTED_SLUGS.has(item.slug));
  const importReady: MedicationRecord[] = [];

  for (const candidate of chosen) {
    if (existing.has(candidate.slug)) continue;
    const label = await fetchOpenFdaLabel(candidate.generic);
    importReady.push(buildRecord(candidate, label));
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  fs.writeFileSync(BACKUP_PATH, `${JSON.stringify(current, null, 2)}\n`);
  fs.writeFileSync(IMPORT_JSON_PATH, `${JSON.stringify(importReady, null, 2)}\n`);

  const merged = [...current, ...importReady];
  fs.writeFileSync(DATA_PATH, `${JSON.stringify(merged, null, 2)}\n`);

  const lines = [
    `# Import Ready Batch ${BATCH_NAME}`,
    "",
    `Generated: ${new Date().toISOString()}`,
    `Records added: ${importReady.length}`,
    `Runtime count before merge: ${current.length + 6}`,
    `Generated record count before merge: ${current.length}`,
    `Generated record count after merge: ${merged.length}`,
    `Candidate source: ${candidatePath}`,
    "",
    "## Added Slugs",
    "",
    ...importReady.map((item) => `- \`${item.slug}\` — ${item.name}`),
    "",
    `Backup: ${BACKUP_PATH}`,
    "",
  ];
  fs.writeFileSync(IMPORT_MD_PATH, `${lines.join("\n")}\n`);

  console.log(`added_records\t${importReady.length}`);
  console.log(`backup_path\t${BACKUP_PATH}`);
  console.log(`import_json\t${IMPORT_JSON_PATH}`);
  console.log(`import_md\t${IMPORT_MD_PATH}`);
  console.log(`generated_count_after\t${merged.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
