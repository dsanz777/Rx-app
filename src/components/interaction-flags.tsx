"use client";

import { FormEvent, useMemo, useState } from "react";
import { medicationDataset } from "@/data/medications";
import { DetailCard, Panel, SectionEyebrow } from "@/components/ui/surfaces";

type InteractionResult = {
  severity: string;
  description: string;
  drugs?: string[];
};

type SourceMeta = {
  source: string;
  license?: string;
  website?: string;
  generatedAt?: string;
};

type ApiResponse = {
  interactions: InteractionResult[];
  source?: SourceMeta;
};

type ApiError = {
  error?: string;
};

const normalize = (value: string) => value.trim().toLowerCase();

function parseInteractionError(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "Interaction check failed";
  const maybeError = (payload as ApiError).error;
  return typeof maybeError === "string" && maybeError ? maybeError : "Interaction check failed";
}

const dropdownMedicationNames = Array.from(new Set(medicationDataset.map((item) => item.name))).sort(
  (a, b) => a.localeCompare(b),
);

export function InteractionFlags() {
  const [query, setQuery] = useState("");
  const [selectedDropdown, setSelectedDropdown] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<InteractionResult[] | null>(null);
  const [sourceMeta, setSourceMeta] = useState<SourceMeta | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const filteredDropdownNames = useMemo(() => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return dropdownMedicationNames;
    return dropdownMedicationNames.filter((name) => normalize(name).includes(normalizedQuery));
  }, [query]);

  const addMedication = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const matchedSlug = medicationDataset.find((item) => normalize(item.name) === normalize(trimmed))?.slug;
    const matchedLabel = matchedSlug
      ? medicationDataset.find((item) => item.slug === matchedSlug)?.name ?? trimmed
      : trimmed;

    const exists = selected.some((item) => {
      const existingSlug = medicationDataset.find((med) => normalize(med.name) === normalize(item))?.slug;
      return matchedSlug ? existingSlug === matchedSlug : normalize(item) === normalize(trimmed);
    });
    if (exists) {
      return;
    }

    setSelected((prev) => [...prev, matchedLabel]);
    setSelectedDropdown("");
  };

  const removeMedication = (name: string) => {
    setSelected((prev) => prev.filter((item) => item !== name));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selected.length < 2 || status === "loading") return;

    setStatus("loading");
    setError(null);
    setResults(null);
    setSourceMeta(null);

    try {
      const response = await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drugs: selected }),
      });

      if (!response.ok) {
        throw new Error(parseInteractionError(await response.json()));
      }

      const data = (await response.json()) as ApiResponse;
      setResults(data.interactions ?? []);
      setSourceMeta(data.source ?? null);
      setStatus("idle");
    } catch (err) {
      setError((err as Error).message ?? "Interaction check failed");
      setStatus("error");
    }
  };

  return (
    <Panel id="interaction-radar">
      <SectionEyebrow>Interaction flags</SectionEyebrow>
      <p className="mt-2 text-sm text-white/70">
        Results use the local DDInter dataset and are not medical advice. Confirm against patient-specific factors.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="flex flex-col gap-4">
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
              value={selectedDropdown}
              onChange={(event) => setSelectedDropdown(event.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-base font-medium normal-case tracking-normal text-white focus:border-[var(--accent)] focus:outline-none"
            >
              <option value="" className="text-black">
                Choose a medication...
              </option>
              {filteredDropdownNames.map((name) => (
                <option key={name} value={name} className="text-black">
                  {name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            disabled={!selectedDropdown}
            onClick={() => addMedication(selectedDropdown)}
            className="w-full rounded-full border border-white/20 px-4 py-3 text-sm font-semibold text-white/80 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add medication
          </button>
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selected.map((drug) => (
              <span
                key={drug}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-white/80"
              >
                {drug}
                <button
                  type="button"
                  onClick={() => removeMedication(drug)}
                  className="text-white/50 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={selected.length < 2 || status === "loading"}
          className="w-full rounded-full border border-white/20 px-4 py-3 text-sm font-semibold text-white/80 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? "Checking..." : "Run interaction"}
        </button>
      </form>

      {error && <p className="mt-3 text-xs text-red-300">{error}</p>}

      {results && (
        <div className="mt-4 space-y-3">
          {results.map((result) => (
            <DetailCard
              key={`${result.severity}-${result.description}-${result.drugs?.join(",") ?? "none"}`}
              className="bg-black/40"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                {result.severity} interaction
              </p>
              <p className="mt-2 text-sm text-white/80">{result.description}</p>
              {result.drugs?.length ? (
                <p className="mt-2 text-xs text-white/50">{result.drugs.join(" + ")}</p>
              ) : null}
            </DetailCard>
          ))}
          {sourceMeta && (
            <p className="text-[11px] text-white/40">
              Source: {sourceMeta.website ? (
                <a
                  href={sourceMeta.website}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-dotted underline-offset-4 hover:text-white/60"
                >
                  {sourceMeta.source}
                </a>
              ) : (
                sourceMeta.source
              )}
              {sourceMeta.license ? <span> ({sourceMeta.license})</span> : null}
              {sourceMeta.generatedAt ? (
                <span> · refreshed {new Date(sourceMeta.generatedAt).toLocaleDateString()}</span>
              ) : null}
            </p>
          )}
        </div>
      )}
    </Panel>
  );
}
