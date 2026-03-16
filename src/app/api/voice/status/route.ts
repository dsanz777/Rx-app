import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();

  const payload = {
    callSid: form.get("CallSid")?.toString() ?? "",
    callStatus: form.get("CallStatus")?.toString() ?? "",
    to: form.get("To")?.toString() ?? "",
    from: form.get("From")?.toString() ?? "",
    answeredBy: form.get("AnsweredBy")?.toString() ?? "",
    timestamp: new Date().toISOString(),
  };

  console.log("[voice.status]", payload);

  return NextResponse.json({ ok: true });
}
