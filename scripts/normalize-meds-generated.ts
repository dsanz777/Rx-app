import fs from "node:fs";
import path from "node:path";

type MedicationRecord = {
  slug: string;
  name: string;
  class?: string;
  mechanism?: string;
  summary?: string;
  dose?: string;
  renal?: string;
  sideEffects?: string;
  monitoring?: string;
  pearls?: string[];
  tags?: string[];
  keywords?: string[];
};

const DATA_PATH = path.join(process.cwd(), "src/data/medications.generated.json");

const CLASS_RULES: Array<{
  pattern: RegExp;
  className: string;
  moa: string;
  sideEffects: string;
  monitoring: string;
}> = [
  {
    pattern: /calcium channel blocker|amlodipine|diltiazem|verapamil|nifedipine/i,
    className: "Calcium channel blocker",
    moa: "Blocks L-type calcium channels in vascular smooth muscle and/or myocardium to reduce afterload and/or slow conduction.",
    sideEffects: "Peripheral edema, dizziness, flushing, headache, hypotension; non-DHP agents may cause bradycardia or constipation.",
    monitoring: "Blood pressure, heart rate, edema, dizziness, and symptomatic response.",
  },
  {
    pattern: /ace inhibitor|lisinopril|enalapril|benazepril|ramipril/i,
    className: "ACE inhibitor",
    moa: "Inhibits angiotensin-converting enzyme, reducing angiotensin II and aldosterone while increasing bradykinin.",
    sideEffects: "Cough, hyperkalemia, dizziness, hypotension, renal function decline; rare angioedema.",
    monitoring: "Blood pressure, serum creatinine, potassium, and signs of cough or angioedema.",
  },
  {
    pattern: /arb|valsartan|losartan|olmesartan|irbesartan|candesartan/i,
    className: "Angiotensin II receptor blocker (ARB)",
    moa: "Blocks angiotensin II at AT1 receptors, reducing vasoconstriction and aldosterone signaling.",
    sideEffects: "Hyperkalemia, dizziness, hypotension, renal function decline.",
    monitoring: "Blood pressure, serum creatinine, potassium, and volume status.",
  },
  {
    pattern: /beta blocker|metoprolol|atenolol|carvedilol|bisoprolol|propranolol/i,
    className: "Beta blocker",
    moa: "Blocks beta-adrenergic receptors, lowering heart rate, contractility, and renin release.",
    sideEffects: "Bradycardia, fatigue, dizziness, depression, sexual dysfunction; bronchospasm with non-selective agents.",
    monitoring: "Heart rate, blood pressure, fatigue, bronchospasm symptoms, and glycemic masking risk.",
  },
  {
    pattern: /thiazide|hydrochlorothiazide|chlorthalidone|indapamide/i,
    className: "Thiazide diuretic",
    moa: "Inhibits sodium-chloride reabsorption in the distal convoluted tubule, increasing natriuresis.",
    sideEffects: "Hypokalemia, hyponatremia, hyperuricemia, hyperglycemia, photosensitivity.",
    monitoring: "Blood pressure, sodium, potassium, creatinine, uric acid, and glucose.",
  },
  {
    pattern: /loop diuretic|furosemide|bumetanide|torsemide/i,
    className: "Loop diuretic",
    moa: "Inhibits the Na-K-2Cl cotransporter in the thick ascending limb, producing potent diuresis.",
    sideEffects: "Hypokalemia, hypomagnesemia, dehydration, hypotension; ototoxicity at high doses.",
    monitoring: "Weight, edema, blood pressure, renal function, sodium, potassium, and magnesium.",
  },
  {
    pattern: /sglt2|empagliflozin|dapagliflozin|canagliflozin/i,
    className: "SGLT2 inhibitor",
    moa: "Inhibits renal SGLT2 transporters, increasing urinary glucose and sodium excretion.",
    sideEffects: "Genital mycotic infections, polyuria, volume depletion, hypotension; rare euglycemic DKA.",
    monitoring: "Renal function, volume status, genital infections, and ketoacidosis symptoms.",
  },
  {
    pattern: /glp-1|semaglutide|liraglutide|dulaglutide|tirzepatide/i,
    className: "Incretin-based agent (GLP-1/GIP pathway)",
    moa: "Enhances glucose-dependent insulin activity, suppresses glucagon, delays gastric emptying, and increases satiety.",
    sideEffects: "Nausea, vomiting, diarrhea, constipation, abdominal pain; rare pancreatitis and gallbladder events.",
    monitoring: "A1C, weight, hydration status, GI tolerance, and pancreatitis symptoms.",
  },
  {
    pattern: /statin|atorvastatin|rosuvastatin|simvastatin|pravastatin/i,
    className: "HMG-CoA reductase inhibitor (statin)",
    moa: "Inhibits HMG-CoA reductase, reducing hepatic cholesterol synthesis and increasing LDL receptor expression.",
    sideEffects: "Myalgias, elevated liver enzymes, GI upset; rare rhabdomyolysis.",
    monitoring: "Lipid response, muscle symptoms, and liver enzymes when clinically indicated.",
  },
  {
    pattern: /metformin|biguanide/i,
    className: "Biguanide",
    moa: "Reduces hepatic gluconeogenesis and improves insulin sensitivity.",
    sideEffects: "Nausea, diarrhea, abdominal discomfort, B12 deficiency; rare lactic acidosis.",
    monitoring: "A1C, renal function, B12 with long-term use, and GI tolerability.",
  },
  {
    pattern: /insulin/i,
    className: "Insulin",
    moa: "Replaces or supplements endogenous insulin to improve peripheral glucose uptake and suppress hepatic glucose production.",
    sideEffects: "Hypoglycemia, weight gain, injection-site reactions, lipodystrophy.",
    monitoring: "Glucose trends, hypoglycemia events, injection technique, and weight.",
  },
  {
    pattern: /anticoagulant|apixaban|rivaroxaban|warfarin|dabigatran|edoxaban/i,
    className: "Anticoagulant",
    moa: "Inhibits coagulation pathway factors to reduce thrombin generation and clot propagation.",
    sideEffects: "Bleeding, bruising, anemia, GI bleeding risk.",
    monitoring: "Bleeding signs, CBC, renal/hepatic function, and major interaction checks.",
  },
  {
    pattern: /antiplatelet|aspirin|clopidogrel|ticagrelor|prasugrel/i,
    className: "Antiplatelet agent",
    moa: "Inhibits platelet activation and aggregation pathways to reduce arterial thrombosis risk.",
    sideEffects: "Bleeding, bruising, dyspepsia (aspirin), dyspnea (ticagrelor).",
    monitoring: "Bleeding signs, GI tolerance, adherence, and CBC when clinically indicated.",
  },
  {
    pattern: /ssri|sertraline|escitalopram|fluoxetine|paroxetine|citalopram/i,
    className: "Selective serotonin reuptake inhibitor (SSRI)",
    moa: "Inhibits presynaptic serotonin reuptake, increasing serotonergic signaling.",
    sideEffects: "Nausea, insomnia or somnolence, sexual dysfunction, headache, hyponatremia.",
    monitoring: "Mood response, suicidality risk, sodium in high-risk patients, and adverse effects.",
  },
  {
    pattern: /benzo|alprazolam|lorazepam|clonazepam|diazepam/i,
    className: "Benzodiazepine",
    moa: "Potentiates GABA-A receptor signaling to produce anxiolytic and sedative effects.",
    sideEffects: "Sedation, cognitive slowing, falls, dependence, withdrawal risk, respiratory depression with co-sedatives.",
    monitoring: "Sedation level, fall risk, misuse risk, and concurrent CNS depressant use.",
  },
  {
    pattern: /opioid|oxycodone|hydrocodone|tramadol|morphine|buprenorphine/i,
    className: "Opioid analgesic",
    moa: "Agonizes opioid receptors to reduce nociceptive transmission and pain perception.",
    sideEffects: "Constipation, sedation, nausea, respiratory depression, and dependence risk.",
    monitoring: "Pain relief and function, sedation, respiratory status, bowel habits, and misuse risk.",
  },
  {
    pattern: /nsaid|ibuprofen|naproxen|diclofenac|meloxicam/i,
    className: "Nonsteroidal anti-inflammatory drug (NSAID)",
    moa: "Inhibits cyclooxygenase enzymes, reducing prostaglandin-mediated inflammation and pain.",
    sideEffects: "GI irritation or bleeding, renal function decline, blood pressure elevation, edema, cardiovascular risk.",
    monitoring: "Pain response, GI bleeding signs, renal function, blood pressure, and edema.",
  },
  {
    pattern: /thyroid|levothyroxine|liothyronine/i,
    className: "Thyroid hormone replacement",
    moa: "Provides exogenous thyroid hormone to normalize metabolic and transcriptional effects.",
    sideEffects: "Over-replacement may cause palpitations, tremor, anxiety, insomnia, and weight loss.",
    monitoring: "TSH and free T4 after dose changes, plus symptom response.",
  },
  {
    pattern: /antibiotic|penicillin|ceph|macrolide|quinolone|fluoroquinolone|linezolid|amoxicillin|azithromycin|cephalexin/i,
    className: "Antibiotic",
    moa: "Class-dependent inhibition of bacterial cell wall, protein synthesis, DNA replication, or metabolic pathways.",
    sideEffects: "GI upset, rash, candidiasis, and C. difficile risk; serious effects vary by class.",
    monitoring: "Clinical response, adverse effects, culture-directed de-escalation, and renal or hepatic dosing needs.",
  },
];

