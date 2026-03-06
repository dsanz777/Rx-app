type BraveNewsResult = {
  title: string;
  url: string;
  publishedAt?: string;
  time?: string;
  page_age?: string;
  age?: string;
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
const FALLBACK_HEADLINES: Record<string, Headline[]> = {
  pharma: [
    {
      title: "FDA warns telehealth firms over misleading compounded GLP-1 ads",
      url: "https://thehill.com/policy/healthcare/5765337-fda-telehealth-companies-compounded-glp-1/",
      source: "The Hill",
      publishedAt: "Mar 3, 2026",
    },
    {
      title: "FDA issues 30 warning letters tied to GLP-1 marketing claims",
      url: "https://www.pharmaceuticalcommerce.com/view/fda-issues-30-warning-letters-to-telehealth-firms-over-misleading-compounded-glp-1-marketing",
      source: "Pharmaceutical Commerce",
      publishedAt: "Mar 4, 2026",
    },
    {
      title: "Fierce Pharma: FDA intensifies GLP-1 compounding crackdown",
      url: "https://www.fiercepharma.com/pharma/fda-ramps-crackdown-glp-1-drug-compounders-fresh-batch-30-warning-letters",
      source: "Fierce Pharma",
      publishedAt: "Mar 4, 2026",
    },
  ],
  aco: [
    {
      title: "CMS estimates 14.3M Medicare beneficiaries in ACOs for 2026",
      url: "https://www.fiercehealthcare.com/regulatory/cms-estimates-143m-medicare-beneficiaries-are-enrolled-aco-2026",
      source: "Fierce Healthcare",
      publishedAt: "Feb 2026",
    },
    {
      title: "ACO REACH participants prep for pharmacy spend audits",
      url: "https://www.modernhealthcare.com/politics-regulation/mh-medicare-aco-shared-savings-program-2026/",
      source: "Modern Healthcare",
      publishedAt: "Feb 2026",
    },
    {
      title: "ACO pharmacies look to GLP-1 risk-sharing contracts",
      url: "https://www.healthcarelabyrinth.com/march-3-2026/",
      source: "Healthcare Labyrinth",
      publishedAt: "Mar 3, 2026",
    },
  ],
};

const resolveSource = (story: BraveNewsResult) =>
  story.meta_url?.display_url?.replace(/^www\./, "") ??
  story.meta_url?.source ??
  story.profile?.name ??
  "News";

const resolveDate = (story: BraveNewsResult) =>
  story.publishedAt || story.page_age || story.age || story.time;

async function tryFetch(query: string, apiKey: string, freshness: "pd" | "pw") {
  const url = new URL(BRAVE_ENDPOINT);
  url.searchParams.set("q", query);
  url.searchParams.set("count", "10");
  url.searchParams.set("freshness", freshness);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "X-Subscription-Token": apiKey,
    },
    cache: "no-store",
  });

  console.log(`[Brave] ${query} freshness=${freshness} status=${response.status}`);

  if (!response.ok) {
    console.log("[Brave] body:", await response.text());
    return [];
  }

  const payload = (await response.json()) as BraveNewsResponse;
  const stories = payload.news?.results ?? [];
  console.log(`[Brave] ${query} items=${stories.length}`);

  return stories.map((story) => ({
    title: story.title,
    url: story.url || story.meta_url?.display_url || "#",
    source: resolveSource(story),
    publishedAt: resolveDate(story),
  }));
}

async function fetchSection(query: string, fallbackKey: keyof typeof FALLBACK_HEADLINES) {
  const apiKey = process.env.BRAVE_API_KEY;
  if (!apiKey) {
    console.warn("[Brave] Missing API key, using fallback for", fallbackKey);
    return FALLBACK_HEADLINES[fallbackKey];
  }

  for (const freshness of ["pd", "pw"] as const) {
    try {
      const headlines = await tryFetch(query, apiKey, freshness);
      if (headlines.length) {
        return headlines.slice(0, 3);
      }
    } catch (error) {
      console.error("[Brave] fetch failed", error);
    }
  }

  console.warn("[Brave] No live headlines for", fallbackKey, "—using fallback");
  return FALLBACK_HEADLINES[fallbackKey];
}

export async function getHeroIntel(): Promise<HeroIntel> {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const [pharma, aco] = await Promise.all([
    fetchSection("pharma news FDA GLP-1", "pharma"),
    fetchSection("ACO value based care pharmacy news", "aco"),
  ]);

  return {
    generatedAt: formattedDate,
    sections: [
      { label: "Pharma", headlines: pharma },
      { label: "ACO", headlines: aco },
    ],
  };
}
