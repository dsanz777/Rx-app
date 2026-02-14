"use client";

import { FormEvent, useMemo, useState } from "react";
import { medicationDataset } from "@/data/medications";

type InteractionResult = {
  severity: string;
  description: string;
  drugs?: string[];
};

type ApiResponse = {
  interactions: InteractionResult[];
};

type ApiError = {
  error?: string;
};

const suggestionNames = (() => {
  const tokens = new Set<string>();

  medicationDataset.forEach((item) => {
    const base = item.name.replace(/\(.*?\)/g, "").trim();
    tokens.add(item.name);
    if (base && base !== item.name) tokens.add(base);

    const slugName = item.slug.replace(/-/g, " ");
    tokens.add(slugName);

    const parenMatches = item.name.match(/\(([^)]+)\)/);
    if (parenMatches) {
      parenMatches[1]
        .split(/[\/,&]|\band\b/i)
        .map((token) => token.replace(/[+]/g, "+").trim())
        .filter(Boolean)
        .forEach((token) => tokens.add(token));
    }
  });

  return Array.from(tokens).filter(Boolean);
})();

export function InteractionFlags() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<InteractionResult[] | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const normalized = query.toLowerCase();
    return suggestionNames
      .filter((name) => name.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [query]);

  const addMedication = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const exists = selected.some((item) => item.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setQuery("");
      return;
    }

    setSelected((prev) => [...prev, trimmed]);
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

    try {
      const response = await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drugs: selected }),
      });

      if (!response.ok) {
        const data = (await response.json()) as ApiError;
        throw new Error(data.error ?? "Interaction check failed");
      }

      const data = (await response.json()) as ApiResponse;
      setResults(data.interactions ?? []);
      setStatus("idle");
    } catch (err) {
      console.error(err);
      setError((err as Error).message ?? "Interaction check failed");
      setStatus("error");
    }
  };

  return (
    <div id="interaction-radar" className="rounded-3xl border border-white/5 bg-black/30 p-6">
      <p className="text-xs uppercase tracking-[0.4em] text-white/50">Interaction flags</p>
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
                  {suggestions.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => addMedication(name)}
                      className="block w-full px-4 py-2 text-left hover:bg-white/10"
                    >
                      {name}
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
          {results.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
              No major or moderate interactions detected.
            </div>
          )}
          {results.map((result, index) => (
            <div
              key={`${result.severity}-${index}`}
              className="rounded-2xl border border-white/10 bg-black/40 p-4"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                {result.severity} interaction
              </p>
              <p className="mt-2 text-sm text-white/80">{result.description}</p>
              {result.drugs?.length ? (
                <p className="mt-2 text-xs text-white/50">{result.drugs.join(" + ")}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
