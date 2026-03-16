import type { Metadata } from "next";
import { ActionLink } from "@/components/action-link";
import { LicensingForm } from "@/components/licensing-form";

export const metadata: Metadata = {
  title: "Licensing & Pricing | Sanz RX Brief",
  description: "License Sanz RX Brief for practices, payers, and digital health organizations.",
};

const plans = [
  {
    name: "Practice",
    price: "$1,500+/mo",
    notes: "For independent or small-group clinics",
    features: [
      "Medication lookup + interaction workflow",
      "Disease playbook library",
      "Monthly content updates",
      "Email support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom annual",
    notes: "For health systems, payers, and large organizations",
    features: [
      "White-label branding",
      "Custom formulary and care pathway overlays",
      "Workflow/API integration planning",
      "Dedicated success channel",
    ],
  },
  {
    name: "Pilot",
    price: "90-day scoped",
    notes: "Outcome-focused launch package",
    features: [
      "Implementation playbook",
      "Use-case tracking dashboard",
      "Leadership readout with ROI narrative",
      "Expansion recommendation",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
        <ActionLink
          href="/"
          action="back_to_brief"
          location="pricing_header"
          className="text-sm text-white/60 transition hover:text-[var(--accent)]"
        >
          ← Back to brief
        </ActionLink>

        <section className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_20px_120px_rgba(0,0,0,0.6)]">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Licensing</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Commercial packages</h1>
          <p className="mt-3 max-w-3xl text-sm text-white/75">
            License this clinical intelligence platform for medication decision support, disease education,
            and workflow acceleration. Final pricing depends on user count, deployment scope, and support model.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">{plan.name}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{plan.price}</p>
              <p className="mt-1 text-sm text-white/60">{plan.notes}</p>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-white/80">
                {plan.features.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">Request access</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Book a licensing discussion</h2>
            <p className="mt-2 text-sm text-white/70">
              Share your organization profile and goals. We will respond with a recommended package and
              implementation scope.
            </p>
            <div className="mt-5">
              <LicensingForm />
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-black/30 p-6 text-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-white/40">What buyers ask</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-white/75">
              <li>How quickly can this be deployed to front-line teams?</li>
              <li>Can disease content be edited for local protocols?</li>
              <li>How does this reduce avoidable utilization and spend?</li>
              <li>What governance is required for safe AI interaction checks?</li>
            </ul>
          </aside>
        </section>

        <footer className="rounded-3xl border border-white/10 bg-black/30 p-4 text-xs uppercase tracking-[0.25em] text-white/50">
          <div className="flex flex-wrap gap-4">
            <ActionLink href="/privacy" action="open_privacy" location="pricing_footer" className="transition hover:text-white">Privacy</ActionLink>
            <ActionLink href="/terms" action="open_terms" location="pricing_footer" className="transition hover:text-white">Terms</ActionLink>
          </div>
        </footer>
      </div>
    </main>
  );
}
