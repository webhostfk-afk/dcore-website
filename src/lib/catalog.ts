import fs from "node:fs";
import path from "node:path";
import { allCategorySlugs, getCategory } from "@/lib/categories";
import type { Category, CatProduct, FilterGroup } from "@/types/category";

let cache: CatProduct[] | null = null;

// Every product of every category, once (products listed in several categories are kept once).
export function allProducts(): CatProduct[] {
  if (cache) return cache;
  const seen = new Map<string, CatProduct>();
  for (const slug of allCategorySlugs().sort((a, b) => a.length - b.length)) {
    const c = getCategory(slug);
    if (!c) continue;
    for (const p of c.data.products) if (!seen.has(p.id)) seen.set(p.id, p);
  }
  cache = [...seen.values()];
  return cache;
}

const num = (s: string | null) => (s ? Number(s.replace(/[^\d.]/g, "")) || 0 : 0);

// The shop's search also looks at a product's tags (the links under the product); they are kept in the product page data.
let tagCache: Map<string, string> | null = null;
function tagsOf(id: string): string {
  if (!tagCache) tagCache = new Map();
  let t = tagCache.get(id);
  if (t === undefined) {
    try {
      const v = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/data/pview", `${id}.json`), "utf8"));
      t = ((v.tags?.links ?? []) as { text: string }[]).map((l) => l.text).join(" ").toLowerCase();
    } catch {
      t = "";
    }
    tagCache.set(id, t);
  }
  return t;
}

export function searchProducts(q: string): CatProduct[] {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return allProducts().filter((p) => {
    const hay = `${p.name} ${p.model ?? ""} ${p.brand?.name ?? ""} ${tagsOf(p.id)}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

// The results as a "category" so the same list / filter / sort / pagination components draw it.
export function searchCategory(q: string): Category {
  // like the shop's default listing: cheapest first
  const products = [...searchProducts(q)].sort((a, b) => num(a.price) - num(b.price));
  const prices = products.map((p) => num(p.price)).filter((n) => n > 0);
  const filters: FilterGroup[] = [{ code: "p", title: "Price", type: "price", min: prices.length ? Math.min(...prices) : 0, max: prices.length ? Math.max(...prices) : 0 }];
  const inStock = products.filter((p) => p.label !== "Out Of Stock").map((p) => p.id);
  const outStock = products.filter((p) => p.label === "Out Of Stock").map((p) => p.id);
  filters.push({
    code: "q",
    title: "Availability",
    type: "checkbox",
    options: [
      { value: "1", label: "In Stock", count: inStock.length, ids: inStock },
      { value: "0", label: "Out of Stock", count: outStock.length, ids: outStock },
    ],
  });
  const brands = new Map<string, string[]>();
  for (const p of products) if (p.brand) brands.set(p.brand.name, [...(brands.get(p.brand.name) ?? []), p.id]);
  if (brands.size)
    filters.push({
      code: "m",
      title: "Brand",
      type: "checkbox",
      options: [...brands.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([name, ids], i) => ({ value: String(i + 1), label: name, count: ids.length, ids })),
    });
  return {
    href: "/search",
    meta: { title: `Search - ${q}`, description: "", keywords: "", ogImage: "" },
    breadcrumb: [],
    heading: `Search - ${q}`,
    total: products.length,
    filters,
    products,
  };
}
