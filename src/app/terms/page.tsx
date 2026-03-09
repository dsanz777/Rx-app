import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | Sanz RX Brief",
  description: "Terms of use for Sanz RX Brief.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-16">
        <Link href="/" className="text-sm text-white/60 transition hover:text-[var(--accent)]">
          ← Back to brief
        </Link>
        <section className="rounded-3xl border border-white/10 bg-black/40 p-6 text-sm text-white/80">
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">Legal</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Terms of Use</h1>
          <p className="mt-3">Effective date: March 9, 2026.</p>
          <p className="mt-3">
            The content on this platform is educational and informational. It is not a substitute for
            professional medical judgment, diagnosis, or treatment.
          </p>
          <p className="mt-3">
            You are responsible for independent clinical review before applying any recommendations in
            real patient care. We disclaim liability for decisions made solely from site content.
          </p>
          <p className="mt-3">
            For licensing and commercial terms, contact dereksanz@gmail.com for a separate agreement.
          </p>
        </section>
      </div>
    </main>
  );
}

