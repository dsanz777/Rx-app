import { NextResponse } from "next/server";
import { medicationDataset } from "@/data/medications";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const limit = Math.min(Number(searchParams.get("limit") ?? 10) || 10, 50);

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const results = medicationDataset
    .filter((item) => {
      const haystack = [item.name, item.class, ...item.keywords].join(" ").toLowerCase();
      return haystack.includes(q);
    })
    .slice(0, limit)
    .map((item) => ({
      slug: item.slug,
      name: item.name,
      class: item.class,
      summary: item.summary,
    }));

  return NextResponse.json({ results });
}
