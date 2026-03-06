type BraveNewsResult = {
  title: string;
  url: string;
  publishedAt?: string;
  time?: string;
  page_age?: string;
  age?: string;
  meta_url?: {
    display_url?: string;
    hostname?: string;
    netloc?: string;
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

type SectionConfig = {
  queries: string[];
  include: string[];
  exclude?: string[];
};

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
  story.meta_url?.hostname?.replace(/^www\./, "") ??
  story.meta_url?.netloc?.replace(/^www\./, "") ??
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

const normalizeHeadline = (story: BraveNewsResult): Headline => {
  const publishedDate = resolvePublishedAt(story);
  return {
    title: story.title,
    url: story.url || story.meta_url?.display_url || "#",
    source: resolveSource(story),
    publishedAt: publishedDate?.toISOString(),
  };
};

const normalizeUrlForDedup = (url: string) =>
  url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/?$/, "");

const filterHeadlines = (headlines: Headline[], include: string[], exclude: string[] = []) => {
  if (!include.length && !exclude.length) {
    return headlines;
  }

  const includes = include.map((token) => token.toLowerCase());
  const excludes = exclude.map((token) => token.toLowerCase());

  return headlines.filter((headline) => {
    const haystack = `${headline.title} ${headline.source}`.toLowerCase();
    if (excludes.some((token) => haystack.includes(token))) {
      return false;
    }
    if (!includes.length) {
      return true;
    }
    return includes.some((token) => haystack.includes(token));
  });
};

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

async function fetchSection(config: SectionConfig) {
  const apiKey = process.env.BRAVE_API_KEY;
  if (!apiKey) {
    console.warn("[Brave] Missing API key");
    return [];
  }

  const { queries, include, exclude = [] } = config;
  const buckets: Headline[][] = [];

  for (const query of queries) {
    let bucket: Headline[] = [];
    for (const freshness of ["pd", "pw"] as const) {
      try {
        const headlines = filterHeadlines(await tryFetch(query, apiKey, freshness), include, exclude);
        if (headlines.length) {
          bucket = headlines;
          break;
        }
      } catch (error) {
        console.error("[Brave] fetch failed", error);
      }
    }
    buckets.push(bucket);
  }

  const seen = new Set<string>();
  const collected: Headline[] = [];

  while (collected.length < 3) {
    let added = false;

    for (const bucket of buckets) {
      while (bucket.length) {
        const headline = bucket.shift()!;
        const dedupKey = normalizeUrlForDedup(headline.url);
        if (seen.has(dedupKey)) {
          continue;
        }
        seen.add(dedupKey);
        collected.push(headline);
        added = true;
        break;
      }

      if (collected.length >= 3) {
        break;
      }
    }

    if (!added) {
      break;
    }
  }

  return collected;
}

export async function getHeroIntel(): Promise<HeroIntel> {
  const estFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  });
  const formattedDate = estFormatter.format(new Date());

  const [pharma, aco] = await Promise.all([
    fetchSection({
      queries: [
        "pharmacy industry FDA reimbursement news",
        "drug pricing PBM policy update",
        "specialty pharmacy reimbursement news",
      ],
      include: ["pharmacy", "drug", "fda", "pbm", "pricing", "specialty"],
      exclude: ["glp-1", "ozempic", "wegovy"],
    }),
    fetchSection({
      queries: [
        "MSSP accountable care organization CMS news",
        "value based care ACO Medicare shared savings",
        "ACO REACH pharmacy operations CMS",
      ],
      include: ["aco", "value based", "mssp", "medicare", "cms", "shared savings"],
    }),
  ]);

  return {
    generatedAt: formattedDate,
    sections: [
      { label: "Pharma", headlines: pharma },
      { label: "ACO", headlines: aco },
    ],
  };
}
