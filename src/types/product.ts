import type { Product } from "@/types/home";

export type ProductPageData = {
  id: string;
  href: string;
  meta: { title: string; description: string; keywords: string; ogImage: string };
  breadcrumb: { label: string; href: string }[];
  heading: string;
  infoClass: string;
  infoHtml: string;
  blocksHtml: string;
  tagsHtml: string;
  related: { moduleId: number; title: string; products: Product[] }[];
  view: ProductView;
};

// The product page as data (made from the scraped HTML by a one-off converter; one file per product in data/pview).
type Pic = { src: string; alt: string; width: number; height: number };
export type ProductView = {
  id: string;
  images: Pic[];
  thumbs: Pic[];
  labels: { out: boolean; text: string }[];
  banner: { href: string; image: Pic | null } | null;
  title: string;
  stats: { cls: string; label: string; value: string; href: string | null; plain: boolean }[];
  minimum: string;
  price: { new: string; old: string; single: string; tax: string; discounts: string[] };
  request: boolean;
  askText: string;
  stepperHidden: boolean;
  features: { title: string; items: { h: string; c: { h: string; c: unknown[] }[] }[]; noExpand: boolean } | null;
  tabs: ProductTab[];
  side: { title: string; items: SideProduct[] } | null;
  tags: { title: string; links: { href: string; text: string }[] } | null;
};
export type ProductTab = {
  title: string;
  active: boolean;
  noExpand?: boolean;
  kind?: "description" | "compat" | "review" | "empty";
  html?: string;
  title2?: string;
  head?: string[];
  rows?: { name: string; href: string; now: string; old: string; single: string }[];
};
export type SideProduct = { href: string; image: Pic | null; name: string; now: string; old: string; single: string; tax: string; out: boolean };
