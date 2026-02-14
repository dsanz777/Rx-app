"use client";

import { useMemo, useState } from "react";
import {
  medicationDataset,
  medicationTags,
  type MedicationRecord,
} from "@/data/medications";

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

const tagOptions = ["All", ...medicationTags];

function filterRecords(query: string, tag: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return medicationDataset.filter((item, idx) => {
    const tagMatch = tag === "All" || item.tags.includes(tag);
    if (!tagMatch) return false;

    if (!normalizedQuery) return true;

    return searchIndex[idx].blob.includes(normalizedQuery);
  });
}

export function MedicationLookup() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string>("All");
  const [selectedSlug, setSelectedSlug] = useState<string>(medicationDataset[0]?.slug ?? "");

  const filteredRecords = useMemo(() => filterRecords(query, tag), [query, tag]);

  const activeSlug = useMemo(() => {
    const hasSelected = filteredRecords.some((item) => item.slug === selectedSlug);
    if (hasSelected) return selectedSlug;
    return filteredRecords[0]?.slug ?? medicationDataset[0]?.slug ?? "";
  }, [filteredRecords, selectedSlug]);

  const activeMedication: MedicationRecord | undefined = filteredRecords.find(
    (item) => item.slug === activeSlug,
  ) ?? filteredRecords[0] ?? medicationDataset[0];

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.4em] text-white/50">
        <span>Medication lookup</span>
        <span>Live dataset</span>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <label className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
          <span className="text-white/40">Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="GLP-1, DOAC, renal, etc."
            className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
          />
        </label>
        <div className="flex flex-wrap gap-2 text-xs">
          {tagOptions.map((option) => {
            const isActive = tag === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setTag(option)}
                className={`rounded-full border px-4 py-2 uppercase tracking-[0.25em] transition ${
                  isActive
                    ? "border-[var(--accent)] bg-[var(--accent)]/20 text-white"
                    : "border-white/15 text-white/60 hover:text-white"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 text-xs uppercase tracking-[0.35em] text-white/40">
        {filteredRecords.length} result{filteredRecords.length === 1 ? "" : "s"}
      </div>

      {filteredRecords.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-6 text-sm text-white/70">
          No match yet. Try a drug name, class, or renal keyword.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.8fr,1fr]">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">Details</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{activeMedication?.name}</h3>
            <p className="text-sm uppercase tracking-[0.35em] text-white/40">
              {activeMedication?.class}
            </p>
            <p className="mt-4 text-sm text-white/70">{activeMedication?.summary}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[{
                label: "Dose",
                value: activeMedication?.dose,
              },
              {
                label: "Renal",
                value: activeMedication?.renal,
              },
              {
                label: "Monitoring",
                value: activeMedication?.monitoring,
              }].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/40">{item.label}</p>
                  <p className="mt-2 text-sm text-white/80">{item.value}</p>
                </div>
              ))}
              <div className="rounded-2xl border border-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-white/40">Pearls</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-white/80">
                  {activeMedication?.pearls.map((pearl) => (
                    <li key={pearl}>{pearl}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">Shortlist</p>
            <div className="mt-3 space-y-3">
              {filteredRecords.map((item) => {
                const isActive = item.slug === activeMedication?.slug;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setSelectedSlug(item.slug)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      isActive
                        ? "border-[var(--accent)]/70 bg-[var(--accent)]/10"
                        : "border-white/10 bg-black/20 hover:border-white/30"
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                      {item.class}
                    </p>
                    <p className="mt-2 text-xs text-white/70">{item.summary}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
