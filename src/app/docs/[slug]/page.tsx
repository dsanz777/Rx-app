import fs from "fs/promises";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { playbookDocs, getPlaybookBySlug } from "@/data/docs";
import { renderMarkdown } from "@/lib/markdown";

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

async function loadMarkdown(file: string) {
  const filePath = path.join(process.cwd(), "public", "docs", file);
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    notFound();
  }
}

export async function generateStaticParams() {
  return playbookDocs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getPlaybookBySlug(slug);
  if (!doc) {
    return {};
  }

  return {
    title: `${doc.title} | Sanz RX Brief`,
    description: doc.status,
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getPlaybookBySlug(slug);

  if (!doc) {
    notFound();
  }

  const markdown = await loadMarkdown(doc.file);
  const html = await renderMarkdown(markdown);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
        <Link
          href="/"
          className="text-sm text-white/60 transition hover:text-[var(--accent)]"
        >
          ← Back to brief
        </Link>
        <header className="space-y-4 rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_20px_120px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-4">
            <Image
              src="/sanz-logo.png"
              alt="Sanz Solutions logo"
              width={64}
              height={64}
              className="rounded-full border border-white/10"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Sanz Solutions</p>
              <p className="text-sm text-white/80">Concierge pharmacy</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Playbook</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">{doc.title}</h1>
            <p className="mt-1 text-sm text-white/60">{doc.status}</p>
          </div>
        </header>
        <article className="doc-content rounded-3xl border border-white/5 bg-black/30 p-6" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </main>
  );
}
