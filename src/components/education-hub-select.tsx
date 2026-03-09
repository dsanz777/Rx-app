"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { PlaybookDoc } from "@/data/docs";

interface EducationHubSelectProps {
  docs: PlaybookDoc[];
}

export function EducationHubSelect({ docs }: EducationHubSelectProps) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string>("");

  const selectedDoc = useMemo(
    () => docs.find((doc) => doc.slug === selectedSlug),
    [docs, selectedSlug],
  );

  const openGuide = () => {
    if (!selectedSlug) return;
    router.push(`/docs/${selectedSlug}`);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <p className="text-xs uppercase tracking-[0.35em] text-white/45">Choose a guide</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={selectedSlug}
          onChange={(event) => setSelectedSlug(event.target.value)}
          className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-[var(--accent)] focus:outline-none"
        >
          <option value="" className="text-black">
            Select a disease guide...
          </option>
          {docs.map((doc) => (
            <option key={doc.slug} value={doc.slug} className="text-black">
              {doc.title}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={openGuide}
          disabled={!selectedSlug}
          className="rounded-full border border-white/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Open Guide
        </button>
      </div>
      <p className="mt-3 text-sm text-white/70">
        {selectedDoc
          ? selectedDoc.status
          : `Browse ${docs.length} guides in patient- and provider-friendly format.`}
      </p>
    </div>
  );
}
