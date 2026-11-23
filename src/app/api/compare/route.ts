import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import index from "@/data/products-index.json";

const dir = path.join(process.cwd(), "src/data/pview");
const strip = (h: string) => h.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
const norm = (s: string) => {
  let v = s;
  try {
    v = decodeURIComponent(s);
  } catch {}
  return v.normalize("NFC").toLowerCase();
};

// Details of the products in the comparison table (model, brand, availability and the key features), read from the product files.
// `ids` and `slugs` go together (same order): the product file is found by the id, or else by the last part of the product link.
export function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const ids = (q.get("ids") ?? "").split(",").slice(0, 4);
  const slugs = (q.get("slugs") ?? "").split(",");
  const out: Record<string, { model: string; brand: string; stock: string; features: string[] }> = {};
  ids.forEach((id, i) => {
    let file = /^\d+$/.test(id) ? path.join(dir, `${id}.json`) : "";
    if (!file || !fs.existsSync(file)) {
      const real = (index as Record<string, string>)[norm(slugs[i] ?? "")];
      file = real ? path.join(dir, `${real}.json`) : "";
    }
    if (!file || !fs.existsSync(file)) return;
    const v = JSON.parse(fs.readFileSync(file, "utf8"));
    const stats: { cls: string; value: string }[] = v.stats ?? [];
    const model = stats.find((s) => /model/.test(s.cls))?.value.replace(/^\s*Model\s*:\s*/i, "") ?? "";
    const brand = stats.find((s) => /manufacturer/.test(s.cls))?.value ?? "";
    const stock = stats.some((s) => /out-of-stock/.test(s.cls)) ? "Out Of Stock" : "In Stock";
    const features: string[] = (v.features?.items ?? []).map((x: { h: string }) => strip(x.h)).filter(Boolean).slice(0, 30);
    out[id] = { model, brand, stock, features };
  });
  return NextResponse.json(out);
}
