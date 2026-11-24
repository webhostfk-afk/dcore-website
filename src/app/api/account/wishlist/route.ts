import { NextResponse } from "next/server";
import { currentUser, writeDb } from "@/lib/auth-server";
import { allProducts } from "@/lib/catalog";
import index from "@/data/products-index.json";

const no = () => NextResponse.json({ error: "Please login." }, { status: 401 });

const cards = (ids: string[]) => {
  const by = new Map(allProducts().map((p) => [p.id, p]));
  return ids.flatMap((id) => {
    const p = by.get(id);
    return p ? [{ id: p.id, name: p.name, href: p.href, image: p.image?.src ?? "", price: p.price, oldPrice: p.oldPrice, requestPrice: p.requestPrice }] : [];
  });
};

export async function GET() {
  const c = await currentUser();
  if (!c) return no();
  return NextResponse.json({ ids: c.user.wishlist, products: cards(c.user.wishlist) });
}

// POST {id or href} toggles a product, {id, remove:true} removes it.
export async function POST(req: Request) {
  const c = await currentUser();
  if (!c) return no();
  const b = (await req.json().catch(() => ({}))) as { id?: string; href?: string; remove?: boolean };
  // the product is named by its id, or by its page address (the buttons on the pages know the address)
  const slug = String(b.href ?? "").split(/[?#]/)[0].split("/").filter(Boolean).pop() ?? "";
  const id = String(b.id ?? "") || (index as Record<string, string>)[slug] || "";
  if (!id) return NextResponse.json({ error: "Bad request." }, { status: 400 });
  const has = c.user.wishlist.includes(id);
  c.user.wishlist = has || b.remove ? c.user.wishlist.filter((x) => x !== id) : [...c.user.wishlist, id].slice(-200);
  writeDb(c.db);
  return NextResponse.json({ ids: c.user.wishlist, added: !has && !b.remove });
}
