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
      company?: string;
      role?: string;
      organizationType?: string;
      estimatedUsers?: string;
      goals?: string;
      timeline?: string;
      website?: string;
      source?: string;
    };

    const name = payload.name?.trim();
    const email = payload.email?.trim();
    const company = payload.company?.trim();
    const role = payload.role?.trim();
    const organizationType = payload.organizationType?.trim();
    const estimatedUsers = payload.estimatedUsers?.trim();
    const goals = payload.goals?.trim();
    const timeline = payload.timeline?.trim();
    const website = payload.website?.trim();
    const source = payload.source?.trim();

    if (!name || !email || !company || !goals) {
      return NextResponse.json(
        { error: "Name, email, company, and goals are required" },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    if (website) {
      // Honeypot field: likely bot submission.
      return NextResponse.json({ ok: true });
    }

    const transporter = buildTransport();

    const subject = `Licensing lead: ${company}`;
    const textBody = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company}`,
      role ? `Role: ${role}` : null,
      organizationType ? `Organization type: ${organizationType}` : null,
      estimatedUsers ? `Estimated users: ${estimatedUsers}` : null,
      timeline ? `Timeline: ${timeline}` : null,
      source ? `Source: ${source}` : null,
      "---",
      "Goals:",
      goals,
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
    console.error("Licensing form error", error);
    return NextResponse.json({ error: "Unable to send licensing request" }, { status: 500 });
  }
}
