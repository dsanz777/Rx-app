import { medicationDataset } from "../src/data/medications";

const bad = medicationDataset.filter((m) =>
  /therapeutic mechanism varies|not available/i.test(m.mechanism ?? "") ||
  /therapeutic agent|not available/i.test(m.class ?? "") ||
  /adverse effects vary|monitor response, tolerability, and safety labs per indication|monitor per standard of care|not available/i.test(m.sideEffects ?? "") ||
  /adverse effects vary|monitor response, tolerability, and safety labs per indication|monitor per standard of care|not available/i.test(m.monitoring ?? "")
);
console.log("runtime_count", medicationDataset.length);
console.log("runtime_bad", bad.length);
for (const m of bad.slice(0, 25)) {
  console.log([m.slug, m.class, m.mechanism, m.sideEffects, m.monitoring].join("\t"));
}

const z = medicationDataset.find((x) => x.slug === "zolpidem");
if (z) console.log("ZOLPIDEM", z.class, z.mechanism, z.sideEffects, z.monitoring);
