import { NextResponse } from "next/server";
import OpenAI from "openai";
import { resolveMedication } from "@/lib/medication-matcher";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const severityRank: Record<string, number> = {
  major: 1,
  moderate: 2,
  minor: 3,
  monitor: 4,
  none: 5,
  unknown: 6,
};

type AiInteraction = {
  drugs: string[];
  severity: string;
  mechanism?: string;
  management?: string;
};

type AiResponse = {
  interactions?: AiInteraction[];
};

function formatDescription(entry: AiInteraction) {
  const segments: string[] = [];
  if (entry.mechanism) segments.push(`Mechanism: ${entry.mechanism}`);
  if (entry.management) segments.push(`Plan: ${entry.management}`);
  if (!segments.length) segments.push("No narrative provided.");
  return segments.join(" ");
}

function safeJsonParse(text: string): AiResponse | null {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch (error) {
    console.error("Failed to parse AI response", error);
    return null;
  }
}

function pairwise(items: string[]) {
  const pairs: [string, string][] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      pairs.push([items[i], items[j]]);
    }
  }
  return pairs;
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

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

    const canonicalNames = resolved.map((entry) => entry.match!.name);
    const pairs = pairwise(canonicalNames);

    const systemPrompt = `You are a board-certified clinical pharmacist generating deterministic interaction checks.
Return structured JSON ONLY.
For every medication pair you are given, you must output an entry—even if no clinically significant interaction exists.
Severity options: "major", "moderate", "minor", "monitor" (for low-level or lab/watch situations), or "none" when no interaction is known.
Mechanism should summarize the pharmacology/PK/PD issue.
Management should describe monitoring or mitigation steps.
Cite authoritative guidance in-line (guideline name, labeling, primary literature) but do not include URLs.`;

    const userPrompt = `Medications: ${canonicalNames.join(", ")}
Pairs to evaluate (${pairs.length} total):
${pairs.map(([a, b]) => `- ${a} + ${b}`).join("\n")}\n
Return JSON exactly in this shape (no prose):
{
  "interactions": [
    {
      "drugs": ["Drug A", "Drug B"],
      "severity": "major|moderate|minor|monitor|none",
      "mechanism": "...",
      "management": "..."
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      max_tokens: 1200,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) {
      throw new Error("Empty AI response");
    }

    const parsed = safeJsonParse(reply);
    if (!parsed?.interactions) {
      throw new Error("Unable to parse AI response");
    }

    const interactions = parsed.interactions
      .filter((entry) => Array.isArray(entry.drugs) && entry.drugs.length === 2)
      .map((entry) => ({
        severity: (entry.severity ?? "unknown").toLowerCase(),
        description: formatDescription(entry),
        drugs: entry.drugs,
      }))
      .sort((a, b) => (severityRank[a.severity] ?? 99) - (severityRank[b.severity] ?? 99));

    return NextResponse.json({
      interactions,
      source: {
        name: "GPT-4o clinical interaction model",
        website: "https://openai.com",
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Interaction API error", error);
    return NextResponse.json({ error: "Unable to fetch interactions right now." }, { status: 500 });
  }
}
