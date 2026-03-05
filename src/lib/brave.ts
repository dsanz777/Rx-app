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

async function fetchBraveHeadlines(query: string, limit = 3): Promise<Headline[]> {
  const apiKey = process.env.BRAVE_API_KEY;
  console.log("Fetching headlines for query:", query);
  console.log("Brave API key present:", !!apiKey);
  if (!apiKey) {
    console.error("No BRAVE_API_KEY - cannot fetch headlines");
    return [];
  }

  const url = new URL(BRAVE_ENDPOINT);
  url.searchParams.set("q", query);
  url.searchParams.set("count", String(limit));
  url.searchParams.set("freshness", "pd"); // Past day

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-Subscription-Token": apiKey,
      },
      cache: "no-store",
    });

    console.log("Brave API response status:", response.status);

    if (!response.ok) {
      throw new Error(`Brave API failed: ${response.status}`);
    }

    const payload = (await response.json()) as BraveNewsResponse;
    const stories = payload.news?.results ?? [];

    if (!stories.length) {
      console.log("No results for query:", query);
      return [];
    }

    console.log("Fetched", stories.length, "headlines");
    return stories.slice(0, limit).map((story) => ({
      title: story.title,
      url: story.url || story.meta_url?.display_url || "#",
      source:
        story.meta_url?.display_url?.replace(/^www\./, "") ??
        story.meta_url?.source ??
        story.profile?.name ??
        "Brave News",
      publishedAt: story.publishedAt || story.time,
    }));
  } catch (error) {
    console.error("Fetch failed:", error);
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