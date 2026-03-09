import Image from "next/image";
import { MedicationLookup } from "@/components/medication-lookup";
import { AiPharmacistChat } from "@/components/ai-pharmacist-chat";
import { ConsultForm } from "@/components/consult-form";
import { InteractionFlags } from "@/components/interaction-flags";
import { getHeroIntel } from "@/lib/brave";
import { playbookDocs } from "@/data/docs";

const featureCards = [
  {
    title: "Medication Lookup",
    body: "Structured cards for dosing, renal adjustments, monitoring, and patient pearls.",
    href: "#medication-lookup",
  },
  {
    title: "Interaction Radar",
    body: "Surface the top interaction flags instantly with a severity badge and action plan.",
    href: "#interaction-radar",
  },
  {
    title: "AI Pharmacist",
    body: "Chat with the brief's brain-every response tagged with source + safety disclaimers.",
    href: "#ai-pharmacist",
  },
];

function formatRelativeTime(dateInput?: string) {
  if (!dateInput) return "Updated now";
  const parsed = Date.parse(dateInput);
  if (Number.isNaN(parsed)) return "Updated today";

  const diffMinutes = Math.max(1, Math.round((Date.now() - parsed) / (1000 * 60)));
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

// Fixed snapshot for live Brave pulls - Mar 2, 2026

export default async function Home() { 
  const heroIntel = await getHeroIntel();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 lg:gap-24">
        <header className="space-y-8">
          <div className="grid gap-10 lg:grid-cols-[3fr,2fr] lg:items-end">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-2">
                <Image
                  src="/sanz-logo.png"
                  alt="Sanz Solutions logo"
                  width={72}
                  height={72}
                  priority
                  className="rounded-full border border-white/10"
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">Sanz Solutions</p>
                  <p className="text-sm text-white/80">Concierge pharmacy</p>
                </div>
              </div>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Clinical signal, minus the noise.
              </h1>
              <p className="text-lg text-white/70 sm:text-xl">
                Daily pharmacy intel, ACO strategy notes, medication insights - wrapped in a product you can actually share.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <a
                  href="#snapshot"
                  className="rounded-full border border-white/20 bg-black/60 px-5 py-3 font-medium text-white transition hover:text-[var(--accent)]"
                >
                  View Today&apos;s Brief
                </a>
                <a
                  href="#consult"
                  className="rounded-full border border-white/20 px-5 py-3 font-medium text-white/80 transition hover:text-white"
                >
                  Schedule a Consult
                </a>
                <a
                  href="/toolkits/medication-cost-savings"
                  className="rounded-full border border-white/20 px-5 py-3 font-medium text-white/80 transition hover:text-white"
                >
                  Cost-Savings Toolkit
                </a>
                <a
                  href="/pricing"
                  className="rounded-full border border-white/20 px-5 py-3 font-medium text-white/80 transition hover:text-white"
                >
                  Licensing & Pricing
                </a>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {featureCards.map((card) => (
                  <a
                    key={card.title}
                    href={card.href}
                    className="rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-white/0 p-6 transition hover:border-[var(--accent)]/60"
                  >
                    <h2 className="text-2xl font-semibold text-white">{card.title}</h2>
                    <p className="mt-3 text-sm text-white/70">{card.body}</p>
                  </a>
                ))}
              </div>
            </div>
            <div
              id="snapshot"
              className="rounded-3xl border border-white/5 bg-black/30 p-6 shadow-[0_20px_120px_rgba(5,5,5,0.75)]"
            >
              <p className="text-sm uppercase tracking-widest text-white/50">Snapshot · {heroIntel.generatedAt}</p>
              <div className="mt-4 space-y-4 text-sm">
                {heroIntel.sections.map((section) => (
                  <div
                    key={section.label}
                    className="rounded-2xl border border-white/5 bg-black/40 p-4"
                  >
                    <p className="text-xs uppercase tracking-wide text-white/40">
                      {section.label}
                    </p>
                    <div className="mt-3 space-y-3">
                      {section.headlines.map((headline) => (
                        <a
                          key={`${section.label}-${headline.title}`}
                          href={headline.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="block rounded-xl border border-white/5 bg-white/5 px-3 py-2 transition hover:border-[var(--accent)]/50"
                        >
                          <p className="text-base text-white/90">{headline.title}</p>
                          <p className="text-xs text-white/50">
                            {headline.source} · {formatRelativeTime(headline.publishedAt)}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section id="medication-lookup" className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <MedicationLookup />
          <InteractionFlags />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div id="ai-pharmacist">
            <AiPharmacistChat />
          </div>
          <div id="consult">
            <ConsultForm />
          </div>
        </section>

        <section className="rounded-3xl border border-white/5 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Education hub</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {playbookDocs.map((item) => (
              <a
                key={item.title}
                href={`/docs/${item.slug}`}
                className="rounded-2xl border border-white/10 p-4 transition hover:border-[var(--accent)]/70"
              >
                <p className="font-medium text-white">{item.title}</p>
                <p className="text-sm text-white/50">{item.status}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/5 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Licensing</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-3 text-sm text-white/80">
              <p className="text-lg font-semibold text-white">Enterprise-ready clinical content engine</p>
              <p>
                This platform can be licensed to provider groups, digital health companies, payers, and
                pharmacy organizations that need medication intelligence + disease education in one product.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>White-label disease playbooks for patient and provider education</li>
                <li>Medication lookup with class/MOA, dosing, monitoring, and renal considerations</li>
                <li>Interaction workflow designed for fast clinical triage and safer prescribing</li>
                <li>Configurable deployment for private-clinic, enterprise, or payer environments</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm">
              <p className="font-semibold text-white">Commercial next steps</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-white/75">
                <li>Package this as per-seat + per-site licensing</li>
                <li>Add client-specific branding and formulary overlays</li>
                <li>Pilot with 1-2 practices and capture outcomes</li>
                <li>Publish a case study to support enterprise sales</li>
              </ol>
              <a
                href="/pricing"
                className="mt-4 inline-block rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/80 transition hover:text-white"
              >
                Discuss Licensing
              </a>
            </div>
          </div>
        </section>

        <footer className="rounded-3xl border border-white/10 bg-black/50 p-6 text-sm text-white/60">
          <p>© {new Date().getFullYear()} Derek Sanz.</p>
          <p className="mt-1">Concierge pharmacy + daily brief for value-based operators.</p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs uppercase tracking-[0.25em] text-white/50">
            <a href="/pricing" className="transition hover:text-white">Pricing</a>
            <a href="/privacy" className="transition hover:text-white">Privacy</a>
            <a href="/terms" className="transition hover:text-white">Terms</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
export const revalidate = 86400;
