import Image from "next/image";
import {
  ActionLink,
  primaryCtaClassName,
} from "@/components/action-link";
import { MedicationLookup } from "@/components/medication-lookup";
import { AiPharmacistChat } from "@/components/ai-pharmacist-chat";
import { ConsultForm } from "@/components/consult-form";
import { InteractionFlags } from "@/components/interaction-flags";
import { EducationHubSelect } from "@/components/education-hub-select";
import { NutritionCaseSelector } from "@/components/nutrition-case-selector";
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
  {
    title: "Nutrition Strategy",
    body: "Condition-specific nutrition guidance you can use in nurse care workflows.",
    href: "#nutrition",
  },
];

const educationGuidelineDomains = [
  "ADA Standards of Care (diabetes, obesity, CKD risk integration)",
  "ACC/AHA and ACC/AHA/HFSA guidance (hypertension, CAD, HF, atrial fibrillation)",
  "KDIGO and KDOQI references (CKD staging, monitoring, renal-safe strategy)",
  "GOLD and GINA reports (COPD/asthma control with inhaler optimization)",
  "IDSA-aligned outpatient infection frameworks (sinusitis, CAP, cellulitis, UTI)",
  "AACE/ACE and obesity-focused guidance (weight-centric pharmacotherapy context)",
];

const featuredEducationGuides = playbookDocs.slice(0, 6);

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
                <ActionLink
                  href="#snapshot"
                  action="view_todays_brief"
                  location="hero"
                  className={primaryCtaClassName}
                >
                  View Today&apos;s Brief
                </ActionLink>
                <ActionLink
                  href="#consult"
                  action="schedule_consult"
                  location="hero"
                  className={primaryCtaClassName}
                >
                  Schedule a Consult
                </ActionLink>
                <ActionLink
                  href="/toolkits/medication-cost-savings"
                  action="open_cost_savings_toolkit"
                  location="hero"
                  className={primaryCtaClassName}
                >
                  Cost-Savings Toolkit
                </ActionLink>
                <ActionLink
                  href="/pricing"
                  action="open_pricing"
                  location="hero"
                  className={primaryCtaClassName}
                >
                  Licensing & Pricing
                </ActionLink>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {featureCards.map((card) => (
                  <ActionLink
                    key={card.title}
                    href={card.href}
                    action={`feature_card_${card.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
                    location="hero_feature_cards"
                    className="rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-white/0 p-6 transition hover:border-[var(--accent)]/60"
                  >
                    <h2 className="text-2xl font-semibold text-white">{card.title}</h2>
                    <p className="mt-3 text-sm text-white/70">{card.body}</p>
                  </ActionLink>
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
                        <ActionLink
                          key={`${section.label}-${headline.title}`}
                          href={headline.url}
                          action="open_snapshot_headline"
                          location={`snapshot_${section.label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="block rounded-xl border border-white/5 bg-white/5 px-3 py-2 transition hover:border-[var(--accent)]/50"
                        >
                          <p className="text-base text-white/90">{headline.title}</p>
                          <p className="text-xs text-white/50">
                            {headline.source} · {formatRelativeTime(headline.publishedAt)}
                          </p>
                        </ActionLink>
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
          <div id="interaction-radar">
            <InteractionFlags />
          </div>
        </section>

        <section id="nutrition" className="rounded-3xl border border-white/5 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Nutrition strategy</p>
          <p className="mt-2 text-sm text-white/70">
            Built for care-management workflows: choose a case, apply structured targets, and escalate by clinical response.
          </p>
          <div className="mt-4">
            <NutritionCaseSelector />
          </div>
          <p className="mt-4 text-xs text-white/50">
            Education-only guidance. Final plans must be individualized by licensed clinicians using patient-specific labs, comorbidities, and medication context.
          </p>
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
          <p className="mt-2 text-sm text-white/70">
            Expanded clinical depth with guideline-anchored framing for diagnosis, treatment sequencing, monitoring, and escalation decisions.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {featuredEducationGuides.map((doc) => (
              <ActionLink
                key={doc.slug}
                href={`/docs/${doc.slug}`}
                action="open_featured_education_guide"
                location="education_hub_featured"
                className="rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/70 transition hover:text-white"
              >
                {doc.title}
              </ActionLink>
            ))}
            <ActionLink
              href="/docs"
              action="browse_all_guides"
              location="education_hub"
              className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/80 transition hover:text-white"
            >
              Browse all guides
            </ActionLink>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr,1fr]">
            <EducationHubSelect docs={playbookDocs} />
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">What is inside</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/75">
                  <li>Guideline-based disease framing + diagnostic criteria checkpoints</li>
                  <li>First-line and add-on treatment pathways with clinical rationale</li>
                  <li>Monitoring cadence, target metrics, and escalation/de-escalation triggers</li>
                  <li>Safety red flags, contraindication reminders, and patient counseling pearls</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Guideline domains referenced</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/75">
                  {educationGuidelineDomains.map((domain) => (
                    <li key={domain}>{domain}</li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-white/50">
                  Inline citations are included in the playbooks to support nurse education and pharmacist review workflows.
                </p>
              </div>
            </div>
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
              <ActionLink
                href="/pricing"
                action="discuss_licensing"
                location="licensing_panel"
                className={`${primaryCtaClassName} mt-4 inline-block px-4 py-2 text-xs uppercase tracking-[0.25em]`}
              >
                Discuss Licensing
              </ActionLink>
            </div>
          </div>
        </section>

        <footer className="rounded-3xl border border-white/10 bg-black/50 p-6 text-sm text-white/60">
          <p>© {new Date().getFullYear()} Derek Sanz.</p>
          <p className="mt-1">Concierge pharmacy + daily brief for value-based operators.</p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs uppercase tracking-[0.25em] text-white/50">
            <ActionLink href="/pricing" action="open_pricing" location="footer" className="transition hover:text-white">Pricing</ActionLink>
            <ActionLink href="/privacy" action="open_privacy" location="footer" className="transition hover:text-white">Privacy</ActionLink>
            <ActionLink href="/terms" action="open_terms" location="footer" className="transition hover:text-white">Terms</ActionLink>
          </div>
        </footer>
      </div>
    </main>
  );
}
export const revalidate = 86400;
