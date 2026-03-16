"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { PlaybookDoc } from "@/data/docs";

interface EducationHubSelectProps {
  docs: PlaybookDoc[];
}

export function EducationHubSelect({ docs }: EducationHubSelectProps) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string>(docs[0]?.slug ?? "");

  const selectedDoc = useMemo(
    () => docs.find((doc) => doc.slug === selectedSlug),
    [docs, selectedSlug],
  );

  const openGuide = (slug = selectedSlug) => {
    if (!slug) return;
    router.push(`/docs/${slug}`);
  };

  const openRandomGuide = () => {
    if (!docs.length) return;
    const randomDoc = docs[Math.floor(Math.random() * docs.length)];
    openGuide(randomDoc.slug);
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
          {docs.map((doc) => (
            <option key={doc.slug} value={doc.slug} className="text-black">
              {doc.title}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => openGuide()}
          className="rounded-full border border-white/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:text-white"
        >
          Open Guide
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={openRandomGuide}
          className="rounded-full border border-white/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70 transition hover:text-white"
        >
          Surprise me
        </button>
        <Link
          href="/docs"
          className="rounded-full border border-white/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70 transition hover:text-white"
        >
          Full library
        </Link>
      </div>
      <p className="mt-3 text-sm text-white/70">
        {selectedDoc
          ? selectedDoc.status
          : `Browse ${docs.length} guides in patient- and provider-friendly format.`}
      </p>
    </div>
  );
}
