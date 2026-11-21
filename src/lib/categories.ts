import fs from "node:fs";
import path from "node:path";
import type { Category, CategoryExtra } from "@/types/category";
import extras from "@/data/categories-extra.json";

const dir = path.join(process.cwd(), "src/data/categories");
const keyOf = (slug: string[]) => slug.map(decodeURIComponent).join("__");

export function getCategory(slug: string[]): { data: Category; extra: CategoryExtra | null } | null {
  const file = path.join(dir, keyOf(slug) + ".json");
  if (!fs.existsSync(file)) return null;
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as Category;
  const extra = (extras as Record<string, CategoryExtra>)["/" + slug.join("/")] ?? null;
  return { data, extra };
}

export function allCategorySlugs(): string[][] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "").split("__"));
}

// Products of the same category as `productId` (deepest category that lists it), starting after the product itself.
let byProduct: Map<string, string> | null = null;
export function siblingProducts(productId: string, n: number) {
  if (!byProduct) {
    byProduct = new Map();
    for (const slug of allCategorySlugs().sort((a, b) => a.length - b.length)) {
      const c = getCategory(slug);
      if (!c) continue;
      for (const p of c.data.products) byProduct.set(p.id, slug.join("__")); // deeper categories come later and win
    }
  }
  const key = byProduct.get(productId);
  if (!key) return [];
  const c = getCategory(key.split("__"));
  if (!c) return [];
  const list = c.data.products;
  const i = list.findIndex((p) => p.id === productId);
  const rotated = i >= 0 ? [...list.slice(i + 1), ...list.slice(0, i)] : list;
  return rotated.slice(0, n);
}