function cleanText(value?: string) {
  return (value ?? "")
    .replace(/\r?\n+/g, " ")
    .replace(/[\u2022•]/g, "; ")
    .replace(/[○◦о]/g, "; ")
    .replace(/\s*\(\s*\d+(?:\.\d+)?\s*\)\s*/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\b\d+(?:\.\d+)?\s+(INDICATIONS?\s+AND\s+USAGE|DOSAGE\s+AND\s+ADMINISTRATION|WARNINGS?|PRECAUTIONS?)\b/gi, " ")
    .replace(/\b(INDICATIONS?\s+AND\s+USAGE|DOSAGE\s+AND\s+ADMINISTRATION|WARNINGS?|PRECAUTIONS?)\b/gi, " ")
    .replace(/\s+/g, " ")
    .replace(/\s*;\s*/g, "; ")
    .replace(/:\s*\./g, ".")
    .replace(/(\d)\.\s+(\d)/g, "$1.$2")
    .trim();
}

function sentenceCase(text: string) {
  if (!text) return "";
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => {
      const t = s.trim();
      if (!t) return "";
      return t.charAt(0).toUpperCase() + t.slice(1);
    })
    .filter(Boolean)
    .join(" ");
}

function normalizeSentence(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitCandidates(raw: string) {
  const protectedDecimals = raw.replace(/(\d)\.(\d)/g, "$1<DECIMAL>$2");
  return protectedDecimals
    .split(/[.;]+/)
    .map((s) => s.replace(/<DECIMAL>/g, "."))
    .map((s) => s.trim())
    .filter((s) => s.length > 12);
}

function pickClassLabel(raw: string) {
  const cleaned = cleanText(raw);
  if (!cleaned) return "";
  return cleaned
    .split(/[.;]+/)
    .map((s) => s.trim())
    .find(Boolean) ?? "";
}

function pickSentences(raw: string, maxItems: number) {
  const cleaned = sentenceCase(cleanText(raw));
  if (!cleaned) return "";

  const out: string[] = [];
  const seen = new Set<string>();
  for (const candidate of splitCandidates(cleaned)) {
    const key = normalizeSentence(candidate);
    if (!key || seen.has(key)) continue;
    if (/^important\s+limitation/i.test(candidate)) continue;
    if (/^adults?$/i.test(candidate)) continue;
    if (/for the treatment of:?$/i.test(candidate)) continue;
    seen.add(key);
    out.push(candidate.endsWith(".") ? candidate : `${candidate}.`);
    if (out.length >= maxItems) break;
  }

  return out.join(" ");
}

function isPlaceholder(text: string) {
  const t = (text ?? "").trim();
  if (!t) return true;
  return /not available|review prescribing info|see full prescribing information|monitor per standard of care|no pearls added yet|n\/a|none/i.test(t);
}

function isWeakClass(text: string) {
  return /^(anti\w+|antihypertensive|antibiotic|antifungal|antiviral|therapeutic agent|medication|drug)(\.)?$/i.test(
    (text ?? "").trim(),
  );
}

function inferFallback(record: MedicationRecord) {
  const joined = `${record.name ?? ""} ${record.class ?? ""} ${record.summary ?? ""} ${(record.keywords ?? []).join(" ")}`.toLowerCase();
  for (const rule of CLASS_RULES) {
    if (rule.pattern.test(joined)) return rule;
  }

  return {
    className: "Therapeutic agent",
    moa: "Therapeutic mechanism varies by specific product and indication.",
    sideEffects: "Adverse effects vary by product and patient factors.",
    monitoring: "Monitor response, tolerability, and safety labs per indication.",
  };
}

function canonicalizeClassMoa(record: MedicationRecord, classText: string, moaText: string) {
  const joined = `${record.slug ?? ""} ${record.name ?? ""} ${record.class ?? ""} ${(record.keywords ?? []).join(" ")} ${classText} ${moaText}`.toLowerCase();
  const match = CLASS_RULES.find((rule) => rule.pattern.test(joined));
  if (!match) {
    return {
      classText,
      moaText,
      sideEffects: "",
      monitoring: "",
    };
  }
  return {
    classText: match.className,
    moaText: match.moa,
    sideEffects: match.sideEffects,
    monitoring: match.monitoring,
  };
}

function isGenericSafety(text: string) {
  return /adverse effects vary|monitor response, tolerability, and safety labs per indication|monitor per standard of care|not available/i.test(
    text,
  );
}

function isNoisyMonitoring(text: string) {
  return /warnings?|contraindications?|do not use|special warning|patients should be instructed|seek medical help|fatal/i.test(
    text,
  );
}

function normalizeRecord(record: MedicationRecord): MedicationRecord {
  const fb = inferFallback(record);

  const klass = pickClassLabel(record.class ?? "");
  const classLabel = klass.replace(/[.]+$/g, "").trim();
  const mechanism = pickSentences(record.mechanism ?? "", 2);
  const summary = pickSentences(record.summary ?? "", 3);
  const dose = pickSentences(record.dose ?? "", 3);
  const renal = pickSentences(record.renal ?? "", 2);
  const sideEffects = pickSentences(record.sideEffects ?? "", 2);
  const monitoring = pickSentences(record.monitoring ?? "", 2);

  const pearls = (record.pearls ?? [])
    .map((p) => pickSentences(p, 1))
    .filter((p) => !isPlaceholder(p));

  const baseClass =
    !isPlaceholder(classLabel) && !isWeakClass(classLabel) ? classLabel : fb.className;
  const baseMoa = !isPlaceholder(mechanism) ? mechanism : fb.moa;
  const canonical = canonicalizeClassMoa(record, baseClass, baseMoa);
  const finalClass = canonical.classText || baseClass;
  const finalMoa = canonical.moaText || baseMoa;
  const finalSideEffects =
    !isPlaceholder(sideEffects) && !isGenericSafety(sideEffects)
      ? sideEffects
      : canonical.sideEffects || fb.sideEffects;
  const finalMonitoring =
    !isPlaceholder(monitoring) && !isGenericSafety(monitoring) && !isNoisyMonitoring(monitoring)
      ? monitoring
      : canonical.monitoring || fb.monitoring;

  return {
    ...record,
    class: finalClass,
    mechanism: finalMoa,
    summary: !isPlaceholder(summary) ? summary : "See prescribing information for indication details.",
    dose: !isPlaceholder(dose) ? dose : "Dose based on indication, patient factors, and product labeling.",
    renal: !isPlaceholder(renal) ? renal : "Adjust or monitor per renal function and product labeling.",
    sideEffects: finalSideEffects,
    monitoring: finalMonitoring,
    pearls,
  };
}

function main() {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  const parsed = JSON.parse(raw) as MedicationRecord[];
  const normalized = parsed.map(normalizeRecord);
  fs.writeFileSync(DATA_PATH, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  console.log(`Normalized ${normalized.length} medication records at ${DATA_PATH}`);
}

main();
