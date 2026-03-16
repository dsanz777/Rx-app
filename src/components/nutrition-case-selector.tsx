"use client";

import { useMemo, useState } from "react";

type NutritionCase = {
  key: string;
  label: string;
  who: string;
  targets: string[];
  actions: string[];
  monitoring: string[];
  references: string[];
};

const nutritionCases: NutritionCase[] = [
  {
    key: "t2dm-obesity",
    label: "Type 2 diabetes + obesity",
    who: "Adults with T2D and excess adiposity where glycemic control and weight reduction are dual goals.",
    targets: [
      "Carbohydrate pattern focused on quality and consistency (individualized, not one-size-fits-all).",
      "Higher satiety meal structure (protein + fiber first) to reduce caloric drift.",
      "Cardiometabolic risk reduction through sustainable eating pattern + activity pairing.",
    ],
    actions: [
      "Use plate model: non-starchy vegetables + lean protein anchor, then high-fiber carbs.",
      "Default to water/zero-calorie beverages; avoid routine sugar-sweetened drinks.",
      "Use one behavioral target every 2 weeks (e.g., late-night eating reduction).",
    ],
    monitoring: [
      "Weight trend, A1c/CGM pattern (if available), blood pressure, adherence barriers.",
      "Escalate if persistent hyperglycemia, progressive weight gain, or low satiety despite adherence.",
    ],
    references: [
      "ADA Standards of Care (current edition): nutrition therapy + weight management in diabetes.",
      "AACE/ACE obesity guidance: chronic disease framework for obesity treatment.",
    ],
  },
  {
    key: "ckd",
    label: "CKD (non-dialysis, stage-aware)",
    who: "Adults with CKD where sodium, protein quality/amount, and electrolyte awareness are central.",
    targets: [
      "Stage-specific nutrition aligned to labs, comorbidities, and nephrology plan.",
      "Sodium moderation and additive awareness from processed foods/OTCs.",
      "Protein strategy individualized to CKD stage and nutrition status.",
    ],
    actions: [
      "Review potassium/phosphorus risks using recent labs and med profile.",
      "Prioritize minimally processed foods to reduce hidden sodium/phosphate additives.",
      "Coordinate education with nephrology and pharmacy med optimization.",
    ],
    monitoring: [
      "Trend eGFR, potassium, bicarbonate, phosphate, edema, appetite, and unintentional weight loss.",
      "Escalate for hyperkalemia risk patterns, protein-energy wasting concerns, or rapid renal decline.",
    ],
    references: [
      "KDIGO CKD guideline (current edition): nutrition context by CKD stage and risk.",
      "NKF/KDOQI guidance: practical CKD nutrition implementation.",
    ],
  },
  {
    key: "hf-htn",
    label: "Heart failure + hypertension",
    who: "Patients with congestion/volume sensitivity where sodium pattern and daily self-monitoring matter.",
    targets: [
      "Avoid excessive sodium intake and support fluid/volume stability.",
      "Consistent home routine for symptom and weight surveillance.",
      "Nutrition pattern that supports BP and HF medication strategy.",
    ],
    actions: [
      "Shift to low-sodium proteins, no-salt-added staples, and label-first shopping.",
      "Build a repeatable meal pattern to reduce sodium variability day to day.",
      "Pair nutrition coaching with medication adherence and symptom action plan.",
    ],
    monitoring: [
      "Daily weights, edema, dyspnea, BP trend, and recent sodium exposure history.",
      "Escalate if rapid weight gain, worsening edema, or recurrent decompensation signs.",
    ],
    references: [
      "ACC/AHA/HFSA heart failure guideline: avoid excessive sodium intake in stage C HF.",
      "ACC/AHA hypertension guidance: dietary pattern + sodium reduction for BP control.",
    ],
  },
  {
    key: "frailty-sarcopenia",
    label: "Frailty / sarcopenia risk",
    who: "Older adults or deconditioned patients with muscle loss risk, low intake, or functional decline.",
    targets: [
      "Protein adequacy distributed across meals.",
      "Energy sufficiency to prevent further unintentional loss.",
      "Function-preserving plan tied to resistance/activity tolerance.",
    ],
    actions: [
      "Use protein-first meal planning with easy-prep high-protein options.",
      "Add oral nutrition support when food-first intake is inadequate.",
      "Coordinate PT/exercise progression with nutrition timing where feasible.",
    ],
    monitoring: [
      "Track weight trajectory, appetite, grip/functional status proxies, and intake barriers.",
      "Escalate when ongoing weight loss, poor intake, or recurrent falls are present.",
    ],
    references: [
      "Academy of Nutrition and Dietetics malnutrition/frailty-focused guidance.",
      "ASPEN consensus guidance for nutrition risk and intervention intensity.",
    ],
  },
  {
    key: "malnutrition-enteral-parenteral",
    label: "Malnutrition risk / enteral-parenteral escalation",
    who: "Patients with poor oral intake, catabolic illness, or inability to meet needs orally.",
    targets: [
      "Early identification of nutrition risk and timely intervention tiering.",
      "Preserve lean mass and reduce complications from prolonged underfeeding.",
      "Appropriate escalation path: oral → enteral → parenteral when indicated.",
    ],
    actions: [
      "Screen risk early, then implement structured calorie/protein plan.",
      "Use enteral route when GI tract is functional and oral intake is insufficient.",
      "Reserve parenteral strategy for cases where enteral route is not feasible/adequate.",
    ],
    monitoring: [
      "Intake adequacy, weight trend, tolerance, fluid status, and metabolic complications.",
      "Escalate if persistent deficit, intolerance, or high-risk catabolic state.",
    ],
    references: [
      "ASPEN clinical guidance for adult nutrition support.",
      "Academy/ASPEN malnutrition consensus characteristics and workflow integration.",
    ],
  },
];

export function NutritionCaseSelector() {
  const [selectedKey, setSelectedKey] = useState(nutritionCases[0]?.key ?? "");

  const selectedCase = useMemo(
    () => nutritionCases.find((item) => item.key === selectedKey) ?? nutritionCases[0],
    [selectedKey],
  );

  if (!selectedCase) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <p className="text-xs uppercase tracking-[0.35em] text-white/45">Nutritional case selector</p>
      <div className="mt-3">
        <select
          value={selectedKey}
          onChange={(event) => setSelectedKey(event.target.value)}
          className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-[var(--accent)] focus:outline-none"
        >
          {nutritionCases.map((item) => (
            <option key={item.key} value={item.key} className="text-black">
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-sm text-white/75">{selectedCase.who}</p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/45">Core targets</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
            {selectedCase.targets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/45">Implementation moves</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
            {selectedCase.actions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-[0.25em] text-white/45">Monitoring + escalation</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
          {selectedCase.monitoring.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3">
        <p className="text-xs uppercase tracking-[0.25em] text-white/45">Guideline anchors</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/75">
          {selectedCase.references.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
