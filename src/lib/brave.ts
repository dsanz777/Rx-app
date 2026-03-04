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
const DEFAULT_HEADLINES: Record<string, Headline[]> = {
pharma: [
{
title: "Reuters Health & Pharma News",
url: "https://www.reuters.com/business/healthcare-pharmaceuticals/",
source: "Reuters",
publishedAt: "16 hours ago",
},
{
title: "Pharmacy Times – Pharmacy Practice News and Expert Insights",
url: "https://www.pharmacytimes.com/",
source: "Pharmacy Times",
publishedAt: "1 day ago",
},
{
title: "Reuters Health News",
url: "https://www.reuters.com/legal/health/",
source: "Reuters",
publishedAt: "1 hour ago",
},
{
title: "Merck and Mayo Clinic Announce New Research and Development Collaboration",
url: "https://www.merck.com/news/merck-and-mayo-clinic-announce-new-research-and-development-collaboration-to-support-ai-enabled-drug-discovery-and-precision-medicine/",
source: "Merck",
publishedAt: "2 days ago",
},
{
title: "News | PharmExec",
url: "https://www.pharmexec.com/news",
source: "PharmExec",
publishedAt: "11 hours ago",
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
title: "The Year of PBM Reform? Recent Legal Developments",
url: "https://www.ropesgray.com/en/insights/alerts/2026/02/the-year-of-pbm-reform-against-a-backdrop-of-legislative-and-government-enforcement-attention-the-do",
source: "Ropes & Gray",
publishedAt: "4 days ago",
},
{
title: "Pharmalittle: Trump's MFN deals, 340B controversies",
url: "https://www.statnews.com/pharmalot/2026/03/02/trump-europe-pharma-prices-340b-pharmacies-merck-glp1/",
source: "STAT News",
publishedAt: "3 hours ago",
},
],
};

async function fetchBraveHeadlines(query: string, fallbackKey: "pharma" | "aco", limit = 3): Promise<Headline[]> {
const apiKey = process.env.BRAVE_API_KEY;
console.log("Brave API key present:", !!apiKey);
if (!apiKey) {
console.log("Using fallback headlines - no API key");
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
});

    if (!response.ok) {
      throw new Error(`Brave API failed: ${response.status}`);
    }

    const payload = (await response.json()) as BraveNewsResponse;
    const stories = payload.news?.results ?? [];

    if (!stories.length) {
      console.log("Brave API returned no results for query:", query);
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
      publishedAt: story.publishedAt || story.time,
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
