import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/catalog";

// Suggestions for the header search box.
export function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  const list = q.trim().length < 2 ? [] : searchProducts(q).slice(0, 5);
  return NextResponse.json(
    list.map((p) => ({ id: p.id, name: p.name, href: p.href, image: p.image?.src ?? "", price: p.price, oldPrice: p.oldPrice, requestPrice: p.requestPrice })),
  );
}
