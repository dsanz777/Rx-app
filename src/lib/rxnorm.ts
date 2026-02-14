import { medicationDataset } from "@/data/medications";

const slugToName = new Map(medicationDataset.map((item) => [item.slug.toLowerCase(), item.name]));

export type RxCuiLookup = {
  name: string;
  rxcui: string | null;
};

export async function lookupRxCui(drugInput: string): Promise<RxCuiLookup> {
  const trimmed = drugInput.trim();
  const normalized = trimmed.toLowerCase();
  const fallbackName = slugToName.get(normalized) ?? trimmed;

  const url = new URL("https://rxnav.nlm.nih.gov/REST/rxcui.json");
  url.searchParams.set("name", fallbackName);
  url.searchParams.set("search", "1");

  const response = await fetch(url, { cache: "force-cache" });
  if (!response.ok) {
    return { name: fallbackName, rxcui: null };
  }

  const data = (await response.json()) as {
    idGroup?: {
      rxnormId?: string[];
    };
  };

  const rxcui = data.idGroup?.rxnormId?.[0] ?? null;
  return { name: fallbackName, rxcui };
}
