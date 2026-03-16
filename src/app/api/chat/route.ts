import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getDdinterSourceMeta, getInteractionsForMedications, describeDdinterInteraction } from "@/lib/ddinter";
import { medicationDataset } from "@/data/medications";
import { extractMedicationsFromText } from "@/lib/medication-matcher";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function buildMedicationContext(message: string) {
  const matchedMeds = extractMedicationsFromText(message).slice(0, 6);
  if (!matchedMeds.length) {
    return {
      matchedNames: [] as string[],
      context: "",
    };
  }

  const medBlocks = matchedMeds
    .map((medication) => {
      const record = medicationDataset.find((item) => item.slug === medication.slug);
      if (!record) return null;
      return [
        `Medication: ${record.name}`,
        `Class: ${record.class}`,
        `Summary: ${record.summary}`,
        `Dose: ${record.dose}`,
        `Renal: ${record.renal}`,
        `Monitoring: ${record.monitoring}`,
        `Side effects: ${record.sideEffects ?? "Not listed."}`,
      ].join("\n");
    })
    .filter((block): block is string => Boolean(block));

  return {
    matchedNames: matchedMeds.map((item) => item.name),
    context: medBlocks.join("\n\n"),
  };
}

function buildInteractionContext(message: string) {
  const matchedMeds = extractMedicationsFromText(message);
  if (matchedMeds.length < 2) {
    return "";
  }

  const interactions = getInteractionsForMedications(matchedMeds).slice(0, 8);
  if (!interactions.length) {
    return "DDInter local dataset: no matched interaction signal found for the medications detected in the latest user message.";
  }

  const source = getDdinterSourceMeta();
  return [
    `DDInter local dataset (${source.source}${source.generatedAt ? `, refreshed ${source.generatedAt}` : ""}):`,
    ...interactions.map((interaction) => `- ${describeDdinterInteraction(interaction)}`),
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const { messages } = (await request.json()) as { messages?: ChatMessage[] };

    const sanitizedMessages = (messages ?? [])
      .filter((message) => message.role === "user" || message.role === "assistant")
      .map((message) => ({ role: message.role, content: message.content.slice(0, 2000) }));

    const latestUserMessage = [...sanitizedMessages].reverse().find((message) => message.role === "user")?.content ?? "";
    const medicationContext = buildMedicationContext(latestUserMessage);
    const interactionContext = buildInteractionContext(latestUserMessage);

    const groundingSections = [
      medicationContext.context ? `Local medication dataset:\n${medicationContext.context}` : "",
      interactionContext,
    ]
      .filter(Boolean)
      .join("\n\n");

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: [
            "You are Derek Sanz's AI pharmacist.",
            "Give concise, clinically sound answers with short sections or bullets when useful.",
            "Prefer the provided local medication dataset and DDInter interaction data over general memory whenever they are available.",
            "If the user asks about a detected interaction, explicitly state the DDInter severity and the practical implication.",
            "If the local data is insufficient, say what is missing rather than inventing specifics.",
            "End with a brief reminder that this is not individualized medical advice.",
            groundingSections ? `Grounding context:\n${groundingSections}` : "",
          ]
            .filter(Boolean)
            .join("\n\n"),
        },
        ...sanitizedMessages,
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json({ error: "No response generated" }, { status: 500 });
    }

    return NextResponse.json({
      reply,
      matchedMedications: medicationContext.matchedNames,
    });
  } catch (error) {
    console.error("Chat API error", error);
    return NextResponse.json({ error: "Chat service unavailable" }, { status: 500 });
  }
}
