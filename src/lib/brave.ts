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
      title: "FDA advisers line up Ozempic-style CV indications for 2025 sequencing",
      url: "https://www.fiercepharma.com/",
      source: "Fierce Pharma",
    },
    {
      title: "CMS signals permanent split between buy-and-bill vs. home delivery GLP-1s",
      url: "https://www.statnews.com/",
      source: "STAT",
    },
    {
      title: "Pfizer revives hospital unit with 3-site cell therapy network",
      url: "https://endpts.com/",
      source: "Endpoints",
    },
  ],
  aco: [
    {
      title: "ACO REACH guardrails tighten risk-score growth to 3%",
      url: "https://www.modernhealthcare.com/",
      source: "Modern Healthcare",
    },
    {
      title: "Hospitals press CMS for hybrid ED-at-home waivers inside MSSP",
      url: "https://www.beckershospitalreview.com/",
      source: "Becker's",
    },
    {
      title: "Humana pilots GLP-1 carve-outs with VBC convener partners",
      url: "https://www.healthcaredive.com/",
      source: "Healthcare Dive",
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
      url: story.url,
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
