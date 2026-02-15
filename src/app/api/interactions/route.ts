import { NextResponse } from "next/server";
import graph from "@/data/ddinter.interactions.json";
import { resolveMedication } from "@/lib/medication-matcher";

const adjacency = graph.adjacency as Record<string, Record<string, string>>;
const names = graph.names as Record<string, string>;

const severityRank: Record<string, number> = {
  major: 1,
  moderate: 2,
  minor: 3,
  unknown: 4,
};

const allowedSeverities = new Set(["major", "moderate"]);

function normalizeSeverity(value: string) {
  const normalized = value?.toLowerCase()?.trim();
  if (normalized === "major" || normalized === "moderate" || normalized === "minor") {
    return normalized;
  }
  return "unknown";
}

function describeInteraction(aName: string, bName: string, severity: string) {
  const label = severity.charAt(0).toUpperCase() + severity.slice(1);
  return `${label} interaction flagged by DDInter for ${aName} + ${bName}. Reassess the regimen or monitor closely per clinical guidance.`;
}

type InteractionResult = {
  severity: string;
  description: string;
  drugs: string[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { drugs?: string[] };
    const drugs = Array.from(new Set((body.drugs ?? []).map((d) => d.trim()).filter(Boolean)));

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

    const matches = resolved.map((entry) => entry.match!);
    const interactions: InteractionResult[] = [];

    for (let i = 0; i < matches.length; i++) {
      for (let j = i + 1; j < matches.length; j++) {
        const a = matches[i];
        const b = matches[j];
        const severityRaw = adjacency[a.slug]?.[b.slug];
        if (!severityRaw) continue;

        const severity = normalizeSeverity(severityRaw);
        if (!allowedSeverities.has(severity)) continue;

        const aName = names[a.slug] ?? a.name;
        const bName = names[b.slug] ?? b.name;
        interactions.push({
          severity,
          description: describeInteraction(aName, bName, severity),
          drugs: [aName, bName],
        });
      }
    }

    interactions.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

    return NextResponse.json({
      interactions,
      source: {
        name: graph.meta.source,
        website: graph.meta.website,
        license: graph.meta.license,
        generatedAt: graph.meta.generatedAt,
      },
    });
  } catch (error) {
    console.error("Interaction API error", error);
    return NextResponse.json({ error: "Unable to fetch interactions right now." }, { status: 500 });
  }
}
