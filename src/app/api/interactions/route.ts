import { NextResponse } from "next/server";

type InteractionPair = {
  severity: string;
  description: string;
  drugs: string[];
};

type RxCuiResponse = {
  idGroup?: {
    rxnormId?: string[];
  };
};

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

async function fetchRxcui(drugName: string): Promise<string | null> {
  const url = `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(drugName)}&search=1`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return null;
  const data = (await response.json()) as RxCuiResponse;
  return data.idGroup?.rxnormId?.[0] ?? null;
}

function extractInteractionPairs(payload: InteractionResponse): InteractionPair[] {
  const groups = payload?.fullInteractionTypeGroup ?? [];
  const pairs: InteractionPair[] = [];

  for (const group of groups) {
    const interactionTypes = group?.fullInteractionType ?? [];
    for (const interactionType of interactionTypes) {
      const interactionPairs = interactionType?.interactionPair ?? [];
      for (const pair of interactionPairs) {
        const concept = pair?.interactionConcept ?? [];
        const drugs = concept
          .map((item) => item?.minConceptItem?.name)
          .filter((name): name is string => Boolean(name));
        pairs.push({
          severity: pair?.severity ?? "UNKNOWN",
          description: pair?.description ?? "",
          drugs,
        });
      }
    }
  }

  return pairs;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { drugs?: string[] };
    const inputDrugs = Array.from(new Set((body.drugs ?? []).map((d) => d.trim()).filter(Boolean)));

    if (inputDrugs.length < 2) {
      return NextResponse.json(
        { error: "Add at least two medications to run an interaction check." },
        { status: 400 },
      );
    }

    const rxcuis = await Promise.all(inputDrugs.map((drug) => fetchRxcui(drug)));
    const validRxcuis = rxcuis.filter((id): id is string => Boolean(id));

    if (validRxcuis.length < 2) {
      return NextResponse.json(
        { error: "Could not resolve RxNorm identifiers for the selected medications." },
        { status: 400 },
      );
    }

    const interactionUrl = `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${validRxcuis.join("+")}`;
    const interactionResponse = await fetch(interactionUrl, { cache: "no-store" });

    if (!interactionResponse.ok) {
      throw new Error(`Interaction API failed (${interactionResponse.status})`);
    }

    const interactionData = await interactionResponse.json();
    const pairs = extractInteractionPairs(interactionData);

    const filtered = pairs.filter((pair) => {
      const severity = pair.severity?.toLowerCase?.() ?? "";
      return severity === "major" || severity === "moderate";
    });

    return NextResponse.json({ interactions: filtered });
  } catch (error) {
    console.error("Interaction API error", error);
    return NextResponse.json({ error: "Unable to fetch interactions right now." }, { status: 500 });
  }
}
