import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ActionLink } from "@/components/action-link";
import { renderMarkdown } from "@/lib/markdown";

interface DownloadDoc {
  file: string;
  slug: string;
}

interface DownloadPageProps {
  params: Promise<{ slug: string }>;
}

const downloadsDir = path.join(process.cwd(), "public", "downloads");

function slugify(file: string) {
  return file
    .replace(/\.md$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractTitle(markdown: string, fallback: string) {
  const firstHeading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return firstHeading || fallback;
}

async function getDownloadDocs(): Promise<DownloadDoc[]> {
  const entries = await fs.readdir(downloadsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => ({
      file: entry.name,
      slug: slugify(entry.name),
    }));
}

async function getDownloadBySlug(slug: string): Promise<DownloadDoc | null> {
  const docs = await getDownloadDocs();
  return docs.find((doc) => doc.slug === slug) ?? null;
}

async function loadMarkdown(file: string) {
  const filePath = path.join(downloadsDir, file);
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    notFound();
  }
}

export async function generateStaticParams() {
  const docs = await getDownloadDocs();
  return docs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: DownloadPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDownloadBySlug(slug);
  if (!doc) {
    return {};
  }

  const markdown = await loadMarkdown(doc.file);
  const title = extractTitle(markdown, doc.file.replace(/\.md$/i, ""));

  return {
    title: `${title} | Sanz RX Brief`,
    description: `Download resource: ${title}`,
  };
}

export default async function DownloadPage({ params }: DownloadPageProps) {
  const { slug } = await params;
  const doc = await getDownloadBySlug(slug);

  if (!doc) {
    notFound();
  }

  const markdown = await loadMarkdown(doc.file);
  const html = await renderMarkdown(markdown);
  const title = extractTitle(markdown, doc.file.replace(/\.md$/i, ""));

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
        <ActionLink
          href="/toolkits/medication-cost-savings"
          action="back_to_toolkit"
          location="download_detail_header"
          className="text-sm text-white/60 transition hover:text-[var(--accent)]"
        >
          ← Back to toolkit
        </ActionLink>
        <header className="space-y-4 rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_20px_120px_rgba(0,0,0,0.6)]">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Download</p>
          <h1 className="text-4xl font-semibold text-white">{title}</h1>
          <p className="text-sm text-white/60">{doc.file}</p>
        </header>
        <article className="doc-content rounded-3xl border border-white/5 bg-black/30 p-6" dangerouslySetInnerHTML={{ __html: html }} />
        <section className="flex flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-black/40 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Keep reading</p>
            <p className="mt-1 text-sm text-white/80">Explore all playbook guides covering real-world medication decisions.</p>
          </div>
          <ActionLink
            href="/docs"
            action="browse_guides"
            location="download_detail_bottom_cta"
            className="ml-auto rounded-full border border-white/20 px-5 py-3 font-medium text-white/80 transition hover:text-white"
          >
            Browse all guides →
          </ActionLink>
        </section>
      </div>
    </main>
  );
}
