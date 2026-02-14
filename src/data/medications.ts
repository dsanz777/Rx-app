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

export const medicationDataset: MedicationRecord[] = [
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
    keywords: ["tirzepatide", "mounjaro", "zepbound", "dual incretin"],
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

export const medicationTags = Array.from(
  new Set(medicationDataset.flatMap((item) => item.tags))
).sort();
