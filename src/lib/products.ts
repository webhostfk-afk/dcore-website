import fs from "node:fs";
import path from "node:path";
import index from "@/data/products-index.json";
import type { ProductPageData } from "@/types/product";

const dir = path.join(process.cwd(), "src/data/products");
const viewDir = path.join(process.cwd(), "src/data/pview");
const norm = (s: string) => {
  let v = s;
  try {
    v = decodeURIComponent(s);
  } catch {}
  return v.normalize("NFC").toLowerCase();
};

// Product pages are found by the last part of the URL (the shop serves /product-name as well as /category/product-name).
export function getProduct(slug: string[]): ProductPageData | null {
  const id = (index as Record<string, string>)[norm(slug[slug.length - 1])];
  if (!id) return null;
  const file = path.join(dir, `${id}.json`);
  if (!fs.existsSync(file)) return null;
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as Omit<ProductPageData, "view">;
  const view = JSON.parse(fs.readFileSync(path.join(viewDir, `${id}.json`), "utf8"));
  return { ...data, view } as ProductPageData;
}

export function allProductSlugs(): string[][] {
  return Object.keys(index as Record<string, string>).map((k) => [encodeURIComponent(k)]);
}
