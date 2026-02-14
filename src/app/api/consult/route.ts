import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const targetEmail = process.env.CONSULT_TARGET_EMAIL ?? "dereksanz@gmail.com";

function buildTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("Missing SMTP configuration");
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      name?: string;
      email?: string;
      topic?: string;
      message?: string;
    };

    const name = payload.name?.trim();
    const email = payload.email?.trim();
    const topic = payload.topic?.trim();
    const message = payload.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const transporter = buildTransport();

    const subject = topic ? `Consult request: ${topic}` : "New consult request";
    const textBody = [
      `Name: ${name}`,
      `Email: ${email}`,
      topic ? `Topic: ${topic}` : null,
      "---",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    await transporter.sendMail({
      to: targetEmail,
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@sanzrx.com",
      replyTo: email,
      subject,
      text: textBody,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Consult form error", error);
    return NextResponse.json({ error: "Unable to send request" }, { status: 500 });
  }
}
