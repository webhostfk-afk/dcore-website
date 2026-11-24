import fs from "node:fs";
import path from "node:path";
import index from "@/data/blog-index.json";

export type BlogCard = { slug: string; title: string; intro: string; date: string; published: string; read: string; cats: string[]; thumb: string; hero: string };
export type BlogPost = BlogCard & { summary: string; updated: string; tags: string[]; html: string };
export const BLOG_CATS = index.cats as Record<string, { name: string; count: number }>;
export const CAT_ICONS: Record<string, string> = {
  "best-products": "/image/blog-cat/top-picks.png",
  comparisons: "/image/blog-cat/comparism.png",
  "buying-guides": "/image/blog-cat/buying-guides.png",
  "tech-trends": "/image/blog-cat/reviews.png",
};
export const allPosts = (): BlogCard[] => index.posts as BlogCard[];
export const postsOf = (cat: string) => allPosts().filter((p) => p.cats.includes(cat));
export function getPost(slug: string): BlogPost | null {
  const f = path.join(process.cwd(), "src/data/blog", slug + ".json");
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(f)) return null;
  return JSON.parse(fs.readFileSync(f, "utf8")) as BlogPost;
}
export const catName = (c: string) => BLOG_CATS[c]?.name ?? c;
