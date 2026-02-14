import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type Interaction = {
  severity: string;
  description: string;
};

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a board-certified clinical pharmacist. Given medication lists, respond ONLY with JSON: {\"interactions\":[{\"severity\":\"major|moderate\",\"description\":\"...\"}...]}. Include only clinically significant interactions. If none, return {\"interactions\":[]}.",
        },
        {
          role: "user",
          content: `Medications: ${drugs.join(", ")}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) {
      throw new Error("No response from OpenAI");
    }

    let parsed: { interactions?: Interaction[] };
    try {
      parsed = JSON.parse(raw);
    } catch (parseError) {
      console.error("Interaction response parse error", raw, parseError);
      throw new Error("Could not parse interaction response");
    }

    const interactions = (parsed.interactions ?? []).filter(
      (item) => item.severity && item.description,
    );

    return NextResponse.json({ interactions });
  } catch (error) {
    console.error("Interaction API error", error);
    return NextResponse.json({ error: "Unable to fetch interactions right now." }, { status: 500 });
  }
}
