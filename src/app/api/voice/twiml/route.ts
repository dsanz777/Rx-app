import { NextResponse } from "next/server";
import { gather, say, twiml } from "@/lib/twiml";

function getTransferNumber() {
  return process.env.HUMAN_TRANSFER_NUMBER?.trim();
}

function normalizeDigits(raw: string | null) {
  const digits = raw?.trim() ?? "";
  return /^\d+$/.test(digits) ? digits : "";
}

export async function POST(request: Request) {
  const form = await request.formData();
  const digits = normalizeDigits(form.get("Digits")?.toString() ?? null);
  const step = new URL(request.url).searchParams.get("step") ?? "intro";

  const base = [
    "Hello, this is the pharmacy outreach assistant calling on behalf of your care team.",
    "This call may be recorded for quality.",
  ].join(" ");

  if (digits === "9") {
    return new NextResponse(
      twiml([
        say("Understood. You are now opted out of automated outreach calls. Goodbye."),
        "<Hangup/>",
      ]),
      { headers: { "Content-Type": "text/xml" } },
    );
  }

  if (step === "intro") {
    if (digits === "1") {
      const transferNumber = getTransferNumber();

      if (!transferNumber) {
        return new NextResponse(
          twiml([
            say("Thanks. A care team member will call you back shortly."),
            "<Hangup/>",
          ]),
          { headers: { "Content-Type": "text/xml" } },
        );
      }

      return new NextResponse(
        twiml([
          say("Great. Please hold while we transfer you now."),
          `<Dial>${transferNumber}</Dial>`,
          say("Sorry, we could not complete that transfer right now. A staff member will follow up."),
          "<Hangup/>",
        ]),
        { headers: { "Content-Type": "text/xml" } },
      );
    }

    if (digits === "2") {
      return new NextResponse(
        twiml([say("No problem. We will not transfer you now. Thank you, goodbye."), "<Hangup/>"]),
        { headers: { "Content-Type": "text/xml" } },
      );
    }

    return new NextResponse(
      twiml([
        say(base),
        gather({
          action: "/api/voice/twiml?step=intro",
          prompt:
            "If this is the patient and you would like to speak with staff now, press 1. Press 2 if now is not a good time. Press 9 to opt out.",
        }),
        say("We did not receive a valid response."),
        "<Redirect method=\"POST\">/api/voice/twiml?step=intro</Redirect>",
      ]),
      { headers: { "Content-Type": "text/xml" } },
    );
  }

  return new NextResponse(
    twiml([say("Thanks for your time. Goodbye."), "<Hangup/>"]),
    { headers: { "Content-Type": "text/xml" } },
  );
}
