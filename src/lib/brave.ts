type BraveNewsResult = {
  title: string;
  url: string;
  publishedAt?: string;
  time?: string;
  meta_url?: {
    display_url?: string;
    source?: string;
  };
  profile?: {
    name?: string;
  };
};

interface BraveNewsResponse {
  news?: {
    results?: BraveNewsResult[];
  };
}

export type Headline = {
  title: string;
  url: string;
  source: string;
  publishedAt?: string;
};

export type HeroIntel = {
  generatedAt: string;
  sections: {
    label: string;
    headlines: Headline[];
  }[];
};

const BRAVE_ENDPOINT = "https://api.search.brave.com/res/v1/news/search";
const DEFAULT_HEADLINES: Record<string, Headline[]> = {
  pharma: [
    {
      title: "FDA Approves Oral Semaglutide as First GLP-1 Pill for Weight Loss",
      url: "https://www.ajmc.com/view/fda-approves-oral-semaglutide-as-first-glp-1-pill-for-weight-loss",
      source: "AJMC",
      publishedAt: "19 hours ago",
    },
    {
      title: "FDA approves first GLP-1 pill for obesity from Wegovy maker Novo Nordisk",
      url: "https://www.cnbc.com/2025/12/22/fda-approves-first-glp-1-pill-for-obesity-from-novo-nordisk.html",
      source: "CNBC",
      publishedAt: "December 23, 2025",
    },
    {
      title: "Novo Nordisk wins FDA approval for Wegovy in a pill, introducing first oral GLP-1 option for obesity",
      url: "https://www.fiercepharma.com/pharma/novo-nordisk-wins-fda-approval-wegovy-pill-introducing-first-oral-glp-1-option-obesity",
      source: "Fierce Pharma",
      publishedAt: "December 23, 2025",
    },
  ],
  aco: [
    {
      title: "Pharmacy and clinical updates: March 2026",
      url: "https://www.uhcprovider.com/en/resource-library/news/2026/pcub-updates-mar-2026.html",
      source: "UHCprovider",
      publishedAt: "1 day ago",
    },
    {
      title: "The Year of PBM Reform? Recent Legal Developments, Including a Proposed Transparency Rule for Self-Insured Group Health Plans",
      url: "https://www.ropesgray.com/en/insights/alerts/2026/02/the-year-of-pbm-reform-against-a-backdrop-of-legislative-and-government-enforcement-attention-the-do",
      source: "Ropes & Gray",
      publishedAt: "4 days ago",
    },
    {
      title: "Pharmalittle: We're reading about Trump's MFN deals, 340B program controversies, and much more",
      url: "https://www.statnews.com/pharmalot/2026/03/02/trump-europe-pharma-prices-340b-pharmacies-merck-glp1/",
      source: "STAT News",
      publishedAt: "3 hours ago",
    },
  ],
};

async function fetchBraveHeadlines(query: string, fallbackKey: "pharma" | "aco", limit = 3): Promise<Headline[]> {
  const apiKey = process.env.BRAVE_API_KEY;
  if (!apiKey) {
    return DEFAULT_HEADLINES[fallbackKey];
  }

  const url = new URL(BRAVE_ENDPOINT);
  url.searchParams.set("q", query);
  url.searchParams.set("count", String(limit));
  url.searchParams.set("freshness", "pd");

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-Subscription-Token": apiKey,
      },
      next: {
        revalidate: 60 * 30, // 30 minutes
      },
    });

    if (!response.ok) {
      throw new Error(`Brave API failed: ${response.status}`);
    }

    const payload = (await response.json()) as BraveNewsResponse;
    const stories = payload.news?.results ?? [];

    if (!stories.length) {
      return DEFAULT_HEADLINES[fallbackKey];
    }

    return stories.slice(0, limit).map((story) => ({
      title: story.title,
      url: story.url || story.meta_url?.display_url || "#",
      source:
        story.meta_url?.display_url?.replace(/^www\./, "") ??
        story.meta_url?.source ??
        story.profile?.name ??
        "Brave News",
      publishedAt:
        story.publishedAt ||
        // Brave sometimes returns ISO strings on `time` or `meta_url.source_info.time`.
        (story.time as string | undefined),
    }));
  } catch (error) {
    console.error("Brave headline fetch failed", error);
    return DEFAULT_HEADLINES[fallbackKey];
  }
}

export async function getHeroIntel(): Promise<HeroIntel> {
  console.log("Brave API key present:", !!process.env.BRAVE_API_KEY);
  if (!process.env.BRAVE_API_KEY) {
    console.log("Using fallback headlines - no API key");
  }
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const [pharma, aco] = await Promise.all([
    fetchBraveHeadlines("pharma drug launch FDA approval GLP-1", "pharma"),
    fetchBraveHeadlines("ACO REACH value-based care pharmacy", "aco"),
  ]);

  return {
    generatedAt: formattedDate,
    sections: [
      { label: "Pharma", headlines: pharma },
      { label: "ACO", headlines: aco },
    ],
  };
}
// Trigger redeploy for live Brave headlines
