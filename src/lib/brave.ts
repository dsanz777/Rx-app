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
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // last 7 days

const resolveSource = (story: BraveNewsResult) =>
  story.meta_url?.display_url?.replace(/^www\./, "") ??
  story.meta_url?.source ??
  story.profile?.name ??
  "News";

const parseRelativeAge = (raw?: string) => {
  if (!raw) return null;
  const normalized = raw.trim().toLowerCase();

  if (/^[a-z]{3}\s\d{1,2},\s?\d{4}$/.test(normalized)) {
    const parsedDate = Date.parse(raw);
    return Number.isNaN(parsedDate) ? null : new Date(parsedDate);
  }

  const relativeMatch = normalized.match(/(\d+)([smhdw])/);
  if (!relativeMatch) return null;
  const value = Number(relativeMatch[1]);
  const unit = relativeMatch[2];
  const now = Date.now();

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
  };

  const ms = multipliers[unit];
  return ms ? new Date(now - value * ms) : null;
};

const toDate = (value?: string) => {
  if (!value) return null;
  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed);
  }
  return parseRelativeAge(value);
};

const resolvePublishedAt = (story: BraveNewsResult) => {
  const candidates = [story.publishedAt, story.time, story.page_age, story.age];

  for (const candidate of candidates) {
    const date = toDate(candidate);
    if (date) return date;
  }

  return null;
};

const isRecent = (story: BraveNewsResult) => {
  const publishedDate = resolvePublishedAt(story);
  if (!publishedDate) return false;
  return Date.now() - publishedDate.getTime() <= MAX_AGE_MS;
};

const normalizeHeadline = (story: BraveNewsResult): Headline => ({
  title: story.title,
  url: story.url || story.meta_url?.display_url || "#",
  source: resolveSource(story),
  publishedAt:
    resolvePublishedAt(story)?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }) ?? undefined,
});

async function tryFetch(query: string, apiKey: string, freshness: "pd" | "pw") {
  const url = new URL(BRAVE_ENDPOINT);
  url.searchParams.set("q", query);
  url.searchParams.set("count", "20");
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

  const payload = (await response.json()) as BraveNewsResponse & { results?: BraveNewsResult[] };
  const stories = payload.news?.results ?? payload.results ?? [];
  console.log(`[Brave] ${query} items=${stories.length}`);

  return stories.filter(isRecent).map(normalizeHeadline);
}

async function fetchSection(query: string) {
  const apiKey = process.env.BRAVE_API_KEY;
  if (!apiKey) {
    console.warn("[Brave] Missing API key");
    return [];
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

  return [];
}

export async function getHeroIntel(): Promise<HeroIntel> {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const [pharma, aco] = await Promise.all([
    fetchSection("pharmaceutical policy GLP-1 FDA news"),
    fetchSection("ACO value based care pharmacy news"),
  ]);

  return {
    generatedAt: formattedDate,
    sections: [
      { label: "Pharma", headlines: pharma },
      { label: "ACO", headlines: aco },
    ],
  };
}
