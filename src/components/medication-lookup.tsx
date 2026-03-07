"use client";

import { useMemo, useState } from "react";
import { medicationDataset, type MedicationRecord } from "@/data/medications";

const searchIndex = medicationDataset.map((item) => ({
  slug: item.slug,
  blob: [
    item.name,
    item.class,
    item.summary,
    item.dose,
    item.renal,
    item.monitoring,
    ...item.pearls,
    ...item.keywords,
  ]
    .join(" ")
    .toLowerCase(),
}));

function filterRecords(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return medicationDataset;
  }

  return medicationDataset.filter((_, idx) => searchIndex[idx].blob.includes(normalizedQuery));
}

function stripSectionNumbering(text?: string) {
  if (!text?.trim()) return "Not available yet.";

  return text
    .replace(/^\s*\d+(?:\.\d+)?\s+(INDICATIONS?\s+AND\s+USAGE|DOSAGE\s+AND\s+ADMINISTRATION)\s*/i, "")
    .replace(/^\s*(INDICATIONS?\s+AND\s+USAGE|DOSAGE\s+AND\s+ADMINISTRATION)\s*[:\-]?\s*/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function fallbackText(value?: string, fallback = "Not available yet.") {
  return value?.trim() ? value.trim() : fallback;
}

function splitIndicationUsage(text?: string) {
  const cleaned = stripSectionNumbering(text);
  if (!cleaned || cleaned === "Not available yet.") {
    return {
      indication: "Not available yet.",
      usage: "Not available yet.",
    };
  }

  const firstSentenceMatch = cleaned.match(/^(.+?[.!?])\s+/);
  if (!firstSentenceMatch) {
    return {
      indication: cleaned,
      usage: "Clinical use details are covered in Dosage and administration below.",
    };
  }

  const indication = firstSentenceMatch[1].trim();
  const usage = cleaned.slice(firstSentenceMatch[0].length).trim();

  return {
    indication,
    usage: usage || "Clinical use details are covered in Dosage and administration below.",
  };
}

export function MedicationLookup() {
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string>("");

  const filteredRecords = useMemo(() => filterRecords(query), [query]);
  const sortedRecords = useMemo(
    () => [...filteredRecords].sort((a, b) => a.name.localeCompare(b.name)),
    [filteredRecords],
  );

  const activeSlug = useMemo(() => {
    const hasSelected = sortedRecords.some((item) => item.slug === selectedSlug);
    return hasSelected ? selectedSlug : "";
  }, [sortedRecords, selectedSlug]);

  const activeMedication: MedicationRecord | undefined = sortedRecords.find(
    (item) => item.slug === activeSlug,
  );

  const indicationUsage = splitIndicationUsage(activeMedication?.summary);
  const hasResults = sortedRecords.length > 0;
  const hasSelectedMedication = Boolean(activeMedication);
  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.4em] text-white/50">
        <span>Medication lookup</span>
        <span>Live dataset</span>
      </div>
      <p className="mt-2 text-sm text-white/70">
        Information is for reference only and not medical advice. Consult a healthcare professional.
      </p>
      <div className="mt-6 flex flex-col gap-4">
        <label className="flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
          <span className="text-white/40">Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="GLP-1, DOAC, renal, etc."
            className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.35em] text-white/40">
          Select medication
          <select
            value={selectedSlug}
            onChange={(event) => setSelectedSlug(event.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-base font-medium normal-case tracking-normal text-white focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="" className="text-black">
              -- Select a medication --
            </option>
            {sortedRecords.map((item) => (
              <option key={item.slug} value={item.slug} className="text-black">
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 text-xs uppercase tracking-[0.35em] text-white/40">
        {sortedRecords.length} result{sortedRecords.length === 1 ? "" : "s"}
      </div>

      {!hasResults ? (
        <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-6 text-sm text-white/70">
          No match yet. Try a drug name, class, or renal keyword.
        </div>
      ) : !hasSelectedMedication ? (
        <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-6 text-sm text-white/70">
          Select a medication to view details.
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">Details</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{activeMedication?.name}</h3>
          <p className="text-sm uppercase tracking-[0.35em] text-white/40">{activeMedication?.class}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                label: "Indication",
                value: indicationUsage.indication,
              },
              {
                label: "Usage",
                value: indicationUsage.usage,
              },
              {
                label: "Mechanism of action",
                value: fallbackText(activeMedication?.class, "See prescribing information."),
              },
              {
                label: "Dosage and administration",
                value: stripSectionNumbering(activeMedication?.dose),
              },
              {
                label: "Side effects",
                value: "See adverse reactions/warnings in prescribing information.",
              },
              {
                label: "Monitoring",
                value: fallbackText(activeMedication?.monitoring),
              },
              {
                label: "Renal considerations",
                value: fallbackText(activeMedication?.renal),
              },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-white/40">{item.label}</p>
                <p className="mt-2 text-sm text-white/80">{item.value}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-white/40">Patient pearls</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-white/80">
                {(activeMedication?.pearls?.length ? activeMedication.pearls : ["No pearls added yet."]).map((pearl) => (
                  <li key={pearl}>{pearl}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}