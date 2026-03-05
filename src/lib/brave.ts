const ONE_DAY_MS = 24 * 60 * 60 * 1000;

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

type Freshness = "pd" | "pw";

type EnrichedHeadline = {
  headline: Headline;
  timestamp: number | null;
};

function parseRelativeTimestamp(raw: string): number | null {
  const match = raw.trim().match(/^(\d+)\s+(minute|minutes|hour|hours|day|days)\s+ago$/i);
  if (!match) return null;
  const value = Number(match[1]);
  if (Number.isNaN(value)) return null;
  const unit = match[2].toLowerCase();
  const multiplier = unit.startsWith("minute")
    ? 60 * 1000
    : unit.startsWith("hour")
    ? 60 * 60 * 1000
    : ONE_DAY_MS;
  return Date.now() - value * multiplier;
}

function resolveTimestamp(story: BraveNewsResult): number | null {
  const candidates = [story.page_age, story.time, story.publishedAt, story.age];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const relative = parseRelativeTimestamp(candidate);
    if (relative !== null) return relative;
    const parsed = Date.parse(candidate);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return null;
}

async function fetchFromBrave(query: string, limit: number, freshness: Freshness, apiKey: string) {
  const url = new URL(BRAVE_ENDPOINT);
  url.searchParams.set("q", query);
  url.searchParams.set("count", String(limit * 3));
  url.searchParams.set("freshness", freshness);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "X-Subscription-Token": apiKey,
    },
    cache: "no-store",
  });

  console.log(`[Brave] ${freshness} status:`, response.status);

  if (!response.ok) {
    throw new Error(`Brave API failed: ${response.status}`);
  }

  const payload = (await response.json()) as BraveNewsResponse;
  const stories = payload.news?.results ?? [];

  console.log(`[Brave] ${freshness} raw stories:`, stories.length);

  const enriched: EnrichedHeadline[] = stories.map((story) => ({
    headline: {
      title: story.title,
      url: story.url || story.meta_url?.display_url || "#",
      source:
        story.meta_url?.display_url?.replace(/^www\./, "") ??
        story.meta_url?.source ??
        story.profile?.name ??
        "Brave News",
      publishedAt: story.publishedAt || story.time || story.page_age || story.age,
    },
    timestamp: resolveTimestamp(story),
  }));

  const freshOnly = enriched
    .filter(({ timestamp }) => timestamp !== null && Date.now() - (timestamp as number) <= ONE_DAY_MS)
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  console.log(`[Brave] ${freshness} fresh within 24h:`, freshOnly.length);

  return freshOnly.slice(0, limit);
}

async function fetchBraveHeadlines(query: string, limit = 3): Promise<Headline[]> {
  const apiKey = process.env.BRAVE_API_KEY;
  console.log("Fetching headlines for query:", query);
  console.log("Brave API key present:", !!apiKey);
  if (!apiKey) {
    console.error("No BRAVE_API_KEY - cannot fetch headlines");
    return [];
  }

  try {
    const primary = await fetchFromBrave(query, limit, "pd", apiKey);
    if (primary.length >= limit) {
      return primary.map(({ headline }) => headline);
    }

    const supplemental = await fetchFromBrave(query, limit, "pw", apiKey);
    const combined = [...primary, ...supplemental];

    const unique = combined.filter((item, index, array) =>
      array.findIndex((candidate) => candidate.headline.url === item.headline.url) === index,
    );

    return unique.slice(0, limit).map(({ headline }) => headline);
  } catch (error) {
    console.error("Brave headline fetch failed", error);
    return [];
  }
}

export async function getHeroIntel(): Promise<HeroIntel> {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const [pharma, aco] = await Promise.all([
    fetchBraveHeadlines("pharma drug launch FDA approval GLP-1"),
    fetchBraveHeadlines("ACO REACH value-based care pharmacy"),
  ]);

  return {
    generatedAt: formattedDate,
    sections: [
      { label: "Pharma", headlines: pharma },
      { label: "ACO", headlines: aco },
    ],
  };
}
