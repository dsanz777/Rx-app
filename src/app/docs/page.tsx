import { ActionLink } from "@/components/action-link";
import { playbookDocs } from "@/data/docs";

export default function DocsLibraryPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
        <header className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_20px_120px_rgba(0,0,0,0.6)]">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Education hub</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Clinical Guide Library</h1>
          <p className="mt-3 text-sm text-white/70">
            {playbookDocs.length} practical guides for medication decisions, monitoring plans, and escalation frameworks.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playbookDocs.map((doc) => (
            <ActionLink
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              action="open_doc_guide"
              location="docs_library_grid"
              className="rounded-2xl border border-white/10 bg-black/30 p-5 transition hover:border-[var(--accent)]/60"
            >
              <p className="text-sm font-semibold text-white">{doc.title}</p>
              <p className="mt-2 text-xs text-white/60">{doc.status}</p>
            </ActionLink>
          ))}
        </section>

        <section className="flex flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-black/40 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Ready to use in the field</p>
            <p className="mt-1 text-sm text-white/80">Grab the toolkit with checklists, scripts, and escalation workflows designed for nurse care teams.</p>
          </div>
          <ActionLink
            href="/toolkits/medication-cost-savings"
            action="view_toolkit_from_docs"
            location="docs_library_bottom_cta"
            className="ml-auto rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-5 py-3 font-medium text-[var(--accent)] transition hover:bg-[var(--accent)]/20"
          >
            Cost-Savings Toolkit →
          </ActionLink>
        </section>
      </div>
    </main>
  );
}
