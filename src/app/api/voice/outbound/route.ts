import { NextResponse } from "next/server";

type OutboundBody = {
  to?: string;
};

function normalizePhoneNumber(input: string): string | null {
  const normalized = input.replace(/[^\d+]/g, "");
  return /^\+[1-9]\d{7,14}$/.test(normalized) ? normalized : null;
}

function getBaseUrl(request: Request): string {
  const envBase = process.env.APP_BASE_URL?.trim();
  return (envBase?.replace(/\/$/, "") ?? `${new URL(request.url).protocol}//${new URL(request.url).host}`);
}

function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

function canCall(request: Request): boolean {
  const expected = process.env.VOICE_API_KEY?.trim();
  if (!expected) return true;
  const provided = request.headers.get("x-voice-key")?.trim();
  return Boolean(provided && provided === expected);
}

export async function POST(request: Request) {
  try {
    if (!canCall(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as OutboundBody;
    const to = body.to?.trim();

    if (!to) {
      return NextResponse.json({ error: "Missing 'to'" }, { status: 400 });
    }

    const normalizedTo = normalizePhoneNumber(to);
    if (!normalizedTo) {
      return NextResponse.json({ error: "Invalid 'to'. Use E.164 format, e.g. +15551234567." }, { status: 400 });
    }

    const accountSid = requireEnv("TWILIO_ACCOUNT_SID");
    const authToken = requireEnv("TWILIO_AUTH_TOKEN");
    const from = requireEnv("TWILIO_PHONE_NUMBER");

    const baseUrl = getBaseUrl(request);
    const twimlUrl = `${baseUrl}/api/voice/twiml?step=intro`;
    const statusCallback = `${baseUrl}/api/voice/status`;

    const params = new URLSearchParams({
      To: normalizedTo,
      From: from,
      Url: twimlUrl,
      StatusCallback: statusCallback,
      StatusCallbackMethod: "POST",
      StatusCallbackEvent: "initiated ringing answered completed",
    });

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      },
    );

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Twilio call create failed", status: response.status, details: text },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, twilio: JSON.parse(text) });
  } catch (error) {
    console.error("voice.outbound error", error);
    return NextResponse.json({ error: "Unable to start outbound call" }, { status: 500 });
  }
}
