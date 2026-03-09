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
  name: string;
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

type SuggestionEntry = {
  label: string;
  slug: string;
};

const suggestionEntries = (() => {
  const entries: SuggestionEntry[] = [];
  const seen = new Set<string>();

  for (const item of medicationDataset) {
    const variants = new Set<string>();
    const base = item.name.replace(/\(.*?\)/g, "").trim();
    variants.add(item.name);
    if (base && base !== item.name) variants.add(base);
    variants.add(item.slug.replace(/-/g, " "));

    const parenMatches = item.name.match(/\(([^)]+)\)/);
    if (parenMatches) {
      parenMatches[1]
        .split(/[/,&]|\band\b/i)
        .map((token) => token.trim())
        .filter(Boolean)
        .forEach((token) => variants.add(token));
    }

    for (const variant of variants) {
      const normalized = normalize(variant);
      if (!normalized) continue;
      const key = `${item.slug}|${normalized}`;
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push({ label: variant, slug: item.slug });
    }
  }

  return entries;
})();

const dropdownMedicationNames = Array.from(new Set(medicationDataset.map((item) => item.name))).sort(
  (a, b) => a.localeCompare(b),
);

export function InteractionFlags() {
  const [query, setQuery] = useState("");
  const [selectedDropdown, setSelectedDropdown] = useState<string>(dropdownMedicationNames[0] ?? "");
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<InteractionResult[] | null>(null);
  const [sourceMeta, setSourceMeta] = useState<SourceMeta | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return [];

    const seenSlugs = new Set<string>();
    const out: SuggestionEntry[] = [];
    for (const entry of suggestionEntries) {
      if (!normalize(entry.label).includes(normalizedQuery)) continue;
      if (seenSlugs.has(entry.slug)) continue;
      seenSlugs.add(entry.slug);
      out.push(entry);
      if (out.length >= 8) break;
    }
    return out;
  }, [query]);

  const addMedication = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const exact = suggestionEntries.find((entry) => normalize(entry.label) === normalize(trimmed));
    const matchedSlug = exact?.slug ?? medicationDataset.find((item) => normalize(item.name) === normalize(trimmed))?.slug;
    const matchedLabel = matchedSlug
      ? medicationDataset.find((item) => item.slug === matchedSlug)?.name ?? trimmed
      : trimmed;

    const exists = selected.some((item) => {
      const existingSlug = suggestionEntries.find((entry) => normalize(entry.label) === normalize(item))?.slug
        ?? medicationDataset.find((med) => normalize(med.name) === normalize(item))?.slug;
      return matchedSlug ? existingSlug === matchedSlug : normalize(item) === normalize(trimmed);
    });
    if (exists) {
      setQuery("");
      return;
    }

    setSelected((prev) => [...prev, matchedLabel]);
    setQuery("");
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
        Results are AI-generated and not medical advice. Consult a healthcare professional.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-[0.3em] text-white/40">Add medication</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Start typing a drug name"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-[var(--accent)] focus:outline-none"
              />
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-2xl border border-white/10 bg-black/90 text-sm text-white">
                  {suggestions.map((entry) => (
                    <button
                      key={`${entry.slug}:${entry.label}`}
                      type="button"
                      onClick={() => addMedication(entry.label)}
                      className="block w-full px-4 py-2 text-left hover:bg-white/10"
                    >
                      {entry.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => addMedication(query)}
              className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:text-white"
            >
              Add
            </button>
          </div>

          <label className="mt-2 flex flex-col gap-2 text-xs uppercase tracking-[0.35em] text-white/40">
            Or select medication
            <div className="flex items-center gap-2">
              <select
                value={selectedDropdown}
                onChange={(event) => setSelectedDropdown(event.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white focus:border-[var(--accent)] focus:outline-none"
              >
                {dropdownMedicationNames.map((name) => (
                  <option key={name} value={name} className="text-black">
                    {name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => addMedication(selectedDropdown)}
                className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:text-white"
              >
                Add
              </button>
            </div>
          </label>
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
                  {sourceMeta.name}
                </a>
              ) : (
                sourceMeta.name
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
