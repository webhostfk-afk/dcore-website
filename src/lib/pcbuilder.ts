import fs from "node:fs";
import path from "node:path";
import type { Category } from "@/types/category";

// The PC Builder: every part (slot) takes its products from one category file.
export type Slot = { id: string; name: string; icon: string; category: string; required?: boolean; group: "core" | "other" };
export type BuilderProduct = { id: string; name: string; href: string; image: string; price: number; oldPrice: number; brand: string; model: string };

export const SLOTS: Slot[] = [
  { id: "cpu", name: "CPU", icon: "cpu", category: "component__processor", required: true, group: "core" },
  { id: "cooler", name: "CPU Cooler", icon: "cooler", category: "component__cpu-cooler", group: "core" },
  { id: "board", name: "Motherboard", icon: "board", category: "component__motherboard", required: true, group: "core" },
  { id: "ram", name: "RAM", icon: "ram", category: "component__ram", required: true, group: "core" },
  { id: "storage", name: "Storage", icon: "storage", category: "component__ssd-solid-state-drive", required: true, group: "core" },
  { id: "psu", name: "Power Supply", icon: "psu", category: "component__power-supply", group: "core" },
  { id: "case", name: "Casing", icon: "case", category: "component__casing", group: "core" },
  { id: "monitor", name: "Monitor", icon: "monitor", category: "component__monitor", group: "other" },
  { id: "fan", name: "Casing Cooler", icon: "fan", category: "component__casing-cooler", group: "other" },
  { id: "keyboard", name: "Keyboard", icon: "keyboard", category: "component__keyboard", group: "other" },
  { id: "paste", name: "Thermal Paste", icon: "paste", category: "component__thermal-paste", group: "other" },
];

const dir = path.join(process.cwd(), "src/data/categories");
const num = (s: string | null) => (s ? Number(s.replace(/[^\d.]/g, "")) || 0 : 0);

// The products of every slot (only the ones that have a price, because a part without a price cannot be added to the cart).
export function builderProducts(): Record<string, BuilderProduct[]> {
  const out: Record<string, BuilderProduct[]> = {};
  for (const s of SLOTS) {
    const file = path.join(dir, s.category + ".json");
    if (!fs.existsSync(file)) {
      out[s.id] = [];
      continue;
    }
    const c = JSON.parse(fs.readFileSync(file, "utf8")) as Category;
    out[s.id] = c.products
      .filter((p) => num(p.price) > 0)
      .map((p) => ({ id: p.id, name: p.name, href: p.href, image: p.image?.src ?? "", price: num(p.price), oldPrice: num(p.oldPrice), brand: p.brand?.name ?? "", model: p.model ?? "" }));
  }
  return out;
}
