import { allProducts } from "@/lib/catalog";
import type { Category, CatProduct, FilterGroup } from "@/types/category";

export type Brand = { name: string; slug: string; products: CatProduct[] };

const num = (s: string | null) => (s ? Number(s.replace(/[^\d.]/g, "")) || 0 : 0);
export const slugify = (s: string) => s.toLowerCase().replace(/^d core$/, "dcore").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

let cache: Map<string, Brand> | null = null;

// Every brand of the shop, built from the products' brand field. A brand's address is /<slug> (like Start Tech).
export function allBrands(): Map<string, Brand> {
  if (cache) return cache;
  // the address of a brand is /<slug of its name>
  const bySlug = new Map<string, Brand>();
  for (const p of allProducts()) {
    const name = p.brand?.name.trim();
    if (!name) continue;
    const slug = slugify(name);
    const b = bySlug.get(slug) ?? { name, slug, products: [] };
    b.products.push(p);
    bySlug.set(slug, b);
  }
  cache = bySlug;
  return cache;
}

export const getBrand = (slug: string) => allBrands().get(slug) ?? null;

// The brand page is a category-like listing so the same list / filter / sort components draw it.
export function brandCategory(b: Brand): Category {
  const products = [...b.products].sort((a, c) => num(a.price) - num(c.price));
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
  return {
    href: "/" + b.slug,
    meta: {
      title: `${b.name} Price in Bangladesh | D CORE Solutions`,
      description: `Buy ${b.name} products at the best price in Bangladesh from D CORE Solutions. Genuine products, clear prices and expert support.`,
      keywords: `${b.name}, ${b.name} price in Bangladesh, D CORE`,
      ogImage: "",
    },
    breadcrumb: [
      { label: "home", href: "/" },
      { label: "Brand", href: "/brands" },
      { label: b.name, href: "/" + b.slug },
    ],
    heading: b.name,
    total: products.length,
    filters,
    products,
  };
}

// Brands grouped by first letter for the brand index (0 - 9, A ... Z).
export function brandIndex(): { letter: string; brands: Brand[] }[] {
  const groups = new Map<string, Brand[]>();
  for (const b of allBrands().values()) {
    const c = b.name.trim()[0]?.toUpperCase() ?? "#";
    const k = /[A-Z]/.test(c) ? c : "0 - 9";
    groups.set(k, [...(groups.get(k) ?? []), b]);
  }
  return [...groups]
    .map(([letter, brands]) => ({ letter, brands: brands.sort((a, b) => a.name.localeCompare(b.name)) }))
    .sort((a, b) => (a.letter === "0 - 9" ? -1 : b.letter === "0 - 9" ? 1 : a.letter.localeCompare(b.letter)));
}
