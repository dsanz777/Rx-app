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

type RxClassInfo = {
  rxclassMinConceptItem?: { className?: string };
  rela?: string;
  relaSource?: string;
};

const DATA_PATH = path.join(process.cwd(), "src/data/medications.generated.json");
const SLEEP_MS = 60;
const BAD_MOA = [/unknown cellular or molecular interaction/i, /^unknown/i];

const MOA_TO_CLASS: Array<{ pattern: RegExp; className: string; moa: string }> = [
  { pattern: /proton pump inhibitors/i, className: "Proton pump inhibitor", moa: "Irreversibly inhibits the gastric H+/K+ ATPase (proton pump) in parietal cells, suppressing gastric acid secretion." },
  { pattern: /hydroxymethylglutaryl-coa reductase inhibitors/i, className: "HMG-CoA reductase inhibitor (statin)", moa: "Inhibits HMG-CoA reductase, reducing hepatic cholesterol synthesis and increasing LDL receptor expression." },
  { pattern: /adrenergic beta2-agonists/i, className: "Beta-2 adrenergic agonist bronchodilator", moa: "Stimulates beta-2 adrenergic receptors in bronchial smooth muscle, increasing cAMP and causing bronchodilation." },
  { pattern: /adrenergic alpha1-antagonists/i, className: "Alpha-1 adrenergic antagonist", moa: "Blocks alpha-1 adrenergic receptors, relaxing smooth muscle in the prostate/bladder neck and reducing peripheral vascular tone." },
  { pattern: /serotonin uptake inhibitors/i, className: "Serotonin reuptake inhibitor", moa: "Inhibits presynaptic serotonin reuptake, increasing serotonergic neurotransmission." },
  { pattern: /norepinephrine uptake inhibitors/i, className: "Norepinephrine reuptake inhibitor", moa: "Inhibits presynaptic norepinephrine reuptake, increasing noradrenergic neurotransmission." },
  { pattern: /sodium channel antagonists|sodium channel interactions/i, className: "Sodium channel-modulating anticonvulsant", moa: "Modulates voltage-gated sodium channels to reduce high-frequency neuronal firing." },
  { pattern: /gaba a agonists|gaba a modulators/i, className: "GABA-A receptor positive modulator hypnotic", moa: "Enhances GABA-A receptor signaling to promote sedation and sleep initiation." },
  { pattern: /angiotensin converting enzyme inhibitors/i, className: "ACE inhibitor", moa: "Inhibits angiotensin-converting enzyme, reducing angiotensin II and aldosterone while increasing bradykinin." },
  { pattern: /angiotensin ii receptor antagonists|angiotensin ii receptor blockers/i, className: "Angiotensin II receptor blocker (ARB)", moa: "Blocks angiotensin II at AT1 receptors, reducing vasoconstriction and aldosterone signaling." },
  { pattern: /calcium channel antagonists|l-calcium channel receptor antagonists/i, className: "Calcium channel blocker", moa: "Blocks L-type calcium channels in vascular smooth muscle and/or myocardium, lowering vascular resistance and/or cardiac conduction." },
  { pattern: /cyclooxygenase inhibitors/i, className: "Nonsteroidal anti-inflammatory drug (NSAID)", moa: "Inhibits cyclooxygenase enzymes to reduce prostaglandin-mediated inflammation and pain." },
  { pattern: /glucocorticoid receptor agonists/i, className: "Glucocorticoid corticosteroid", moa: "Activates glucocorticoid receptors, altering transcription of pro-inflammatory genes and reducing inflammation." },
  { pattern: /histamine h1 antagonists/i, className: "H1 antihistamine", moa: "Blocks peripheral and/or central histamine H1 receptors to reduce allergic symptoms or nausea/vertigo." },
  { pattern: /serotonin 5-ht3 receptor antagonists/i, className: "5-HT3 receptor antagonist antiemetic", moa: "Blocks serotonin 5-HT3 receptors in the gut and chemoreceptor trigger zone to reduce nausea and vomiting." },
  { pattern: /dopamine d2 receptor antagonists/i, className: "D2 receptor antagonist", moa: "Antagonizes dopamine D2 receptors, reducing psychotic symptoms and/or emetic signaling depending on agent and dose." },
  { pattern: /dopamine receptor agonists/i, className: "Dopamine receptor agonist", moa: "Stimulates dopamine receptors to improve motor symptoms or restless legs symptoms." },
  { pattern: /monoamine oxidase inhibitors/i, className: "Monoamine oxidase inhibitor", moa: "Inhibits monoamine oxidase enzymes, increasing synaptic monoamines." },
  { pattern: /xanthine oxidase inhibitors/i, className: "Xanthine oxidase inhibitor", moa: "Inhibits xanthine oxidase, reducing uric acid production." },
  { pattern: /dihydrofolate reductase inhibitors/i, className: "Folate-pathway inhibitor", moa: "Inhibits folate-pathway enzymes involved in nucleotide synthesis." },
  { pattern: /adenosine triphosphate-sensitive potassium channel blockers/i, className: "Sulfonylurea insulin secretagogue", moa: "Closes pancreatic beta-cell ATP-sensitive potassium channels, promoting insulin release." },
  { pattern: /sodium-glucose cotransporter 2 inhibitors/i, className: "SGLT2 inhibitor", moa: "Inhibits renal SGLT2 transporters, increasing urinary glucose and sodium excretion." },
  { pattern: /glucagon-like peptide-1 receptor agonists/i, className: "GLP-1 receptor agonist", moa: "Activates GLP-1 receptors to enhance glucose-dependent insulin secretion, suppress glucagon, and delay gastric emptying." },
  { pattern: /muscarinic antagonists/i, className: "Antimuscarinic agent", moa: "Antagonizes muscarinic receptors to reduce smooth muscle spasm and/or glandular secretion depending on site of action." },
  { pattern: /phosphodiesterase type 5 inhibitors/i, className: "Phosphodiesterase-5 inhibitor", moa: "Inhibits phosphodiesterase-5, increasing cGMP and enhancing nitric oxide-mediated smooth muscle relaxation." },
  { pattern: /opioid receptor agonists/i, className: "Opioid analgesic", moa: "Agonizes opioid receptors to reduce nociceptive transmission and pain perception." },
  { pattern: /benzodiazepine receptor agonists|benzodiazepines/i, className: "Benzodiazepine", moa: "Positive allosteric modulator of GABA-A receptors that enhances inhibitory neurotransmission." },
  { pattern: /nucleoside analogs|dna polymerase inhibitors/i, className: "Antiviral nucleoside analog", moa: "Inhibits viral DNA polymerase after intracellular activation, limiting viral replication." },
  { pattern: /neuraminidase inhibitors/i, className: "Neuraminidase inhibitor antiviral", moa: "Inhibits influenza neuraminidase, reducing viral release from infected cells." },
];

