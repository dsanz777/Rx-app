import generatedRaw from "./medications.generated.json";

export type MedicationRecord = {
  slug: string;
  name: string;
  class: string;
  mechanism?: string;
  summary: string;
  dose: string;
  renal: string;
  sideEffects?: string;
  monitoring: string;
  pearls: string[];
  tags: string[];
  keywords: string[];
};

const curatedRecords: MedicationRecord[] = [
  {
    slug: "semaglutide",
    name: "Semaglutide (Ozempic/Wegovy)",
    class: "GLP-1 receptor agonist",
    summary: "Weekly incretin that drives ~1.5-2.4% A1C drop and double-digit weight loss.",
    dose:
      "Inject 0.25 mg SC weekly ×4 weeks, then 0.5 mg. Escalate every ≥4 weeks to 1 mg, max 2 mg weekly for T2D (2.4 mg for obesity).",
    renal:
      "No dose adjustment. Limited clinical data in eGFR <15 mL/min; stop if persistent dehydration from GI events.",
    monitoring:
      "A1C/weight q8–12 weeks, renal function when severe GI losses, watch for pancreatitis or gallbladder symptoms.",
    pearls: [
      "Suspend 1 week before anesthesia or procedures needing gastric emptying.",
      "0.25 mg strength is for initiation only—therapeutic effect begins at 0.5 mg.",
      "Stack education on nausea mitigation (slow titration, small meals).",
    ],
    tags: ["GLP-1", "Cardiometabolic", "Weight"],
    keywords: ["semaglutide", "ozempic", "wegovy", "glp-1", "incretin"],
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide (Mounjaro/Zepbound)",
    class: "Dual GIP/GLP-1 receptor agonist",
    summary: "Dual incretin with fastest weight loss curve in-market; strong cardiometabolic impact.",
    dose:
      "2.5 mg SC weekly ×4 weeks, then 5 mg. Increase by 2.5 mg every ≥4 weeks as tolerated to 10–15 mg (max 15 mg).",
    renal:
      "No renal adjustment; monitor dehydration in eGFR <30 mL/min/1.73m².",
    monitoring:
      "Glucose/A1C, weight, GI tolerance, amylase/lipase if abdominal pain, contraception efficacy (delayed gastric emptying).",
    pearls: [
      "Send prior auth notes on dual incretin benefit + heart failure risk reduction signals.",
      "Hold 1 week pre-op similar to GLP-1s; restart when tolerating PO intake.",
      "Expect >20% weight loss at 15 mg with adherence—prep patients for plateau management.",
    ],
    tags: ["GLP-1", "Cardiometabolic", "Obesity"],
    keywords: ["tirzepatide", "mounjaro", "zepbound", "dual", "incretin"],
  },
  {
    slug: "empagliflozin",
    name: "Empagliflozin (Jardiance)",
    class: "SGLT2 inhibitor",
    summary:
      "Once-daily SGLT2 that drops HHF admissions ~35% and slows CKD progression even without diabetes.",
    dose:
      "10 mg PO daily in the morning. May increase to 25 mg if tolerating and eGFR ≥45 for glycemic control.",
    renal:
      "Initiate if eGFR ≥20. Stop for dialysis. Not effective for glycemic lowering when eGFR <30 but cardio-renal benefits persist.",
    monitoring:
      "BMP within 1–2 weeks of start, volume status, genital mycotic infections, ketones if high-risk for DKA.",
    pearls: [
      "Pause 3 days before major surgery or prolonged fasting.",
      "Use loop diuretic reductions to avoid hypotension when initiating in euvolemic HF patients.",
      "Pair with CGM alerts for euglycemic DKA education in low-carb diets.",
    ],
    tags: ["SGLT2", "Heart Failure", "CKD"],
    keywords: ["empagliflozin", "jardiance", "sglt2", "hf", "ckd"],
  },
  {
    slug: "dapagliflozin",
    name: "Dapagliflozin (Farxiga)",
    class: "SGLT2 inhibitor",
    summary: "Preferred SGLT2 for CKD 2–4 with albuminuria; robust HFpEF data.",
    dose: "10 mg PO daily; no titration needed.",
    renal:
      "Start if eGFR ≥25 mL/min/1.73m². Discontinue when patient reaches dialysis; expect transient eGFR dip on initiation.",
    monitoring:
      "BMP, weight, BP within 14 days; monitor for genital candidiasis and ketoacidosis symptoms.",
    pearls: [
      "Document UPCR/ACR trends for payer renewals.",
      "Coordinate with nephrology on diuretic downtitration when baseline euvolemic.",
      "For HF clinics, add to discharge order sets with automatic BMP follow-up.",
    ],
    tags: ["SGLT2", "CKD", "Heart Failure"],
    keywords: ["dapagliflozin", "farxiga", "ckd", "hfpef", "sglt2"],
  },
  {
    slug: "apixaban",
    name: "Apixaban (Eliquis)",
    class: "Direct oral anticoagulant",
    summary: "Standard DOAC for AF + VTE; least renal clearance of class.",
    dose:
      "5 mg PO BID. Reduce to 2.5 mg BID if patient has ≥2: age ≥80, weight ≤60 kg, or SCr ≥1.5 mg/dL.",
    renal:
      "Can use down to ESRD/on dialysis at 5 mg BID (2.5 mg if age ≥80 or weight ≤60 kg). Avoid if CrCl <15 and acute hepatic failure.",
    monitoring:
      "CBC + renal panel q6–12 months, peri-procedural hold plans, watch for CYP3A4/P-gp interactions.",
    pearls: [
      "Document CHADS-VASc & HAS-BLED in chart to bulletproof coverage.",
      "For neuraxial procedures hold 72 hrs; restart ≥6 hrs post-catheter removal.",
      "Avoid with carbamazepine, rifampin; consider LMWH bridge if forced switch.",
    ],
    tags: ["Anticoag", "Cardiology"],
    keywords: ["apixaban", "eliquis", "doac", "anticoagulation"],
  },
  {
    slug: "sacubitril-valsartan",
    name: "Sacubitril/valsartan (Entresto)",
    class: "ARNI",
    summary: "ARNI that cuts CV death/HF hospitalization by 20% vs. ACEi in HFrEF.",
    dose:
      "Start 24/26 mg BID if ACEi/ARB naïve or eGFR <30. Otherwise 49/51 mg BID. Double every 2–4 weeks to 97/103 mg BID as tolerated.",
    renal:
      "Use lowest starting dose when eGFR <30 mL/min/1.73m²; monitor potassium/creatinine within 1–2 weeks.",
    monitoring:
      "Blood pressure, BMP, NT-proBNP (will decrease) vs. BNP (may rise).",
    pearls: [
      "Need 36-hr washout after ACE inhibitor to avoid angioedema.",
      "Use hospice-level counseling on hypotension vs. mortality benefit.",
      "Document NYHA class + LVEF to streamline prior auth.",
    ],
    tags: ["Heart Failure", "Cardiology"],
    keywords: ["sacubitril", "valsartan", "entresto", "arni", "hfrEF"],
  },
  {
    slug: "budesonide-formoterol",
    name: "Budesonide/Formoterol (Symbicort) SMART",
    class: "ICS/LABA",
    summary: "SMART regimen = maintenance + reliever with same inhaler; cuts exacerbations by ~30%.",
    dose:
      "160/4.5 mcg: 2 puffs BID maintenance, 1 puff PRN symptoms (max 12 puffs/day).",
    renal: "No renal dosing concerns.",
    monitoring:
      "Inhaler technique, total daily puffs, adrenal suppression if >8 puffs chronically, growth velocity in pediatrics.",
    pearls: [
      "Write instructions clearly: 'Use for both control and rescue'.",
      "Ensure patient has enough inhalers to cover PRN use (usually 2/month).",
      "Pair with spacers or MDIs teach-back to boost adherence.",
    ],
    tags: ["Pulmonary", "Asthma"],
    keywords: ["budesonide", "formoterol", "symbicort", "smart", "asthma"],
  },
  {
    slug: "linezolid",
    name: "Linezolid",
    class: "Oxazolidinone antibiotic",
    summary: "100% bioavailable MRSA/VRE agent; watch serotonin and myelosuppression.",
    dose:
      "600 mg PO/IV every 12 hours for most infections; 10–14 days typical for pneumonia, up to 28 days for bone/joint.",
    renal:
      "No adjustment, but metabolites accumulate when CrCl <30—monitor for toxicity beyond 14 days.",
    monitoring:
      "CBC weekly after day 7, visual changes with >28-day therapy, drug–drug interactions with SSRIs/MAOIs.",
    pearls: [
      "Needs MAOI washout (24 hrs for reversible agents, 2 weeks for irreversible).",
      "Warn about tyramine-containing foods to avoid hypertensive crisis.",
      "Check insurance caps—IV to PO switch saves ~$500/day in hospital spend.",
    ],
    tags: ["Infectious Disease"],
    keywords: ["linezolid", "zyvox", "mrsa", "vre", "antibiotic"],
  },
];

