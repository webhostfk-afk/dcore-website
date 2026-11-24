import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/catalog";

// Suggestions for the header search box: the first 10 matches and how many there are in all.
export function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  const hits = q.trim().length < 2 ? [] : searchProducts(q);
  return NextResponse.json({
    total: hits.length,
    items: hits
      .slice(0, 10)
      .map((p) => ({ id: p.id, name: p.name, href: p.href, image: p.image?.src ?? "", price: p.price, oldPrice: p.oldPrice, requestPrice: p.requestPrice, label: p.label })),
  });
}
