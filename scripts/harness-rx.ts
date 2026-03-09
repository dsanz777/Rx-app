import { medicationDataset } from "../src/data/medications";

type Issue = {
  slug: string;
  field: string;
  detail: string;
};

const PLACEHOLDER_RE =
  /not available|therapeutic mechanism varies|monitor per standard of care|adverse effects vary|no narrative provided/i;

const LABEL_ARTIFACT_RE =
  /\b\d+\s+(INDICATIONS?|DOSAGE\s+AND\s+ADMINISTRATION|WARNINGS?|PRECAUTIONS?|USE\s+IN\s+SPECIFIC\s+POPULATIONS|PATIENT\s+COUNSELING\s+INFORMATION)\b/i;

const GENERIC_RE =
  /\b(therapeutic agent|medication|drug)\b\.?$/i;

const issues: Issue[] = [];

function addIssue(slug: string, field: string, detail: string) {
  issues.push({ slug, field, detail });
}

function inspectText(slug: string, field: string, value: string) {
  const normalized = value.trim();
  if (!normalized) {
    addIssue(slug, field, "missing value");
    return;
  }
  if (PLACEHOLDER_RE.test(normalized)) {
    addIssue(slug, field, "contains placeholder/generic fallback language");
  }
  if (LABEL_ARTIFACT_RE.test(normalized)) {
    addIssue(slug, field, "contains FDA label section artifacts");
  }
}

const slugSeen = new Set<string>();
const nameSeen = new Set<string>();

for (const med of medicationDataset) {
  if (slugSeen.has(med.slug)) {
    addIssue(med.slug, "slug", "duplicate slug");
  } else {
    slugSeen.add(med.slug);
  }

  const normalizedName = med.name.trim().toLowerCase();
  if (nameSeen.has(normalizedName)) {
    addIssue(med.slug, "name", "duplicate medication name");
  } else {
    nameSeen.add(normalizedName);
  }

  inspectText(med.slug, "class", med.class);
  inspectText(med.slug, "mechanism", med.mechanism ?? "");
  inspectText(med.slug, "summary", med.summary);
  inspectText(med.slug, "dose", med.dose);
  inspectText(med.slug, "sideEffects", med.sideEffects ?? "");
  inspectText(med.slug, "monitoring", med.monitoring);
  inspectText(med.slug, "renal", med.renal);

  if (GENERIC_RE.test(med.class.trim())) {
    addIssue(med.slug, "class", "class is too generic");
  }

  for (const pearl of med.pearls ?? []) {
    inspectText(med.slug, "pearls", pearl);
  }
}

console.log(`medications_checked\t${medicationDataset.length}`);
console.log(`issues_found\t${issues.length}`);

if (issues.length > 0) {
  const sorted = [...issues].sort((a, b) =>
    `${a.slug}:${a.field}`.localeCompare(`${b.slug}:${b.field}`),
  );
  for (const issue of sorted.slice(0, 200)) {
    console.log(`${issue.slug}\t${issue.field}\t${issue.detail}`);
  }
  process.exit(1);
}

console.log("harness_status\tpass");
