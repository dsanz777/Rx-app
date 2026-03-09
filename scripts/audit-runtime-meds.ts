import { medicationDataset } from "../src/data/medications";

const bad = medicationDataset.filter((m) =>
  /therapeutic mechanism varies|not available/i.test(m.mechanism ?? "") ||
  /therapeutic agent|not available/i.test(m.class ?? ""),
);

console.log("runtime_count", medicationDataset.length);
console.log("runtime_bad", bad.length);
for (const m of bad.slice(0, 20)) {
  console.log([m.slug, m.name, m.class, m.mechanism].join("\t"));
}

for (const slug of [
  "amlodipine",
  "oxcarbazepine",
  "gabapentin",
  "lansoprazole",
  "atomoxetine",
  "warfarin",
  "tamsulosin",
  "hydralazine",
  "carisoprodol",
  "guaifenesin",
]) {
  const m = medicationDataset.find((x) => x.slug === slug);
  if (m) console.log(`SAMPLE\t${m.slug}\t${m.class}\t${m.mechanism}`);
}
