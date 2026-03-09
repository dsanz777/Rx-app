import { NextResponse } from "next/server";
import OpenAI from "openai";
import { resolveMedication } from "@/lib/medication-matcher";

const severityRank: Record<string, number> = {
  major: 1,
  moderate: 2,
  minor: 3,
  monitor: 4,
  none: 5,
  unknown: 6,
};

function pairKey(drugs: string[] | undefined) {
  const normalized = (drugs ?? []).map((item) => item.trim().toLowerCase()).filter(Boolean).sort();
  if (normalized.length !== 2) return "";
  return `${normalized[0]}|${normalized[1]}`;
}

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
  const mechanism = (entry.mechanism ?? "").trim();
  const management = (entry.management ?? "").trim();
  if (
    mechanism &&
    !/no known significant|no interaction|none identified|not clinically significant/i.test(mechanism)
  ) {
    segments.push(`Mechanism: ${mechanism}`);
  }
  if (
    management &&
    !/no specific management required|no management required|none required|routine care only/i.test(management)
  ) {
    segments.push(`Plan: ${management}`);
  }
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

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
Only output entries when there is a clinically meaningful interaction worth surfacing.
Severity options: "major", "moderate", "minor", or "monitor" (for low-level or lab/watch situations).
Do NOT output a "none" entry.
Mechanism should summarize the pharmacology/PK/PD issue.
Management should describe monitoring or mitigation steps.
Cite authoritative guidance in-line (guideline name, labeling, primary literature) but do not include URLs.`;

    const userPrompt = `Medications: ${canonicalNames.join(", ")}
Pairs to evaluate (${pairs.length} total):
${pairs.map(([a, b]) => `- ${a} + ${b}`).join("\n")}

Return JSON exactly in this shape (no prose):
{
  "interactions": [
    {
      "drugs": ["Drug A", "Drug B"],
      "severity": "major|moderate|minor|monitor",
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

    const deduped = new Map<string, { severity: string; description: string; drugs: string[] }>();

    const interactions = parsed.interactions
      .filter((entry) => Array.isArray(entry.drugs) && entry.drugs.length === 2)
      .filter((entry) => !/^(none|unknown)$/i.test((entry.severity ?? "").trim()))
      .map((entry) => ({
        severity: (entry.severity ?? "unknown").toLowerCase(),
        description: formatDescription(entry),
        drugs: entry.drugs,
      }))
      .filter((entry) => entry.description !== "No narrative provided.")
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
