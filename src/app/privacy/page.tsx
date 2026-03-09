import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Sanz RX Brief",
  description: "Privacy policy for Sanz RX Brief and related licensing forms.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-16">
        <Link href="/" className="text-sm text-white/60 transition hover:text-[var(--accent)]">
          ← Back to brief
        </Link>
        <section className="rounded-3xl border border-white/10 bg-black/40 p-6 text-sm text-white/80">
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">Privacy</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Privacy Policy</h1>
          <p className="mt-3">Effective date: March 9, 2026.</p>
          <p className="mt-3">
            We collect information you submit through forms (name, email, company, and request details)
            to respond to inquiries, provide demos, and discuss licensing. We do not sell personal data.
          </p>
          <p className="mt-3">
            Operational analytics and server logs may be used for uptime, security, and product improvement.
            If you request deletion of submitted contact data, email dereksanz@gmail.com.
          </p>
          <p className="mt-3">
            This site provides educational content and does not replace individualized medical advice.
          </p>
        </section>
      </div>
    </main>
  );
}

