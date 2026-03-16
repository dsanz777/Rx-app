import { NextResponse } from "next/server";
import {
  getDdinterSeverityGuidance,
  getDdinterSourceMeta,
  getInteractionsForMedications,
} from "@/lib/ddinter";
import { resolveMedication } from "@/lib/medication-matcher";

const severityRank: Record<string, number> = {
  major: 1,
  moderate: 2,
  minor: 3,
  unknown: 4,
};

function pairKey(drugs: string[] | undefined) {
  const normalized = (drugs ?? []).map((item) => item.trim().toLowerCase()).filter(Boolean).sort();
  if (normalized.length !== 2) return "";
  return `${normalized[0]}|${normalized[1]}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { drugs?: string[] };
    const drugs = Array.from(new Set((body.drugs ?? []).map((drug) => drug.trim()).filter(Boolean)));

    if (drugs.length < 2) {
      return NextResponse.json(
        { error: "Add at least two medications to run an interaction check." },
        { status: 400 },
      );
    }

    const resolved = drugs.map((drug) => ({ input: drug, match: resolveMedication(drug) }));
    const missing = resolved.filter((entry) => !entry.match);

    if (missing.length) {
      return NextResponse.json(
        { error: `Could not match: ${missing.map((item) => item.input).join(", ")}` },
        { status: 400 },
      );
    }

    const deduped = new Map<string, { severity: string; description: string; drugs: string[] }>();

    const interactions = getInteractionsForMedications(resolved.map((entry) => entry.match!))
      .map((entry) => ({
        severity: entry.severity,
        description: getDdinterSeverityGuidance(entry.severity),
        drugs: entry.drugs,
      }))
      .sort((a, b) => (severityRank[a.severity] ?? 99) - (severityRank[b.severity] ?? 99))
      .filter((entry) => {
        const key = pairKey(entry.drugs);
        if (!key) return false;
        const existing = deduped.get(key);
        if (!existing) {
          deduped.set(key, entry);
          return true;
        }
        const existingRank = severityRank[existing.severity] ?? 99;
        const nextRank = severityRank[entry.severity] ?? 99;
        if (nextRank < existingRank) {
          deduped.set(key, entry);
        }
        return false;
      });

    return NextResponse.json({
      interactions,
      source: getDdinterSourceMeta(),
    });
  } catch (error) {
    console.error("Interaction API error", error);
    return NextResponse.json({ error: "Unable to fetch interactions right now." }, { status: 500 });
  }
}
