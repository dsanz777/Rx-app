import { NextResponse } from "next/server";
import { resolveRxcui } from "@/lib/rxnav";

type InteractionConcept = {
  minConceptItem?: {
    name?: string;
  };
};

type InteractionPairPayload = {
  severity?: string;
  description?: string;
  interactionConcept?: InteractionConcept[];
};

type InteractionType = {
  interactionPair?: InteractionPairPayload[];
};

type InteractionTypeGroup = {
  fullInteractionType?: InteractionType[];
};

type InteractionResponse = {
  fullInteractionTypeGroup?: InteractionTypeGroup[];
};

type InteractionResult = {
  severity: string;
  description: string;
  drugs: string[];
};

const severityRank: Record<string, number> = {
  major: 1,
  moderate: 2,
  minor: 3,
};

function extractInteractionPairs(payload: InteractionResponse): InteractionResult[] {
  const results: InteractionResult[] = [];
  const groups = payload?.fullInteractionTypeGroup ?? [];

  for (const group of groups) {
    const interactionTypes = group?.fullInteractionType ?? [];
    for (const interactionType of interactionTypes) {
      const interactionPairs = interactionType?.interactionPair ?? [];
      for (const pair of interactionPairs) {
        const concepts = pair?.interactionConcept ?? [];
        const drugs = concepts
          .map((concept) => concept?.minConceptItem?.name)
          .filter((name): name is string => Boolean(name));

        const severity = pair?.severity ?? "unknown";
        const description = pair?.description ?? "No description provided.";

        results.push({ severity, description, drugs });
      }
    }
  }

  return results;
}

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

    const resolutions = await Promise.all(drugs.map((drug) => resolveRxcui(drug)));
    const unresolved = resolutions.filter((item) => !item.rxcui);
    if (unresolved.length) {
      return NextResponse.json(
        { error: `Could not match: ${unresolved.map((item) => item.name).join(", ")}` },
        { status: 400 },
      );
    }

    const rxcuiList = resolutions.map((item) => item.rxcui!).join("+");
    const interactionUrl = `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${rxcuiList}`;
    const response = await fetch(interactionUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Interaction service error (${response.status})`);
    }

    const payload = (await response.json()) as InteractionResponse;
    const allInteractions = extractInteractionPairs(payload);

    const filtered = allInteractions
      .filter((item) => {
        const severity = item.severity.toLowerCase();
        return severity === "major" || severity === "moderate";
      })
      .sort((a, b) => {
        const rankA = severityRank[a.severity.toLowerCase()] ?? 99;
        const rankB = severityRank[b.severity.toLowerCase()] ?? 99;
        return rankA - rankB;
      });

    return NextResponse.json({ interactions: filtered });
  } catch (error) {
    console.error("Interaction API error", error);
    return NextResponse.json({ error: "Unable to fetch interactions right now." }, { status: 500 });
  }
}