const generatedRecords: MedicationRecord[] = (generatedRaw as MedicationRecord[]).map((item) => ({
  ...item,
  mechanism: item.mechanism ?? "",
  sideEffects: item.sideEffects ?? "",
  pearls: item.pearls ?? [],
  tags: item.tags ?? [],
  keywords: item.keywords ?? [],
}));

const mergedBySlug = new Map<string, MedicationRecord>();
for (const autoRecord of generatedRecords) {
  mergedBySlug.set(autoRecord.slug, autoRecord);
}
for (const curated of curatedRecords) {
  mergedBySlug.set(curated.slug, curated);
}

const CLASS_MOA_FALLBACKS: Array<{ pattern: RegExp; className: string; moa: string; sideEffects: string; monitoring: string }> = [
  {
    pattern: /calcium channel blocker|amlodipine|diltiazem|verapamil|nifedipine/i,
    className: "Calcium channel blocker",
    moa: "Blocks L-type calcium channels in vascular smooth muscle and/or myocardium, lowering afterload and/or slowing conduction depending on subclass.",
    sideEffects: "Peripheral edema, dizziness, flushing, headache, hypotension; non-DHP agents may cause bradycardia/constipation.",
    monitoring: "Blood pressure, heart rate, edema, dizziness, and symptom response.",
  },
  {
    pattern: /ace inhibitor|lisinopril|enalapril|benazepril|ramipril/i,
    className: "ACE inhibitor",
    moa: "Inhibits angiotensin-converting enzyme, reducing angiotensin II and aldosterone and increasing bradykinin.",
    sideEffects: "Cough, hyperkalemia, dizziness, hypotension, renal function decline; rare angioedema.",
    monitoring: "Blood pressure, serum creatinine, potassium, and cough/angioedema symptoms.",
  },
  {
    pattern: /arb|valsartan|losartan|olmesartan|irbesartan|candesartan/i,
    className: "Angiotensin II receptor blocker (ARB)",
    moa: "Blocks angiotensin II AT1 receptors to reduce vasoconstriction and aldosterone signaling.",
    sideEffects: "Hyperkalemia, dizziness, hypotension, renal function decline; lower cough risk vs ACE inhibitors.",
    monitoring: "Blood pressure, serum creatinine, potassium, and volume status.",
  },
  {
    pattern: /beta blocker|metoprolol|atenolol|carvedilol|bisoprolol|propranolol/i,
    className: "Beta blocker",
    moa: "Blocks beta-adrenergic receptors, reducing heart rate, myocardial oxygen demand, and renin release.",
    sideEffects: "Bradycardia, fatigue, dizziness, depression, sexual dysfunction, bronchospasm (non-selective agents).",
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
    sideEffects: "Hypokalemia, hypomagnesemia, dehydration, hypotension, ototoxicity (high doses).",
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
    moa: "Enhances glucose-dependent insulin activity, suppresses glucagon, delays gastric emptying, and improves satiety.",
    sideEffects: "Nausea, vomiting, diarrhea, constipation, abdominal pain; rare pancreatitis/gallbladder events.",
    monitoring: "A1C, weight, hydration status, GI tolerance, and pancreatitis symptoms.",
  },
  {
    pattern: /statin|atorvastatin|rosuvastatin|simvastatin|pravastatin/i,
    className: "HMG-CoA reductase inhibitor (statin)",
    moa: "Inhibits HMG-CoA reductase, lowering hepatic cholesterol synthesis and increasing LDL receptor expression.",
    sideEffects: "Myalgias, elevated liver enzymes, GI upset; rare rhabdomyolysis.",
    monitoring: "Lipid panel response, muscle symptoms, liver enzymes when clinically indicated.",
  },
  {
    pattern: /metformin|biguanide/i,
    className: "Biguanide",
    moa: "Reduces hepatic gluconeogenesis and improves insulin sensitivity.",
    sideEffects: "Nausea, diarrhea, abdominal discomfort, B12 deficiency; rare lactic acidosis.",
    monitoring: "A1C, renal function, B12 (long-term), and GI tolerability.",
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
    monitoring: "Bleeding signs, CBC, renal/hepatic function, and drug interactions.",
  },
  {
    pattern: /antiplatelet|aspirin|clopidogrel|ticagrelor|prasugrel/i,
    className: "Antiplatelet agent",
    moa: "Inhibits platelet activation/aggregation pathways to reduce arterial thrombosis risk.",
    sideEffects: "Bleeding, bruising, dyspepsia (aspirin), dyspnea (ticagrelor).",
    monitoring: "Bleeding signs, adherence, GI tolerance, and CBC when indicated.",
  },
  {
    pattern: /ppi|omeprazole|pantoprazole|lansoprazole|esomeprazole/i,
    className: "Proton pump inhibitor",
    moa: "Irreversibly inhibits gastric H+/K+ ATPase in parietal cells to suppress acid secretion.",
    sideEffects: "Headache, diarrhea, hypomagnesemia (long-term), B12 deficiency, fracture risk.",
    monitoring: "Symptom control, need for ongoing therapy, magnesium/B12 with prolonged use.",
  },
  {
    pattern: /ssri|sertraline|escitalopram|fluoxetine|paroxetine|citalopram/i,
    className: "Selective serotonin reuptake inhibitor (SSRI)",
    moa: "Inhibits presynaptic serotonin reuptake, increasing central serotonergic activity.",
    sideEffects: "Nausea, insomnia/somnolence, sexual dysfunction, headache, hyponatremia, QT risk (agent-dependent).",
    monitoring: "Mood response, suicidality risk, sodium in high-risk patients, and adverse effects.",
  },
  {
    pattern: /benzo|alprazolam|lorazepam|clonazepam|diazepam/i,
    className: "Benzodiazepine",
    moa: "Potentiates GABA-A receptor signaling, producing anxiolytic/sedative effects.",
    sideEffects: "Sedation, cognitive slowing, falls, dependence, withdrawal risk, respiratory depression with co-sedatives.",
    monitoring: "Sedation level, misuse risk, fall risk, and concurrent CNS depressants.",
  },
  {
    pattern: /opioid|oxycodone|hydrocodone|tramadol|morphine|buprenorphine/i,
    className: "Opioid analgesic",
    moa: "Agonizes opioid receptors to reduce pain perception and nociceptive transmission.",
    sideEffects: "Constipation, sedation, nausea, respiratory depression, dependence/misuse risk.",
    monitoring: "Pain relief/function, sedation, respiratory status, bowel regimen, and misuse risk.",
  },
  {
    pattern: /nsaid|ibuprofen|naproxen|diclofenac|meloxicam/i,
    className: "Nonsteroidal anti-inflammatory drug (NSAID)",
    moa: "Inhibits cyclooxygenase enzymes, reducing prostaglandin-mediated pain and inflammation.",
    sideEffects: "GI irritation/bleeding, renal function decline, blood pressure elevation, edema, CV risk.",
    monitoring: "Pain response, GI bleeding signs, renal function, blood pressure, and edema.",
  },
  {
    pattern: /thyroid|levothyroxine|liothyronine/i,
    className: "Thyroid hormone replacement",
    moa: "Provides exogenous thyroid hormone to normalize transcriptional and metabolic effects.",
    sideEffects: "Over-replacement: palpitations, tremor, anxiety, insomnia, weight loss.",
    monitoring: "TSH/free T4 and clinical symptom response after dose changes.",
  },
  {
    pattern: /antibiotic|penicillin|ceph|macrolide|quinolone|fluoroquinolone|linezolid|amoxicillin|azithromycin|cephalexin/i,
    className: "Antibiotic",
    moa: "Class-dependent inhibition of bacterial cell wall, protein synthesis, DNA replication, or metabolic pathways.",
    sideEffects: "GI upset, rash, candidiasis, C. difficile risk; class-specific serious effects vary.",
    monitoring: "Clinical improvement, adverse effects, culture-guided de-escalation, and renal/hepatic dosing needs.",
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
    .replace(/^\s*(general|information for patients|patient counseling information)\s*:?\s*/i, "")
    .replace(/\s+/g, " ")
    .replace(/\s*;\s*/g, "; ")
    .replace(/:\s*\./g, ".")
    .replace(/(\d)\.\s+(\d)/g, "$1.$2")
    .trim();
}

function stripSectionNoise(text: string) {
  return text
    .replace(/\b\d+\s*USE IN SPECIFIC POPULATIONS\b/gi, "")
    .replace(/\bUSE IN SPECIFIC POPULATIONS\b/gi, "")
    .replace(/\b\d+\s*PATIENT COUNSELING INFORMATION\b/gi, "")
    .replace(/\bPATIENT COUNSELING INFORMATION\b/gi, "")
    .replace(/\bFDA-?approved patient labeling\b/gi, "")
    .replace(/\bmedication guide\b/gi, "")
    .replace(/\bpatient information(?: and instructions for use)?\b/gi, "")
    .replace(/\bthis product(?:'s)? labeling may have been updated\b/gi, "")
    .replace(/\bfor the most recent prescribing information,?\s*please visit\s*\w*\.?\b/gi, "")
    .replace(/\s+/g, " ")
    .replace(/^[;:,\-\s]+/, "")
    .replace(/[;:,\-\s]+$/, "")
    .trim();
}

function sentenceCase(text: string) {
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

function takeSentences(raw: string, maxSentences = 2) {
  const cleaned = sentenceCase(stripSectionNoise(cleanText(raw)));
  if (!cleaned) return "";
  const protectedDecimals = cleaned.replace(/(\d)\.(\d)/g, "$1<DEC>$2");
  const candidates = protectedDecimals
    .split(/[.;]+/)
    .map((s) => s.replace(/<DEC>/g, ".").trim())
    .filter((s) => s.length > 12);
  const out: string[] = [];
  const seen = new Set<string>();
  for (const candidate of candidates) {
    if (
      /medication guide|patient information|instructions for use|fda-approved|read the .*labeling|prescribing information/i.test(
        candidate,
      )
    )
      continue;
    const key = candidate.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
    if (!key || seen.has(key)) continue;
    if (/^important\s+limitation/i.test(candidate)) continue;
    if (/^adults?$/i.test(candidate)) continue;
    if (/for the treatment of:?$/i.test(candidate)) continue;
    seen.add(key);
    out.push(candidate.endsWith(".") ? candidate : `${candidate}.`);
    if (out.length >= maxSentences) break;
  }
  return out.join(" ");
}

function isPlaceholder(text: string) {
  return /not available|review prescribing info|see full prescribing information|monitor per standard of care|no pearls added yet|n\/a|none/i.test(
    text,
  );
}

function isWeakClass(text: string) {
  return /^(anti\w+|antihypertensive|antibiotic|antifungal|antiviral|therapeutic agent|medication|drug)(\.)?$/i.test(
    text.trim(),
  );
}

function inferFallback(record: MedicationRecord) {
  const joined = `${record.name} ${record.class} ${record.summary} ${(record.keywords ?? []).join(" ")}`.toLowerCase();
  for (const rule of CLASS_MOA_FALLBACKS) {
    if (rule.pattern.test(joined)) return rule;
  }
  return {
    className: "Therapeutic agent",
    moa: "Therapeutic mechanism varies by specific product and indication.",
    sideEffects: "Adverse effects vary by product and patient factors.",
    monitoring: "Monitor response, tolerability, and safety labs per indication.",
  };
}

const CANONICAL_CLASS_MOA: Array<{ pattern: RegExp; className: string; moa: string }> = [
  { pattern: /amlodipine|nifedipine|felodipine/, className: "Dihydropyridine calcium channel blocker", moa: "Blocks L-type calcium channels in vascular smooth muscle, reducing peripheral vascular resistance and blood pressure." },
  { pattern: /diltiazem|verapamil/, className: "Non-dihydropyridine calcium channel blocker", moa: "Blocks L-type calcium channels in myocardium and vascular smooth muscle, slowing AV nodal conduction and reducing afterload." },
  { pattern: /lisinopril|enalapril|benazepril|ramipril|quinapril/, className: "ACE inhibitor", moa: "Inhibits angiotensin-converting enzyme, reducing angiotensin II and aldosterone while increasing bradykinin." },
  { pattern: /losartan|valsartan|olmesartan|irbesartan|candesartan/, className: "Angiotensin II receptor blocker (ARB)", moa: "Blocks angiotensin II at AT1 receptors, reducing vasoconstriction and aldosterone signaling." },
  { pattern: /metoprolol|atenolol|carvedilol|nebivolol|propranolol|bisoprolol/, className: "Beta blocker", moa: "Blocks beta-adrenergic receptors, reducing heart rate, contractility, and renin release." },
  { pattern: /hydrochlorothiazide|chlorthalidone|indapamide/, className: "Thiazide diuretic", moa: "Inhibits sodium-chloride cotransporter in the distal convoluted tubule, increasing natriuresis." },
  { pattern: /furosemide|bumetanide|torsemide/, className: "Loop diuretic", moa: "Inhibits Na-K-2Cl cotransporter in the thick ascending limb, producing potent diuresis." },
  { pattern: /triamterene/, className: "Potassium-sparing diuretic (ENaC blocker)", moa: "Blocks epithelial sodium channels in the distal nephron, reducing sodium reabsorption and potassium loss." },
  { pattern: /spironolactone|eplerenone/, className: "Mineralocorticoid receptor antagonist", moa: "Antagonizes aldosterone receptors in the distal nephron, increasing sodium excretion and potassium retention." },
  { pattern: /atorvastatin|rosuvastatin|simvastatin|pravastatin|lovastatin/, className: "HMG-CoA reductase inhibitor (statin)", moa: "Inhibits HMG-CoA reductase, reducing hepatic cholesterol synthesis and increasing LDL receptor expression." },
  { pattern: /ezetimibe/, className: "Cholesterol absorption inhibitor", moa: "Inhibits NPC1L1-mediated intestinal cholesterol absorption." },
  { pattern: /warfarin/, className: "Vitamin K antagonist anticoagulant", moa: "Inhibits vitamin K epoxide reductase (VKORC1), reducing synthesis of vitamin K-dependent clotting factors." },
  { pattern: /apixaban|rivaroxaban|edoxaban/, className: "Factor Xa inhibitor anticoagulant", moa: "Directly inhibits factor Xa, reducing thrombin generation and clot propagation." },
  { pattern: /dabigatran/, className: "Direct thrombin inhibitor anticoagulant", moa: "Directly inhibits thrombin (factor IIa), reducing fibrin clot formation." },
  { pattern: /clopidogrel|prasugrel|ticagrelor/, className: "P2Y12 receptor antagonist antiplatelet", moa: "Inhibits platelet ADP P2Y12 signaling, reducing platelet activation and aggregation." },
  { pattern: /aspirin/, className: "Cyclooxygenase inhibitor antiplatelet", moa: "Irreversibly inhibits platelet COX-1, suppressing thromboxane A2-mediated aggregation." },
  { pattern: /omeprazole|esomeprazole|lansoprazole|pantoprazole|rabeprazole/, className: "Proton pump inhibitor", moa: "Irreversibly inhibits gastric H+/K+ ATPase in parietal cells, suppressing acid secretion." },
  { pattern: /famotidine/, className: "Histamine-2 receptor antagonist", moa: "Blocks gastric H2 receptors on parietal cells, reducing acid secretion." },
  { pattern: /metformin/, className: "Biguanide", moa: "Reduces hepatic gluconeogenesis and improves insulin sensitivity." },
  { pattern: /glimepiride|glipizide|glyburide/, className: "Sulfonylurea", moa: "Closes pancreatic beta-cell ATP-sensitive potassium channels to stimulate insulin secretion." },
  { pattern: /sitagliptin|linagliptin|saxagliptin/, className: "DPP-4 inhibitor", moa: "Inhibits DPP-4, increasing endogenous incretin activity and glucose-dependent insulin secretion." },
  { pattern: /empagliflozin|dapagliflozin|canagliflozin|ertugliflozin/, className: "SGLT2 inhibitor", moa: "Inhibits renal SGLT2 transporters, increasing urinary glucose and sodium excretion." },
  { pattern: /semaglutide|liraglutide|dulaglutide|tirzepatide/, className: "Incretin-based antidiabetic agent", moa: "Enhances glucose-dependent insulin activity, suppresses glucagon, and delays gastric emptying." },
  { pattern: /levothyroxine/, className: "Thyroid hormone replacement", moa: "Provides exogenous T4 to restore thyroid hormone signaling and metabolic effects." },
  { pattern: /methimazole/, className: "Thioamide antithyroid agent", moa: "Inhibits thyroid peroxidase, reducing thyroid hormone synthesis." },
  { pattern: /sertraline|escitalopram|citalopram|fluoxetine|paroxetine/, className: "Selective serotonin reuptake inhibitor (SSRI)", moa: "Inhibits presynaptic serotonin reuptake, increasing serotonergic neurotransmission." },
  { pattern: /duloxetine|venlafaxine|desvenlafaxine/, className: "Serotonin-norepinephrine reuptake inhibitor (SNRI)", moa: "Inhibits presynaptic serotonin and norepinephrine reuptake." },
  { pattern: /trazodone/, className: "Serotonin antagonist and reuptake inhibitor (SARI)", moa: "Antagonizes 5-HT2 receptors and weakly inhibits serotonin reuptake with additional antihistaminic effects." },
  { pattern: /bupropion/, className: "Norepinephrine-dopamine reuptake inhibitor (NDRI)", moa: "Inhibits neuronal norepinephrine and dopamine reuptake." },
  { pattern: /amitriptyline|nortriptyline/, className: "Tricyclic antidepressant", moa: "Inhibits norepinephrine and serotonin reuptake with additional receptor antagonism." },
  { pattern: /alprazolam|lorazepam|clonazepam|diazepam|temazepam/, className: "Benzodiazepine", moa: "Positive allosteric modulator of GABA-A receptors, enhancing inhibitory neurotransmission." },
  { pattern: /zolpidem/, className: "Nonbenzodiazepine hypnotic (Z-drug)", moa: "Positive allosteric modulator of GABA-A receptors, preferentially at alpha-1 subunits." },
  { pattern: /gabapentin|pregabalin/, className: "Gabapentinoid anticonvulsant", moa: "Binds alpha-2-delta calcium channel subunit, reducing excitatory neurotransmitter release." },
  { pattern: /levetiracetam/, className: "Anticonvulsant (SV2A modulator)", moa: "Binds synaptic vesicle protein SV2A to modulate neurotransmitter release." },
  { pattern: /lamotrigine|oxcarbazepine|phenytoin|topiramate/, className: "Sodium channel-modulating anticonvulsant", moa: "Modulates voltage-gated sodium channels to reduce high-frequency neuronal firing." },
  { pattern: /quetiapine|risperidone|olanzapine|aripiprazole/, className: "Atypical antipsychotic", moa: "Primarily modulates dopamine and serotonin receptor signaling in the CNS." },
  { pattern: /amphetamine|methylphenidate|dexmethylphenidate|lisdexamfetamine|atomoxetine/, className: "ADHD pharmacotherapy agent", moa: "Increases central catecholaminergic signaling by reuptake inhibition and/or presynaptic release effects." },
  { pattern: /tamsulosin|doxazosin|terazosin|prazosin/, className: "Alpha-1 adrenergic antagonist", moa: "Blocks alpha-1 adrenergic receptors, reducing vascular tone and/or relaxing bladder outlet smooth muscle." },
  { pattern: /finasteride|dutasteride/, className: "5-alpha reductase inhibitor", moa: "Inhibits conversion of testosterone to dihydrotestosterone, reducing androgen-driven prostate growth." },
  { pattern: /albuterol/, className: "Beta-2 adrenergic agonist bronchodilator", moa: "Stimulates beta-2 receptors in bronchial smooth muscle, increasing cAMP and causing bronchodilation." },
  { pattern: /budesonide-formoterol|symbicort|ics\/laba/, className: "Inhaled corticosteroid/long-acting beta-2 agonist combination", moa: "Combines inhaled glucocorticoid anti-inflammatory action with long-acting beta-2 receptor agonism for bronchodilation and asthma control." },
  { pattern: /tiotropium|ipratropium|oxybutynin|tolterodine|dicyclomine|benztropine|meclizine/, className: "Antimuscarinic agent", moa: "Antagonizes muscarinic receptors to reduce smooth muscle spasm and/or secretory signaling." },
  { pattern: /fluticasone|methylprednisolone|triamcinolone|clobetasol/, className: "Glucocorticoid corticosteroid", moa: "Activates glucocorticoid receptors, altering transcription of pro-inflammatory mediators." },
  { pattern: /amoxicillin|cephalexin|cefdinir|clindamycin|azithromycin|clarithromycin|doxycycline|ciprofloxacin|levofloxacin|moxifloxacin|nitrofurantoin|metronidazole|fluconazole|ketoconazole|mupirocin/, className: "Antimicrobial agent", moa: "Agent-specific inhibition of microbial cell wall, protein synthesis, nucleic acid synthesis, or membrane/sterol pathways." },
  { pattern: /hydrocodone|oxycodone|fentanyl|tramadol|morphine|buprenorphine/, className: "Opioid analgesic", moa: "Agonizes opioid receptors to reduce nociceptive transmission and pain perception." },
  { pattern: /montelukast/, className: "Leukotriene receptor antagonist", moa: "Selectively blocks cysteinyl leukotriene (CysLT1) receptors to reduce leukotriene-mediated airway inflammation and bronchoconstriction." },
  { pattern: /cetirizine|levocetirizine|hydroxyzine|promethazine/, className: "Histamine H1 receptor antagonist", moa: "Blocks histamine H1 receptors to reduce histamine-mediated allergic symptoms; some agents have additional anticholinergic/CNS effects." },
  { pattern: /alendronate|ibandronate|risedronate/, className: "Bisphosphonate", moa: "Binds bone hydroxyapatite and inhibits osteoclast-mediated bone resorption, increasing bone mineral density over time." },
  { pattern: /potassium chloride/, className: "Electrolyte supplement (potassium)", moa: "Repletes potassium to restore cellular membrane potential and neuromuscular/cardiac electrical function." },
  { pattern: /folic acid/, className: "Vitamin B9 supplement (folate)", moa: "Supplies folate for nucleotide synthesis and erythropoiesis, correcting folate deficiency states." },
  { pattern: /clonidine|guanfacine|tizanidine/, className: "Alpha-2 adrenergic agonist", moa: "Stimulates central alpha-2 adrenergic receptors, reducing sympathetic outflow and/or modulating motor tone depending on indication." },
  { pattern: /fenofibrate|gemfibrozil/, className: "Fibrate (PPAR-alpha agonist)", moa: "Activates peroxisome proliferator-activated receptor alpha (PPAR-alpha), lowering triglycerides and modifying lipoprotein metabolism." },
  { pattern: /sildenafil/, className: "Phosphodiesterase-5 inhibitor", moa: "Inhibits phosphodiesterase-5 to increase cGMP signaling and nitric oxide-mediated smooth-muscle relaxation." },
  { pattern: /ethinyl-estradiol-drospirenone|ethinyl-estradiol-norgestimate/, className: "Combined hormonal contraceptive (estrogen/progestin)", moa: "Suppresses ovulation via hypothalamic-pituitary feedback and alters cervical mucus/endometrium to reduce fertilization and implantation probability." },
  { pattern: /isosorbide mononitrate|nitroglycerin|nitroglycerine/, className: "Organic nitrate antianginal", moa: "Donates nitric oxide in vascular smooth muscle, increasing cGMP and causing venodilation to reduce myocardial oxygen demand." },
  { pattern: /donepezil/, className: "Acetylcholinesterase inhibitor", moa: "Reversibly inhibits central acetylcholinesterase, increasing synaptic acetylcholine in cortical cholinergic pathways." },
  { pattern: /metoclopramide/, className: "Dopamine D2 receptor antagonist prokinetic/antiemetic", moa: "Antagonizes dopamine D2 receptors (and weakly 5-HT3 at higher doses), increasing GI motility and reducing nausea signaling." },
  { pattern: /buspirone/, className: "Anxiolytic (5-HT1A partial agonist)", moa: "Partially agonizes serotonin 5-HT1A receptors to reduce anxiety without benzodiazepine-like GABAergic sedation." },
  { pattern: /sumatriptan/, className: "Triptan antimigraine (5-HT1B/1D agonist)", moa: "Agonizes serotonin 5-HT1B/1D receptors, causing cranial vasoconstriction and inhibition of trigeminal neuropeptide release." },
  { pattern: /divalproex|valproate/, className: "Broad-spectrum anticonvulsant (valproate)", moa: "Increases central GABA availability and modulates voltage-gated sodium channels to stabilize neuronal firing." },
  { pattern: /pramipexole|ropinirole/, className: "Dopamine agonist", moa: "Stimulates dopamine receptors (predominantly D2/D3) to improve motor and restless-legs symptoms." },
  { pattern: /mirtazapine/, className: "Noradrenergic and specific serotonergic antidepressant (NaSSA)", moa: "Antagonizes central alpha-2 adrenergic autoreceptors/heteroreceptors and blocks 5-HT2/5-HT3 receptors, enhancing noradrenergic and serotonergic transmission." },
  { pattern: /latanoprost/, className: "Prostaglandin analog ophthalmic", moa: "Agonizes prostaglandin FP receptors to increase uveoscleral aqueous outflow and lower intraocular pressure." },
  { pattern: /polyethylene glycol/, className: "Osmotic laxative", moa: "Retains water in the intestinal lumen via osmotic activity, softening stool and promoting bowel movements." },
  { pattern: /methotrexate/, className: "Antimetabolite (folate antagonist)", moa: "Inhibits dihydrofolate reductase and related folate-dependent pathways, reducing DNA synthesis and immune/inflammatory cell proliferation." },
  { pattern: /varenicline/, className: "Partial nicotinic receptor agonist (smoking cessation)", moa: "Partially agonizes alpha4beta2 nicotinic acetylcholine receptors, reducing nicotine withdrawal and reward reinforcement." },
  { pattern: /raloxifene/, className: "Selective estrogen receptor modulator (SERM)", moa: "Acts as an estrogen receptor agonist in bone and antagonist in breast/uterine tissue, improving bone outcomes while limiting estrogenic stimulation in select tissues." },
  { pattern: /memantine/, className: "NMDA receptor antagonist", moa: "Noncompetitively antagonizes NMDA receptors to reduce pathologic glutamatergic excitotoxic signaling." },
  { pattern: /ondansetron/, className: "5-HT3 receptor antagonist antiemetic", moa: "Blocks serotonin 5-HT3 receptors in the vagal afferent pathway and chemoreceptor trigger zone to prevent nausea and vomiting." },
  { pattern: /adalimumab/, className: "TNF-alpha inhibitor biologic", moa: "Binds and neutralizes tumor necrosis factor-alpha (TNF-alpha), reducing downstream pro-inflammatory cytokine signaling." },
  { pattern: /baclofen/, className: "Skeletal muscle relaxant (GABA-B agonist)", moa: "Agonizes GABA-B receptors in the spinal cord to reduce excitatory neurotransmission and spasticity." },
  { pattern: /hydroxychloroquine/, className: "Antimalarial/DMARD", moa: "Accumulates in lysosomes and modulates antigen processing/toll-like receptor signaling, reducing autoimmune inflammatory activity." },
  { pattern: /mirabegron/, className: "Beta-3 adrenergic agonist (overactive bladder)", moa: "Stimulates beta-3 adrenergic receptors in detrusor muscle to increase bladder relaxation and storage capacity." },
];

function canonicalizeClassMoa(record: MedicationRecord, classText: string, moaText: string) {
  const joined = `${record.slug} ${record.name} ${record.class ?? ""} ${(record.keywords ?? []).join(" ")} ${classText} ${moaText}`.toLowerCase();
  const match = CANONICAL_CLASS_MOA.find((item) => item.pattern.test(joined));
  if (!match) return { classText, moaText };
  return { classText: match.className, moaText: match.moa };
}

const CLASS_SAFETY_DEFAULTS: Array<{ pattern: RegExp; sideEffects: string; monitoring: string }> = [
  { pattern: /calcium channel blocker/i, sideEffects: "Peripheral edema, dizziness, flushing, headache, hypotension; non-DHP agents may cause bradycardia or constipation.", monitoring: "Blood pressure, heart rate, edema, and symptomatic response." },
  { pattern: /ace inhibitor/i, sideEffects: "Cough, hyperkalemia, dizziness, hypotension, rise in creatinine; rare angioedema.", monitoring: "Blood pressure, serum creatinine, potassium, and angioedema/cough symptoms." },
  { pattern: /arb/i, sideEffects: "Hyperkalemia, dizziness, hypotension, rise in creatinine.", monitoring: "Blood pressure, serum creatinine, potassium, and volume status." },
  { pattern: /beta blocker/i, sideEffects: "Bradycardia, fatigue, dizziness, depression, sexual dysfunction; bronchospasm risk with non-selective agents.", monitoring: "Heart rate, blood pressure, fatigue, and bronchospasm symptoms." },
  { pattern: /thiazide diuretic/i, sideEffects: "Hypokalemia, hyponatremia, hyperuricemia, hyperglycemia, photosensitivity.", monitoring: "Blood pressure, sodium, potassium, creatinine, uric acid, and glucose." },
  { pattern: /loop diuretic/i, sideEffects: "Hypokalemia, hypomagnesemia, dehydration, hypotension; ototoxicity at high doses.", monitoring: "Weight, edema, blood pressure, sodium, potassium, magnesium, and renal function." },
  { pattern: /statin/i, sideEffects: "Myalgias, elevated transaminases, GI upset; rare rhabdomyolysis.", monitoring: "Lipid response, muscle symptoms, and liver enzymes when clinically indicated." },
  { pattern: /proton pump inhibitor/i, sideEffects: "Headache, diarrhea, nausea; long-term risk of hypomagnesemia, B12 deficiency, and fractures.", monitoring: "Symptom control, long-term necessity, magnesium/B12 in prolonged use, and C. difficile risk." },
  { pattern: /ssri|snri|tricyclic antidepressant|ndri/i, sideEffects: "Nausea, insomnia or somnolence, headache, sexual dysfunction; blood pressure elevation with some SNRIs.", monitoring: "Mood response, suicidality risk, adverse effects, and blood pressure for SNRI therapy." },
  { pattern: /benzodiazepine|hypnotic/i, sideEffects: "Sedation, cognitive slowing, dizziness, falls, dependence/tolerance risk, and withdrawal effects.", monitoring: "Sedation level, fall risk, misuse risk, and concurrent CNS depressant exposure." },
  { pattern: /gabapentinoid|anticonvulsant/i, sideEffects: "Dizziness, somnolence, ataxia, cognitive slowing, peripheral edema, and weight gain (agent-dependent).", monitoring: "Seizure/symptom control, sedation, gait instability, mood changes, and renal function for dose adjustment." },
  { pattern: /antipsychotic/i, sideEffects: "Sedation, weight gain, metabolic syndrome risk, extrapyramidal symptoms, and QT prolongation risk (agent-dependent).", monitoring: "Weight/BMI, glucose or A1C, lipids, movement symptoms, and QT risk when indicated." },
  { pattern: /adhd pharmacotherapy agent|stimulant/i, sideEffects: "Insomnia, appetite suppression, increased heart rate/BP, anxiety, and misuse potential.", monitoring: "Blood pressure, heart rate, appetite/weight, sleep, and misuse/diversion risk." },
  { pattern: /alpha-1 adrenergic antagonist/i, sideEffects: "Orthostatic hypotension, dizziness, fatigue, headache, and ejaculatory dysfunction (agent-dependent).", monitoring: "Blood pressure (especially standing), dizziness/fall risk, and urinary symptom response." },
  { pattern: /antimuscarinic/i, sideEffects: "Dry mouth, constipation, blurred vision, urinary retention, and cognitive effects in susceptible patients.", monitoring: "Urinary or symptom response, bowel function, anticholinergic burden, and cognitive adverse effects." },
  { pattern: /glucocorticoid/i, sideEffects: "Hyperglycemia, fluid retention, mood effects, insomnia, infection risk, and bone loss with prolonged use.", monitoring: "Clinical response, glucose, blood pressure, infection signs, and cumulative steroid exposure." },
  { pattern: /antimicrobial|antibiotic|antiviral|antifungal/i, sideEffects: "GI upset, rash, candidiasis, and C. difficile risk (antibacterials); class-specific toxicity varies.", monitoring: "Clinical response, adverse effects, allergy signs, and renal/hepatic dosing needs." },
  { pattern: /opioid analgesic/i, sideEffects: "Constipation, sedation, nausea, respiratory depression, and dependence risk.", monitoring: "Pain/function response, sedation, respiratory status, bowel regimen effectiveness, and misuse risk." },
  { pattern: /skeletal muscle relaxant/i, sideEffects: "Sedation, dizziness, dry mouth, and cognitive slowing.", monitoring: "Sedation/fall risk, symptom relief, and concurrent CNS depressant exposure." },
  { pattern: /beta-2 adrenergic agonist bronchodilator/i, sideEffects: "Tremor, palpitations, tachycardia, and hypokalemia at high doses.", monitoring: "Rescue inhaler use, symptom control, heart rate, and adverse effects." },
  { pattern: /leukotriene receptor antagonist/i, sideEffects: "Headache, abdominal pain, and rare neuropsychiatric effects.", monitoring: "Asthma/allergy symptom control and mood or sleep changes." },
  { pattern: /histamine h1 receptor antagonist/i, sideEffects: "Somnolence, dry mouth, dizziness, and anticholinergic effects (agent-dependent).", monitoring: "Sedation burden, anticholinergic effects, and symptom response." },
  { pattern: /5ht-3|5-ht3|sari|serotonin antagonist/i, sideEffects: "Dizziness, somnolence, orthostasis, dry mouth, and QT risk (agent-dependent).", monitoring: "Mood/sleep response, sedation, blood pressure, and QT risk when indicated." },
  { pattern: /bone surface interaction|bisphosphonate/i, sideEffects: "Esophagitis/GI irritation (oral), musculoskeletal pain, hypocalcemia, and rare osteonecrosis of the jaw.", monitoring: "Bone density trends, calcium/vitamin D, renal function, and administration adherence." },
  { pattern: /electrolyte activity|supplement/i, sideEffects: "GI upset, nausea, and electrolyte disturbances with over-replacement.", monitoring: "Serum electrolytes and clinical response to repletion." },
  { pattern: /alpha2-agonist/i, sideEffects: "Sedation, dry mouth, constipation, dizziness, and hypotension; rebound hypertension if abruptly stopped.", monitoring: "Blood pressure, heart rate, sedation, and withdrawal/rebound risk." },
  { pattern: /peroxisome proliferator-activated receptor alpha agonist|fibrate/i, sideEffects: "Dyspepsia, elevated transaminases, gallstone risk, and myopathy risk (higher with statin combinations).", monitoring: "Triglyceride response, liver enzymes, muscle symptoms, and renal function." },
  { pattern: /phosphodiesterase 5 inhibitor/i, sideEffects: "Headache, flushing, dyspepsia, nasal congestion, and hypotension risk with nitrates.", monitoring: "Erectile function response, blood pressure symptoms, and nitrate interaction avoidance." },
  { pattern: /estrogen receptor agonist|birth control/i, sideEffects: "Nausea, breast tenderness, headache, breakthrough bleeding, and venous thromboembolism risk.", monitoring: "Blood pressure, thromboembolic symptoms, adherence, and bleeding pattern." },
  { pattern: /xanthine oxidase inhibitor/i, sideEffects: "Rash, GI upset, hepatotoxicity, and rare severe hypersensitivity reactions.", monitoring: "Serum uric acid, liver function, renal function, and rash/hypersensitivity signs." },
  { pattern: /sulfonylurea/i, sideEffects: "Hypoglycemia and weight gain.", monitoring: "Glucose trends/A1C, hypoglycemia episodes, and renal function for dose safety." },
  { pattern: /nitric oxide donor/i, sideEffects: "Headache, flushing, dizziness, and hypotension.", monitoring: "Angina symptom relief, blood pressure, and nitrate-free interval adherence." },
  { pattern: /cardiac glycoside/i, sideEffects: "Nausea, anorexia, visual disturbances, arrhythmias, and digoxin toxicity risk.", monitoring: "Heart rate/rhythm, renal function, electrolytes (K/Mg), and serum digoxin when indicated." },
  { pattern: /cholinesterase inhibitor/i, sideEffects: "Nausea, diarrhea, bradycardia, anorexia, weight loss, and sleep disturbance.", monitoring: "Cognitive/functional response, heart rate, weight, and GI tolerability." },
  { pattern: /mineralocorticoid receptor antagonist/i, sideEffects: "Hyperkalemia, gynecomastia (spironolactone), dizziness, and renal function decline.", monitoring: "Blood pressure, potassium, renal function, and endocrine adverse effects." },
  { pattern: /dopamine agonist/i, sideEffects: "Nausea, orthostasis, somnolence, edema, impulse-control symptoms, and hallucinations (susceptible patients).", monitoring: "Symptom response, blood pressure, daytime sleepiness, behavioral changes, and neuropsychiatric effects." },
  { pattern: /dopamine antagonist/i, sideEffects: "Akathisia/extrapyramidal symptoms, sedation, hyperprolactinemia, and QT risk (agent-dependent).", monitoring: "Symptom response, movement adverse effects, sedation, and QT risk when indicated." },
  { pattern: /serotonin agonist/i, sideEffects: "Dizziness, paresthesia, fatigue, nausea, and vasoconstrictive effects (triptans).", monitoring: "Symptom relief, recurrence frequency, and signs of serotonergic/vasoconstrictive adverse effects." },
  { pattern: /prostaglandin receptor agonist/i, sideEffects: "Conjunctival hyperemia, eyelash changes, iris pigmentation changes, and ocular irritation.", monitoring: "Intraocular pressure response and ocular tolerability." },
  { pattern: /beta3-agonist/i, sideEffects: "Hypertension, tachycardia, headache, and urinary retention risk.", monitoring: "Blood pressure, heart rate, urinary symptoms, and treatment response." },
  { pattern: /osmotic activity|osmotic laxative/i, sideEffects: "Bloating, cramping, diarrhea, and dehydration/electrolyte imbalance with overuse.", monitoring: "Bowel response, hydration status, and electrolyte concerns in high-risk patients." },
  { pattern: /selective estrogen receptor modulator/i, sideEffects: "Hot flashes, leg cramps, and venous thromboembolism risk.", monitoring: "VTE symptoms, menopausal symptom burden, and bone-related outcomes as indicated." },
  { pattern: /nmda receptor antagonist/i, sideEffects: "Dizziness, headache, confusion, and constipation.", monitoring: "Cognitive/functional trajectory and neuropsychiatric tolerability." },
  { pattern: /partial cholinergic nicotinic agonist/i, sideEffects: "Nausea, insomnia, abnormal dreams, headache, and neuropsychiatric adverse effects.", monitoring: "Smoking cessation progress, mood/behavior changes, and sleep disturbance." },
  { pattern: /biological response modifier/i, sideEffects: "Injection-site reactions, serious infection risk, cytopenias, and immune-mediated adverse effects.", monitoring: "Infection screening/monitoring, CBC/LFT trends, and treatment response by indication." },
  { pattern: /tnf[-\s]*alpha inhibitor biologic/i, sideEffects: "Injection-site reactions, infection risk (including serious opportunistic infection), headache, and rash.", monitoring: "Baseline/periodic TB and hepatitis screening, CBC/LFT trends, infection symptoms, and disease activity response." },
  { pattern: /inhaled corticosteroid\/long[-\s]*acting beta[-\s]*2 agonist combination|ics\/laba/i, sideEffects: "Oral candidiasis, dysphonia, tremor, palpitations, and rare paradoxical bronchospasm.", monitoring: "Symptom control, rescue inhaler use, exacerbation frequency, inhaler technique, and oral thrush prevention." },
  { pattern: /alpha[-\s]*2 adrenergic agonist/i, sideEffects: "Sedation, dizziness, dry mouth, constipation, hypotension, and rebound hypertension if abruptly stopped.", monitoring: "Blood pressure, heart rate, sedation burden, withdrawal/rebound symptoms, and clinical response." },
  { pattern: /phosphodiesterase[-\s]*5 inhibitor/i, sideEffects: "Headache, flushing, dyspepsia, nasal congestion, visual changes, and hypotension risk.", monitoring: "Clinical response, blood pressure symptoms, vision changes, and strict avoidance of nitrate coadministration." },
  { pattern: /combined hormonal contraceptive|estrogen\/progestin/i, sideEffects: "Nausea, breast tenderness, headache, breakthrough bleeding, and venous thromboembolism risk.", monitoring: "Blood pressure, bleeding pattern, adherence, migraine/VTE symptoms, and contraindication review over time." },
  { pattern: /organic nitrate antianginal|nitric oxide donor/i, sideEffects: "Headache, dizziness, flushing, hypotension, and reflex tachycardia.", monitoring: "Angina frequency, blood pressure, orthostatic symptoms, and adherence to nitrate-free interval strategy." },
  { pattern: /norepinephrine reuptake inhibitor/i, sideEffects: "Insomnia, dry mouth, constipation, palpitations, anxiety, and blood pressure elevation.", monitoring: "Blood pressure, heart rate, appetite/weight changes, mood symptoms, and misuse risk when relevant." },
  { pattern: /dopamine d2 receptor antagonist prokinetic\/antiemetic/i, sideEffects: "Akathisia, dystonia, sedation, diarrhea, and tardive dyskinesia risk with chronic exposure.", monitoring: "GI symptom response, extrapyramidal symptoms, sedation, and duration limits for long-term use." },
  { pattern: /anxiolytic \(5[-\s]*ht1a partial agonist\)|buspirone/i, sideEffects: "Dizziness, nausea, headache, nervousness, and restlessness.", monitoring: "Anxiety symptom response, dizziness/sedation, adherence, and interaction risk with serotonergic agents." },
  { pattern: /noradrenergic and specific serotonergic antidepressant|nassa|mirtazapine/i, sideEffects: "Sedation, increased appetite, weight gain, dry mouth, and constipation.", monitoring: "Mood/sleep response, weight trajectory, daytime sedation, and metabolic effects over time." },
  { pattern: /prostaglandin analog ophthalmic/i, sideEffects: "Conjunctival hyperemia, eyelash growth, iris/periorbital pigmentation change, and ocular irritation.", monitoring: "Intraocular pressure response, ocular tolerability, and adherence to nightly administration." },
  { pattern: /beta[-\s]*3 adrenergic agonist \(overactive bladder\)|mirabegron/i, sideEffects: "Hypertension, tachycardia, headache, and urinary retention risk.", monitoring: "Blood pressure, heart rate, urinary symptom control, and post-void symptoms in high-risk patients." },
  { pattern: /triptan antimigraine|5[-\s]*ht1b\/1d agonist|sumatriptan/i, sideEffects: "Paresthesia, dizziness, fatigue, chest pressure sensations, and nausea.", monitoring: "Headache response, recurrence frequency, cardiovascular warning symptoms, and serotonin syndrome risk with combinations." },
  { pattern: /partial nicotinic receptor agonist|smoking cessation|varenicline/i, sideEffects: "Nausea, insomnia, abnormal dreams, headache, and potential mood changes.", monitoring: "Quit-progress milestones, neuropsychiatric symptoms, sleep quality, and adherence." },
  { pattern: /antimalarial\/dmard|hydroxychloroquine/i, sideEffects: "GI upset, rash, retinal toxicity risk (long-term), hypoglycemia, and QT prolongation risk.", monitoring: "Baseline/periodic ophthalmologic exams, CBC/LFT trends, glucose symptoms, and QT-risk co-medications." },
  { pattern: /gaba b agonist/i, sideEffects: "Sedation, dizziness, weakness, and withdrawal risk if abruptly discontinued.", monitoring: "Spasticity response, sedation/fall risk, renal function for dosing, and withdrawal prevention." },
  { pattern: /urinary tract analgesic/i, sideEffects: "Urine discoloration, GI upset, headache, and rare hemolysis/methemoglobinemia risk.", monitoring: "Symptom relief, treatment duration, renal function context, and toxicity symptoms." },
  { pattern: /expectorant/i, sideEffects: "Nausea, vomiting, dizziness, and GI discomfort.", monitoring: "Cough/sputum response and hydration status." },
  { pattern: /histamine-2 receptor antagonist/i, sideEffects: "Headache, dizziness, constipation or diarrhea, and rare CNS effects in renal impairment.", monitoring: "Symptom control and renal function-guided dosing in high-risk patients." },
  { pattern: /5-alpha reductase inhibitor/i, sideEffects: "Decreased libido, erectile dysfunction, ejaculatory dysfunction, and gynecomastia.", monitoring: "Urinary symptom response, PSA interpretation trends, and sexual adverse effects." },
  { pattern: /direct-acting vasodilator/i, sideEffects: "Headache, tachycardia, edema, flushing, and lupus-like syndrome risk (agent-dependent).", monitoring: "Blood pressure response, heart rate, edema, and autoimmune symptom surveillance." },
  { pattern: /thymidylate synthetase inhibitor|antimetabolite/i, sideEffects: "Myelosuppression, mucositis, hepatotoxicity, GI upset, and teratogenicity risk.", monitoring: "CBC, liver function, renal function, infection signs, and folate rescue strategy when indicated." },
];

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

function canonicalizeSafety(classText: string, sideEffects: string, monitoring: string) {
  const hit = CLASS_SAFETY_DEFAULTS.find((item) => item.pattern.test(classText));
  if (!hit) {
    return {
      sideEffects:
        !sideEffects || isPlaceholder(sideEffects) || isGenericSafety(sideEffects)
          ? `${classText} therapy has class-specific adverse effects; counsel on common and severe reactions relevant to this medication.`
          : sideEffects,
      monitoring:
        !monitoring || isPlaceholder(monitoring) || isGenericSafety(monitoring) || isNoisyMonitoring(monitoring)
          ? `Monitor clinical response and key safety parameters appropriate for ${classText.toLowerCase()} therapy.`
          : monitoring,
    };
  }
  return {
    sideEffects: !sideEffects || isPlaceholder(sideEffects) || isGenericSafety(sideEffects) ? hit.sideEffects : sideEffects,
    monitoring:
      !monitoring ||
      isPlaceholder(monitoring) ||
      isGenericSafety(monitoring) ||
      isNoisyMonitoring(monitoring)
        ? hit.monitoring
        : monitoring,
  };
}

const CONTENT_OVERRIDES: Record<
  string,
  Partial<
    Pick<
      MedicationRecord,
      "name" | "class" | "mechanism" | "summary" | "dose" | "renal" | "sideEffects" | "monitoring" | "pearls" | "tags" | "keywords"
    >
  >
> = {
  digoxin: {
    summary:
      "Used for symptomatic HFrEF and ventricular rate control in atrial fibrillation when additional control is needed.",
    dose:
      "Typical maintenance is 0.125-0.25 mg PO daily; use lower doses in older adults, low body weight, and reduced renal function.",
  },
  "fentanyl-transdermal-patch": {
    summary:
      "Long-acting opioid patch for severe chronic pain in opioid-tolerant patients who require around-the-clock analgesia.",
    dose:
      "Apply one patch every 72 hours; convert from prior opioid regimen and titrate cautiously based on pain control and sedation.",
  },
  finasteride: {
    summary:
      "5-alpha reductase inhibitor used for benign prostatic hyperplasia and androgenetic alopecia depending on product strength.",
  },
  "hydrochlorothiazide-hctz": {
    summary:
      "Thiazide diuretic for hypertension and edema management, often used in combination antihypertensive regimens.",
    dose: "Common dosing is 12.5-25 mg PO daily for hypertension; higher doses may be used short-term for edema.",
  },
  levofloxacin: {
    summary:
      "Fluoroquinolone antibiotic for selected respiratory, urinary, skin, and systemic bacterial infections when susceptibility supports use.",
    dose:
      "Typical adult dosing is 500-750 mg PO/IV once daily with regimen and duration based on infection site and renal function.",
  },
  methimazole: {
    class: "Thioamide antithyroid agent",
    mechanism:
      "Inhibits thyroid peroxidase, reducing synthesis of thyroxine (T4) and triiodothyronine (T3).",
    summary:
      "First-line oral therapy for hyperthyroidism (including Graves disease) and for preoperative or pre-radioiodine control.",
    dose:
      "Initial dosing is commonly 5-30 mg PO daily based on severity, then tapered to maintenance guided by thyroid function tests.",
  },
  nitrofurantoin: {
    summary:
      "Urinary antiseptic antibiotic for uncomplicated lower urinary tract infections caused by susceptible organisms.",
    dose:
      "Macrocrystals/monohydrate: 100 mg PO twice daily for 5 days (acute cystitis); avoid for pyelonephritis.",
  },
  quetiapine: {
    summary:
      "Atypical antipsychotic used for schizophrenia, bipolar disorder, and adjunctive treatment of major depressive disorder.",
    dose:
      "Dose is indication-specific and titrated gradually; common total daily range is 150-800 mg in divided or extended-release regimens.",
  },
  rivaroxaban: {
    dose:
      "AF stroke prevention: 20 mg once daily with evening meal (15 mg daily if CrCl 15-50). VTE treatment: 15 mg twice daily for 21 days, then 20 mg daily with food.",
  },
  guaifenesin: {
    class: "Expectorant",
    summary:
      "Expectorant used to thin and loosen respiratory mucus to improve secretion clearance in acute cough/chest congestion.",
    dose:
      "Immediate-release adults: 200-400 mg every 4 hours as needed (max 2,400 mg/day). Extended-release: 600-1,200 mg every 12 hours.",
  },
  adalimumab: {
    name: "Adalimumab (Humira)",
    summary:
      "TNF-alpha inhibitor used for rheumatoid arthritis, psoriatic arthritis, ankylosing spondylitis, Crohn disease, ulcerative colitis, plaque psoriasis, hidradenitis suppurativa, and selected uveitis indications.",
    dose:
      "Most adult indications: 40 mg subcutaneously every other week after loading per indication; some patients may require weekly dosing based on response and regimen.",
    renal:
      "No clinically meaningful renal dose adjustment is defined; monitor infection risk and overall tolerability based on comorbidity burden.",
    pearls: [
      "Screen for latent tuberculosis and hepatitis B before starting therapy and monitor for serious infection during treatment.",
      "Avoid live vaccines while on treatment; coordinate vaccine updates before initiation when feasible.",
      "Hold during serious active infection and reassess risk-benefit before restarting.",
    ],
    tags: ["Immunology", "Rheumatology", "Gastroenterology", "Dermatology"],
    keywords: ["adalimumab", "humira", "idacio", "tnf inhibitor", "biologic"],
  },
  moxifloxacin: {
    dose:
      "Typical adult dosing is 400 mg PO/IV once daily. Duration depends on infection source and severity (commonly 5-14 days).",
  },
};

function normalizeMedicationRecord(record: MedicationRecord): MedicationRecord {
  const fb = inferFallback(record);

  const normalizedClass = takeSentences(record.class, 1);
  const normalizedClassLabel = normalizedClass.replace(/[.]+$/g, "").trim();
  const normalizedMoa = takeSentences(record.mechanism ?? "", 2);
  const normalizedSummary = takeSentences(record.summary, 3);
  const normalizedDose = takeSentences(record.dose, 3);
  const normalizedRenal = takeSentences(record.renal, 2);
  const normalizedSideEffects = takeSentences(record.sideEffects ?? "", 2);
  const normalizedMonitoring = takeSentences(record.monitoring, 2);

  const pearls = (record.pearls ?? [])
    .map((p) => takeSentences(p, 1))
    .filter((p) => p && !isPlaceholder(p))
    .slice(0, 3);

  const initialClass =
    normalizedClassLabel && !isPlaceholder(normalizedClassLabel) && !isWeakClass(normalizedClassLabel)
      ? normalizedClassLabel
      : fb.className;
  const initialMoa = normalizedMoa && !isPlaceholder(normalizedMoa) ? normalizedMoa : fb.moa;
  const canonical = canonicalizeClassMoa(record, initialClass, initialMoa);
  const initialSideEffects =
    normalizedSideEffects && !isPlaceholder(normalizedSideEffects)
      ? normalizedSideEffects
      : fb.sideEffects;
  const initialMonitoring =
    normalizedMonitoring && !isPlaceholder(normalizedMonitoring)
      ? normalizedMonitoring
      : fb.monitoring;
  const override = CONTENT_OVERRIDES[record.slug];
  const effectiveClass = override?.class ?? canonical.classText;
  const canonicalSafety = canonicalizeSafety(effectiveClass, initialSideEffects, initialMonitoring);
  const summaryFallback =
    normalizedSummary && !isPlaceholder(normalizedSummary)
      ? normalizedSummary
      : `${record.name} is used for indication-specific therapy based on diagnosis and patient factors.`;
  const doseFallback =
    normalizedDose && !isPlaceholder(normalizedDose)
      ? normalizedDose
      : "Use indication-specific labeled dosing and adjust for renal/hepatic function and tolerability.";
  const renalFallback =
    normalizedRenal && !isPlaceholder(normalizedRenal)
      ? normalizedRenal
      : "No specific renal dose adjustment is clearly defined in standard labeling; individualize based on renal function and clinical context.";
  const sanitizeToken = (value: string) =>
    value
      .replace(/[()]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/^[\s,;.-]+|[\s,;.-]+$/g, "")
      .trim();
  const normalizedTags = Array.from(
    new Set(
      (override?.tags ?? record.tags ?? [])
        .map((tag) => sanitizeToken(tag))
        .filter((tag) => tag.length > 2 && !/^and$/i.test(tag)),
    ),
  );
  const normalizedKeywords = Array.from(
    new Set(
      (override?.keywords ?? record.keywords ?? [])
        .map((keyword) => sanitizeToken(keyword.toLowerCase()))
        .filter((keyword) => keyword.length > 1 && !/^and$/i.test(keyword)),
    ),
  );

  return {
    ...record,
    name: override?.name ?? record.name,
    class: effectiveClass,
    mechanism: override?.mechanism ?? canonical.moaText,
    summary: override?.summary ?? summaryFallback,
    dose: override?.dose ?? doseFallback,
    renal: override?.renal ?? renalFallback,
    sideEffects: override?.sideEffects ?? canonicalSafety.sideEffects,
    monitoring: override?.monitoring ?? canonicalSafety.monitoring,
    pearls: override?.pearls ?? pearls,
    tags: normalizedTags,
    keywords: normalizedKeywords,
  };
}

export const medicationDataset: MedicationRecord[] = Array.from(mergedBySlug.values()).map(
  normalizeMedicationRecord,
);

export const medicationDatasetVersion = "2026-03-09-harness-v3";

export const medicationTags = Array.from(
  new Set(medicationDataset.flatMap((item) => item.tags))
).sort();
