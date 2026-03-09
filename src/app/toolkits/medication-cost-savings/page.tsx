import type { Metadata } from "next";
import Link from "next/link";

const sections = [
  {
    title: "Top 25 high-cost classes",
    body: "Practical lower-cost pathways with operational notes for nurse care teams.",
  },
  {
    title: "Step-therapy + PA cheat sheet",
    body: "Fast-reference patterns, documentation checklist, and escalation flow.",
  },
  {
    title: "Patient cost-barrier scripts",
    body: "Plug-and-play scripts for affordability conversations and callback follow-up.",
  },
  {
    title: "Deprescribing opportunity checklist",
    body: "One-page review tool to surface medication burden and cost opportunities.",
  },
  {
    title: "Monthly update tracker",
    body: "Template structure to track payer changes, outcomes, FAQs, and iteration priorities.",
  },
];

const projection = [
  { label: "Month 1 toolkit", value: 735, display: "$735", height: "h-[26%]", color: "bg-cyan-400/80" },
  { label: "Month 2 toolkit", value: 2370, display: "$2,370", height: "h-[74%]", color: "bg-cyan-300" },
  { label: "Walkthrough upsell", value: 598, display: "$598", height: "h-[22%]", color: "bg-emerald-300/90" },
];

export const metadata: Metadata = {
  title: "Medication Cost-Savings Toolkit | Sanz RX Brief",
  description:
    "Minimum sellable toolkit for nurse care managers focused on medication affordability workflows.",
};

export default function MedicationCostSavingsToolkitPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
        <Link href="/" className="text-sm text-white/60 transition hover:text-[var(--accent)]">
          ← Back to brief
        </Link>

        <section className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_20px_120px_rgba(0,0,0,0.6)]">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Founding Edition</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Medication Cost-Savings Toolkit</h1>
          <p className="mt-2 text-xl text-white/80">for Nurse Care Managers</p>
          <p className="mt-4 max-w-3xl text-sm text-white/75">
            A practical, no-fluff toolkit to reduce medication affordability barriers with workflows teams can use this week.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a
              href="/downloads/medication-cost-savings-toolkit-v1"
              className="rounded-full border border-white/20 bg-black/60 px-5 py-3 font-medium text-white transition hover:text-[var(--accent)]"
            >
              Download Toolkit (v1)
            </a>
            <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-5 py-3 font-medium text-emerald-200">
              Founding price: $49 (first 25)
            </span>
            <span className="rounded-full border border-white/15 px-5 py-3 text-white/70">Then $79</span>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((item) => (
            <article key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm text-white/70">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
          <article className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">Projected Revenue Snapshot</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">30-day realistic income model</h2>
            <p className="mt-2 text-sm text-white/70">
              Assumes launch pricing and conservative early traction from direct outreach + professional circles.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="flex h-56 items-end justify-around gap-3 border-b border-white/10 pb-3">
                {projection.map((item) => (
                  <div key={item.label} className="flex w-full max-w-[150px] flex-col items-center gap-2">
                    <p className="text-xs font-medium text-white/80">{item.display}</p>
                    <div className="relative flex h-40 w-full items-end rounded-xl border border-white/10 bg-white/[0.03] p-2">
                      <div className={`w-full rounded-md ${item.height} ${item.color} shadow-[0_0_30px_rgba(45,212,191,0.25)]`} />
                    </div>
                    <p className="text-center text-[11px] text-white/60">{item.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-white/55">Total modeled monthly run-rate by Month 2 (with two walkthroughs): $2,968</p>
            </div>
          </article>

          <aside className="rounded-3xl border border-white/10 bg-black/30 p-6 text-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">Optional Upsell</p>
            <h3 className="mt-2 text-xl font-semibold text-white">45-min Team Walkthrough</h3>
            <p className="mt-2 text-white/75">Implementation support session for small care teams.</p>
            <p className="mt-3 text-lg font-semibold text-emerald-200">$199–$399</p>

            <ul className="mt-4 list-disc space-y-2 pl-5 text-white/75">
              <li>Workflow setup for cost-barrier triage</li>
              <li>Script and escalation calibration</li>
              <li>PA/step documentation quality check</li>
            </ul>
          </aside>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/30 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">Disclaimer</p>
          <p className="mt-2 text-sm text-white/80">
            This toolkit is for educational and operational support purposes only. It does not provide patient-specific medical advice, diagnosis, or treatment recommendations.
          </p>
        </section>
      </div>
    </main>
  );
}
