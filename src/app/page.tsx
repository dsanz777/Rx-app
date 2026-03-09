import Image from "next/image";
import { MedicationLookup } from "@/components/medication-lookup";
import { AiPharmacistChat } from "@/components/ai-pharmacist-chat";
import { ConsultForm } from "@/components/consult-form";
import { InteractionFlags } from "@/components/interaction-flags";
import { EducationHubSelect } from "@/components/education-hub-select";
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

const nutritionProtocols = [
  {
    title: "Type 2 Diabetes",
    focus: "Carb quality, meal consistency, and protein-forward plate design.",
    actions: [
      "Use plate method: half non-starchy vegetables, quarter lean protein, quarter high-fiber carbs.",
      "Target 25–35 g fiber/day and limit sugar-sweetened beverages.",
      "Pair carb-heavy meals with movement within 30 minutes when feasible.",
    ],
  },
  {
    title: "Hypertension / HF",
    focus: "Sodium and volume management with practical shopping substitutions.",
    actions: [
      "Limit sodium and avoid excessive intake; for many high-risk patients this is operationalized near 2 g sodium/day when individualized by the care team.",
      "Prioritize low-sodium proteins and frozen/no-salt-added vegetables.",
      "Track daily weight and edema symptoms alongside nutrition intake changes.",
    ],
  },
  {
    title: "CKD Support",
    focus: "Protein quality and electrolyte-aware dietary planning by CKD stage.",
    actions: [
      "Coordinate potassium/phosphorus counseling with latest labs and nephrology plan.",
      "Use food-first protein quality upgrades before supplement escalation.",
      "Review OTC products for hidden sodium, potassium, and phosphate additives.",
    ],
  },
  {
    title: "Weight + Metabolic Risk",
    focus: "High-satiety meal architecture and behavior-based adherence.",
    actions: [
      "Anchor each meal with protein + produce before starch additions.",
      "Use hunger/fullness scaling to reduce late-night grazing and portion drift.",
      "Set one measurable 2-week nutrition target and close-loop on progress.",
    ],
  },
];

const nutritionGuidelines = [
  {
    title: "ADA Standards of Care in Diabetes (current edition)",
    note: "Nutrition therapy and cardiometabolic risk reduction framework for diabetes care.",
    url: "https://professional.diabetes.org/standards-of-care",
  },
  {
    title: "KDIGO 2024 CKD Guideline",
    note: "CKD nutrition considerations, including sodium and protein context by stage/comorbidity.",
    url: "https://kdigo.org/wp-content/uploads/2024/03/KDIGO-2024-CKD-Guideline.pdf",
  },
  {
    title: "2022 AHA/ACC/HFSA Heart Failure Guideline",
    note: "Recommends avoiding excessive sodium intake in stage C heart failure.",
    url: "https://professional.heart.org/-/media/832EA0F4E73948848612F228F7FA2D35.pdf",
  },
  {
    title: "Dietary Guidelines for Americans",
    note: "National baseline for healthy eating patterns and long-term risk reduction.",
    url: "https://www.dietaryguidelines.gov/",
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

        <section id="nutrition" className="rounded-3xl border border-white/5 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Nutrition strategy</p>
          <p className="mt-2 text-sm text-white/70">
            This section is guideline-aligned for education and care-management workflows; final plans should be individualized by licensed clinicians.
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {nutritionProtocols.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-white/50">{item.title}</p>
                <p className="mt-2 text-sm text-white/75">{item.focus}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/80">
                  {item.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Guideline references</p>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              {nutritionGuidelines.map((guideline) => (
                <li key={guideline.title}>
                  <a
                    href={guideline.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-medium text-white underline decoration-dotted underline-offset-4 hover:text-[var(--accent)]"
                  >
                    {guideline.title}
                  </a>
                  <span className="text-white/65"> — {guideline.note}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-xs text-white/50">
            Nutrition guidance is educational support and should be individualized by licensed clinicians for each patient.
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
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr,1fr]">
            <EducationHubSelect docs={playbookDocs} />
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">What is inside</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/75">
                <li>Disease overview + diagnostic framework</li>
                <li>Pharmacologic and non-pharmacologic treatment pathways</li>
                <li>Monitoring targets and escalation triggers</li>
                <li>Patient counseling points for adherence and safety</li>
              </ul>
              <p className="mt-4 text-xs text-white/50">
                These guides are educational support and should be adapted to patient-specific clinical judgment.
              </p>
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
