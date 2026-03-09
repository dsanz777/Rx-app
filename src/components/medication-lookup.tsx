"use client";

import { useMemo, useState } from "react";
import {
  medicationDataset,
  medicationDatasetVersion,
  type MedicationRecord,
} from "@/data/medications";

const searchIndex = medicationDataset.map((item) => ({
  slug: item.slug,
  blob: [
    item.name,
    item.class,
    item.mechanism,
    item.summary,
    item.dose,
    item.renal,
    item.sideEffects,
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

  const hasResults = sortedRecords.length > 0;
  const hasSelection = Boolean(activeMedication);
  const showPearls = (activeMedication?.pearls?.length ?? 0) > 0;

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.4em] text-white/50">
        <span>Medication lookup</span>
        <span>Live dataset · {medicationDatasetVersion}</span>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <label className="flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
          <span className="text-white/40">Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder=""
            className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.35em] text-white/40">
          Select medication
          <select
            value={activeSlug || ""}
            onChange={(event) => setSelectedSlug(event.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-base font-medium normal-case tracking-normal text-white focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="" className="text-black">
              Choose a medication...
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
      ) : !hasSelection ? (
        <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-6 text-sm text-white/70">
          Select a medication to view class, mechanism, dosing, monitoring, and pearls.
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">Details</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{activeMedication?.name}</h3>
          <p className="mt-2 text-sm text-white/80">
            <span className="font-semibold text-white">Drug class:</span> {activeMedication?.class}
          </p>
          <p className="mt-1 text-sm text-white/80">
            <span className="font-semibold text-white">Mechanism of action:</span>{" "}
            {activeMedication?.mechanism}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                label: "Indication",
                value: activeMedication?.summary,
              },
              {
                label: "Dosage and Administration",
                value: activeMedication?.dose,
              },
              {
                label: "Side Effects",
                value: activeMedication?.sideEffects,
              },
              {
                label: "Monitoring",
                value: activeMedication?.monitoring,
              },
              {
                label: "Renal Considerations",
                value: activeMedication?.renal,
              },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-white/40">{item.label}</p>
                <p className="mt-2 text-sm text-white/80">{item.value}</p>
              </div>
            ))}
            {showPearls ? (
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-white/40">Patient Pearls</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-white/80">
                  {activeMedication?.pearls.map((pearl) => (
                    <li key={pearl}>{pearl}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