const SLUG_OVERRIDES: Record<string, { className: string; moa: string }> = {
  zolpidem: {
    className: "Nonbenzodiazepine hypnotic (Z-drug)",
    moa: "Positive allosteric modulator of GABA-A receptors, preferentially at alpha-1 subunits, to promote sleep initiation.",
  },
  cyclobenzaprine: {
    className: "Centrally acting skeletal muscle relaxant",
    moa: "Acts centrally (TCA-like profile) to reduce tonic somatic motor activity and relieve acute muscle spasm.",
  },
  carisoprodol: {
    className: "Centrally acting skeletal muscle relaxant",
    moa: "Depresses polysynaptic neuronal transmission in the spinal cord and reticular formation to reduce acute musculoskeletal spasm symptoms.",
  },
  gabapentin: {
    className: "Gabapentinoid anticonvulsant",
    moa: "Binds the alpha-2-delta subunit of voltage-gated calcium channels, reducing excitatory neurotransmitter release.",
  },
  pregabalin: {
    className: "Gabapentinoid anticonvulsant",
    moa: "Binds the alpha-2-delta subunit of voltage-gated calcium channels, reducing excitatory neurotransmitter release.",
  },
  levetiracetam: {
    className: "Anticonvulsant (SV2A modulator)",
    moa: "Binds synaptic vesicle protein SV2A to modulate neurotransmitter release and reduce seizure propagation.",
  },
  metronidazole: {
    className: "Nitroimidazole antibacterial/antiprotozoal",
    moa: "Reduced intracellularly in anaerobes/protozoa to reactive intermediates that damage DNA and inhibit nucleic acid synthesis.",
  },
  hydralazine: {
    className: "Direct-acting vasodilator",
    moa: "Directly relaxes arteriolar smooth muscle, lowering systemic vascular resistance and blood pressure.",
  },
  phenazopyridine: {
    className: "Urinary tract analgesic",
    moa: "Exerts a local topical analgesic effect on urinary tract mucosa to reduce dysuria symptoms.",
  },
  "fentanyl-transdermal-patch": {
    className: "Opioid analgesic",
    moa: "Potent mu-opioid receptor agonist that inhibits ascending pain pathways and alters pain perception.",
  },
  "butalbital-apap-caffeine": {
    className: "Barbiturate-containing analgesic combination",
    moa: "Combination product with central sedation/analgesia plus adenosine antagonism from caffeine for tension-type headache symptom relief.",
  },
  guaifenesin: {
    className: "Expectorant",
    moa: "Increases respiratory tract fluid secretion and decreases mucus viscosity to facilitate expectoration.",
  },
  methimazole: {
    className: "Thioamide antithyroid agent",
    moa: "Inhibits thyroid peroxidase, reducing iodination and coupling steps in thyroid hormone synthesis.",
  },
  benzonatate: {
    className: "Peripherally acting antitussive",
    moa: "Anesthetizes stretch receptors in the respiratory passages, lungs, and pleura to suppress cough reflex.",
  },
  digoxin: {
    className: "Cardiac glycoside",
    moa: "Inhibits Na+/K+-ATPase, increasing intracellular calcium for positive inotropy and augmenting vagal tone at the AV node.",
  },
  triamterene: {
    className: "Potassium-sparing diuretic (ENaC blocker)",
    moa: "Blocks epithelial sodium channels in the distal nephron, reducing sodium reabsorption and potassium loss.",
  },
  "triamterene-hctz": {
    className: "Potassium-sparing/thiazide diuretic combination",
    moa: "Combines distal nephron ENaC blockade (triamterene) with thiazide sodium-chloride cotransporter inhibition.",
  },
  cephalexin: {
    className: "First-generation cephalosporin antibiotic",
    moa: "Beta-lactam antibiotic that inhibits bacterial cell wall synthesis by binding penicillin-binding proteins.",
  },
  amoxicillin: {
    className: "Aminopenicillin antibiotic",
    moa: "Beta-lactam antibiotic that inhibits bacterial cell wall synthesis by binding penicillin-binding proteins.",
  },
  "amoxicillin-clavulanate": {
    className: "Aminopenicillin/beta-lactamase inhibitor combination",
    moa: "Amoxicillin inhibits bacterial cell wall synthesis while clavulanate inhibits susceptible beta-lactamases.",
  },
  "sulfamethoxazole-trimethoprim": {
    className: "Folate-pathway inhibitor antibacterial combination",
    moa: "Sequential inhibition of bacterial folate synthesis (dihydropteroate synthase and dihydrofolate reductase).",
  },
  lisdexamfetamine: {
    className: "Amphetamine CNS stimulant",
    moa: "Prodrug of dextroamphetamine that increases synaptic norepinephrine and dopamine via transporter-mediated release.",
  },
  "amphetamine-dextroamphetamine": {
    className: "Amphetamine CNS stimulant",
    moa: "Promotes presynaptic norepinephrine and dopamine release and inhibits reuptake in the central nervous system.",
  },
  bupropion: {
    className: "Norepinephrine-dopamine reuptake inhibitor (NDRI)",
    moa: "Inhibits neuronal reuptake of norepinephrine and dopamine.",
  },
  duloxetine: {
    className: "Serotonin-norepinephrine reuptake inhibitor (SNRI)",
    moa: "Inhibits presynaptic serotonin and norepinephrine reuptake.",
  },
  venlafaxine: {
    className: "Serotonin-norepinephrine reuptake inhibitor (SNRI)",
    moa: "Inhibits presynaptic serotonin and norepinephrine reuptake.",
  },
  desvenlafaxine: {
    className: "Serotonin-norepinephrine reuptake inhibitor (SNRI)",
    moa: "Inhibits presynaptic serotonin and norepinephrine reuptake.",
  },
  atomoxetine: {
    className: "Selective norepinephrine reuptake inhibitor",
    moa: "Selectively inhibits the presynaptic norepinephrine transporter.",
  },
  tamsulosin: {
    className: "Alpha-1A adrenergic antagonist",
    moa: "Selectively blocks alpha-1A receptors in the prostate and bladder neck to improve urine flow.",
  },
  doxazosin: {
    className: "Alpha-1 adrenergic antagonist",
    moa: "Blocks peripheral alpha-1 adrenergic receptors, reducing vascular tone and improving lower urinary tract symptoms.",
  },
  terazosin: {
    className: "Alpha-1 adrenergic antagonist",
    moa: "Blocks peripheral alpha-1 adrenergic receptors, reducing vascular tone and improving lower urinary tract symptoms.",
  },
  quetiapine: {
    className: "Atypical antipsychotic",
    moa: "Antagonizes serotonin (5-HT2A) and dopamine (D2) receptors with additional histaminergic and adrenergic effects.",
  },
  risperidone: {
    className: "Atypical antipsychotic",
    moa: "Antagonizes dopamine D2 and serotonin 5-HT2 receptors.",
  },
  olanzapine: {
    className: "Atypical antipsychotic",
    moa: "Antagonizes dopamine D2 and serotonin 5-HT2A receptors with additional receptor activity.",
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractIngredients(name: string) {
  const generic = name.split("(")[0] ?? name;
  return generic
    .split("+")
    .map((v) => v.trim().toLowerCase())
    .map((v) => v.replace(/\bhctz\b/g, "hydrochlorothiazide"))
    .filter(Boolean);
}

async function fetchRxcui(term: string): Promise<string | null> {
  const url = `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(term)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = (await res.json()) as { idGroup?: { rxnormId?: string[] } };
  return json.idGroup?.rxnormId?.[0] ?? null;
}

async function fetchMoaTerms(rxcui: string): Promise<string[]> {
  const url = `https://rxnav.nlm.nih.gov/REST/rxclass/class/byRxcui.json?rxcui=${encodeURIComponent(rxcui)}&relaSource=MEDRT`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = (await res.json()) as { rxclassDrugInfoList?: { rxclassDrugInfo?: RxClassInfo[] } };
  const rows = json.rxclassDrugInfoList?.rxclassDrugInfo ?? [];

  const terms = rows
    .filter((row) => (row.rela ?? "").toLowerCase() === "has_moa")
    .map((row) => row.rxclassMinConceptItem?.className?.trim() ?? "")
    .filter(Boolean)
    .filter((term) => !BAD_MOA.some((pattern) => pattern.test(term)));

  return Array.from(new Set(terms));
}

function mapMoaToClassAndMechanism(moaTerms: string[]) {
  const mapped: Array<{ className: string; moa: string; rawMoa: string }> = [];

  for (const term of moaTerms) {
    const match = MOA_TO_CLASS.find((rule) => rule.pattern.test(term));
    if (match) {
      mapped.push({ className: match.className, moa: match.moa, rawMoa: term });
      continue;
    }

    mapped.push({
      className: term.replace(/s$/i, ""),
      moa: `Acts primarily via ${term.toLowerCase()}.`,
      rawMoa: term,
    });
  }

  return mapped;
}

function preferMapped(items: Array<{ className: string; moa: string; rawMoa: string }>) {
  if (items.length === 0) return null;

  const ranked = [...items].sort((a, b) => {
    const aScore = /unknown|inhibitors?$/i.test(a.rawMoa) ? 1 : 0;
    const bScore = /unknown|inhibitors?$/i.test(b.rawMoa) ? 1 : 0;
    return aScore - bScore;
  });

  return ranked[0];
}

async function main() {
  const source = fs.readFileSync(DATA_PATH, "utf8");
  const records = JSON.parse(source) as MedicationRecord[];

  const rxcuiCache = new Map<string, string | null>();
  const moaCache = new Map<string, string[]>();

  let updated = 0;
  for (const record of records) {
    if (SLUG_OVERRIDES[record.slug]) {
      record.class = SLUG_OVERRIDES[record.slug].className;
      record.mechanism = SLUG_OVERRIDES[record.slug].moa;
      updated += 1;
      continue;
    }

    const ingredients = extractIngredients(record.name);
    const resolved: Array<{ className: string; moa: string; rawMoa: string }> = [];

    for (const ingredient of ingredients) {
      if (!rxcuiCache.has(ingredient)) {
        rxcuiCache.set(ingredient, await fetchRxcui(ingredient));
        await delay(SLEEP_MS);
      }
      const rxcui = rxcuiCache.get(ingredient);
      if (!rxcui) continue;

      if (!moaCache.has(rxcui)) {
        moaCache.set(rxcui, await fetchMoaTerms(rxcui));
        await delay(SLEEP_MS);
      }

      const moaTerms = moaCache.get(rxcui) ?? [];
      resolved.push(...mapMoaToClassAndMechanism(moaTerms));
    }

    const pick = preferMapped(Array.from(new Map(resolved.map((r) => [`${r.className}|${r.moa}`, r])).values()));
    if (!pick) continue;

    const prevClass = record.class ?? "";
    const prevMoa = record.mechanism ?? "";
    const normalizedClass = pick.className
      .replace(/Angiotensin 2 Receptor Antagonist/i, "Angiotensin II receptor blocker (ARB)")
      .replace(/Angiotensin-converting Enzyme Inhibitor/i, "ACE inhibitor")
      .replace(/^Serotonin reuptake inhibitor$/i, "Selective serotonin reuptake inhibitor (SSRI)")
      .replace(/^Norepinephrine reuptake inhibitor$/i, "Norepinephrine reuptake inhibitor")
      .replace(/^Adrenergic alpha-Antagonist$/i, "Alpha-1 adrenergic antagonist")
      .replace(/^Insulin Receptor Agonist$/i, "Insulin")
      .trim();

    const normalizedMoa = pick.moa
      .replace(/^Acts primarily via /i, "Primarily acts via ")
      .replace(/\\.$/, ".")
      .trim();

    record.class = normalizedClass;
    record.mechanism = normalizedMoa;

    if (record.class !== prevClass || record.mechanism !== prevMoa) {
      updated += 1;
    }
  }

  fs.writeFileSync(DATA_PATH, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  console.log(`Enriched ${updated} records using RxClass MED-RT MOA.`);
  console.log(`Cached RXCUI lookups: ${rxcuiCache.size}`);
  console.log(`Cached MOA lookups: ${moaCache.size}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
