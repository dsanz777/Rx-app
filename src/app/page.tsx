const featureCards = [
  {
    title: "Medication Lookup",
    body: "Structured cards for dosing, renal adjustments, monitoring, and patient pearls.",
  },
  {
    title: "Interaction Radar",
    body: "Surface the top interaction flags instantly with a severity badge and action plan.",
  },
  {
    title: "AI Pharmacist",
    body: "Chat with the brief’s brain—every response tagged with source + safety disclaimers.",
  },
];

const intel = [
  {
    label: "Weather",
    detail: "Odessa, FL · Clear · 65°F",
  },
  {
    label: "Policy",
    detail: "DHS funding stall → immigration reforms back at center stage.",
  },
  {
    label: "Pharma",
    detail: "RGX-121 gene therapy decision window opens this week.",
  },
  {
    label: "Market",
    detail: "S&P futures −0.4% pre-open; defensive healthcare bid holding.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 lg:gap-24">
        <header className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
            <span>Rx Brief</span>
            <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
            <span>Built by Derek Sanz</span>
          </div>
          <div className="grid gap-10 lg:grid-cols-[3fr,2fr] lg:items-end">
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Clinical signal, minus the noise.
              </h1>
              <p className="text-lg text-white/70 sm:text-xl">
                Daily weather, pharma intel, payer chatter, and the exact talking points Derek needs for Wellvana calls—now wrapped in a product you can actually share.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <button className="rounded-full bg-[var(--accent)] px-5 py-3 font-medium text-black shadow-[0_0_50px_rgba(208,255,61,0.35)] transition hover:opacity-90">
                  View Today’s Brief
                </button>
                <button className="rounded-full border border-white/20 px-5 py-3 font-medium text-white/80 transition hover:text-white">
                  Schedule a Consult
                </button>
              </div>
            </div>
            <div className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-[0_20px_120px_rgba(5,5,5,0.75)]">
              <p className="text-sm uppercase tracking-widest text-white/50">Snapshot · Feb 13</p>
              <div className="mt-4 space-y-4 text-sm">
                {intel.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/5 bg-black/30 p-4"
                  >
                    <p className="text-xs uppercase tracking-wide text-white/40">
                      {item.label}
                    </p>
                    <p className="mt-1 text-base text-white/90">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          {featureCards.map((card) => (
            <article
              key={card.title}
              className="rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-white/0 p-6"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">
                Module
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{card.title}</h2>
              <p className="mt-3 text-sm text-white/70">{card.body}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/50">
              <span>Medication lookup</span>
              <span>Sandbox</span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {["Name", "Dose", "Renal", "Monitoring"].map((label) => (
                <div key={label} className="rounded-2xl border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-wide text-white/40">
                    {label}
                  </p>
                  <p className="mt-1 text-base text-white/90">placeholder</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/5 bg-black/30 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Interaction flags
            </p>
            <div className="mt-4 space-y-3">
              {["Warfarin", "Semaglutide", "Linezolid"].map((drug) => (
                <div key={drug} className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
                  <p className="text-sm font-semibold text-white">{drug}</p>
                  <p className="text-xs text-red-200">High-risk · needs pharmacist clearance</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                AI pharmacist chat
              </p>
              <p className="text-[10px] uppercase text-white/30">Not medical advice</p>
            </div>
            <div className="mt-4 h-48 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
              <p className="text-white/50">You</p>
              <p>
                Draft a one-liner for the DHS shutdown risk + how it ties to ACO
                budgets.
              </p>
              <p className="mt-4 text-white/50">Rx Chat</p>
              <p>
                Sure thing—here’s the pull quote tying DHS ops to payer flight
                risk...
              </p>
            </div>
          </div>
          <div className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Education hub · queue
            </p>
            <div className="space-y-3 text-sm">
              {["GLP-1 playbook", "ACO REACH survival kit", "Hospital at Home FAQ"].map(
                (title) => (
                  <div key={title} className="rounded-2xl border border-white/10 p-4">
                    <p className="font-medium text-white">{title}</p>
                    <p className="text-white/50">Draft · needs Derek review</p>
                  </div>
                ),
              )}
            </div>
            <button className="w-full rounded-full border border-white/20 py-3 text-sm font-medium text-white/80">
              Upload study notes
            </button>
          </div>
        </section>

        <footer className="rounded-3xl border border-white/10 bg-black/50 p-6 text-sm text-white/60">
          <p>© {new Date().getFullYear()} Sanz Solutions · Derek Sanz.</p>
          <p className="mt-1">Concierge pharmacy + daily brief for value-based operators.</p>
        </footer>
      </div>
    </main>
  );
}
