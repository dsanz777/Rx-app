export function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function twiml(parts: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?><Response>${parts.join("")}</Response>`;
}

export function say(text: string, voice = "alice"): string {
  return `<Say voice="${escapeXml(voice)}">${escapeXml(text)}</Say>`;
}

export function gather({
  action,
  prompt,
  timeout = 5,
  numDigits = 1,
}: {
  action: string;
  prompt: string;
  timeout?: number;
  numDigits?: number;
}): string {
  return `<Gather input="dtmf" numDigits="${numDigits}" timeout="${timeout}" action="${escapeXml(action)}" method="POST">${say(prompt)}</Gather>`;
}
