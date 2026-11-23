import fs from "node:fs";
import path from "node:path";
import type { Category, CatProduct } from "@/types/category";

// The offers of the shop. The products of an offer are taken from the category files (only the ones that have an old price, so that
// every card shows a real discount); the sets are the "Shop by Category" groups on the offer page.
export type OfferSet = { id: string; title: string; blurb: string; category: string };
export type Offer = {
  slug: string;
  title: string;
  short: string;
  from: string; // YYYY-MM-DD
  to: string;
  where: string;
  image: string;
  heading: string;
  text: string[];
  sets: OfferSet[];
};

export const OFFERS: Offer[] = [
  {
    slug: "network-switch-fest",
    title: "Network Switch Fest",
    short: "Up to 5,000 Tk discount on selected switches, SFP modules & network cards!",
    from: "2026-11-10",
    to: "2026-12-10",
    where: "Online",
    image: "/image/offers/network-switch-fest.webp",
    heading: "Network Switch Fest!!!",
    text: ["Buy selected Managed & Unmanaged Switches, SFP Modules and Ethernet Network Cards from dcore and enjoy up to 5,000 Tk discount.", "Order now, before the offer ends..."],
    sets: [
      { id: "switch", title: "Network Switch", blurb: "Enjoy exciting discounts on selected network switches!", category: "networking__network-switch" },
      { id: "sfp", title: "SFP Module", blurb: "Special price on selected SFP modules!", category: "fiber-optic-accessories__sfp-module" },
      { id: "nic", title: "Ethernet Network Adapter", blurb: "Selected network cards with a lower price!", category: "networking__ethernet-network-adapter" },
    ],
  },
  {
    slug: "wifi-router-offer",
    title: "Wi-Fi Router Offer",
    short: "Buy selected Wi-Fi routers & access points and save more!",
    from: "2026-11-15",
    to: "2026-12-15",
    where: "All Outlet",
    image: "/image/offers/wifi-router-offer.webp",
    heading: "Wi-Fi Router Offer!!!",
    text: ["Upgrade your home, office and ISP network with selected Wi-Fi Routers, Access Points and Ethernet Routers at a special price.", "Order now..."],
    sets: [
      { id: "wifi", title: "Wi-Fi Router", blurb: "Blazing-fast Wi-Fi routers with a discount!", category: "networking__wifi-router" },
      { id: "ap", title: "Access Point", blurb: "Selected access points at a special price!", category: "networking__access-point" },
      { id: "router", title: "Ethernet Router", blurb: "Selected Ethernet routers with a lower price!", category: "networking__ethernet-router" },
    ],
  },
  {
    slug: "storage-component-mela",
    title: "Storage & Component Mela",
    short: "Get SSD, Pen Drive and Rack Mount Case at a special price!",
    from: "2026-11-05",
    to: "2026-11-30",
    where: "Online",
    image: "/image/offers/storage-component-mela.webp",
    heading: "Storage & Component Mela!!!",
    text: ["Buy selected SSD, Pen Drive and Rack Mount PC Casing and get an exciting discount.", "Order now..."],
    sets: [
      { id: "ssd", title: "SSD", blurb: "Fast SSDs with a lower price!", category: "component__ssd-solid-state-drive" },
      { id: "pen", title: "Pen Drive", blurb: "Selected pen drives at a special price!", category: "component__pen-drive" },
      { id: "rack", title: "Rack Mount Casing", blurb: "Selected rack mount cases with a discount!", category: "component__rack-mount-pc-casing" },
    ],
  },
  {
    slug: "fttx-olt-deal",
    title: "FTTx & OLT Deal",
    short: "Special price on selected GPON, EPON OLT and PON SFP modules!",
    from: "2026-11-12",
    to: "2026-12-05",
    where: "Online",
    image: "/image/offers/fttx-olt-deal.webp",
    heading: "FTTx & OLT Deal!!!",
    text: ["Grow your fiber network with selected GPON OLT, EPON OLT and PON SFP modules at a special price.", "Order now..."],
    sets: [
      { id: "gpon", title: "GPON OLT", blurb: "Selected GPON OLTs with a discount!", category: "fttx-solution__olt__gpon-olt" },
      { id: "epon", title: "EPON OLT", blurb: "Selected EPON OLTs with a lower price!", category: "fttx-solution__olt__epon-olt" },
      { id: "pon", title: "PON SFP Module", blurb: "Selected PON SFP modules at a special price!", category: "fttx-solution__pon-sfp-module" },
    ],
  },
  {
    slug: "ups-power-offer",
    title: "UPS & Power Offer",
    short: "Keep your network running with a discount on selected UPS!",
    from: "2026-11-18",
    to: "2026-12-18",
    where: "All Outlet",
    image: "/image/offers/ups-power-offer.webp",
    heading: "UPS & Power Offer!!!",
    text: ["Buy selected Online UPS, IPS and Power Cords and get an exciting discount.", "Order now..."],
    sets: [
      { id: "online", title: "Online UPS", blurb: "Selected online UPS at a special price!", category: "ups-and-ips__online-ups" },
      { id: "ups", title: "UPS & IPS", blurb: "Selected UPS and IPS with a discount!", category: "ups-and-ips" },
      { id: "cord", title: "Power Cord", blurb: "Selected power cords with a lower price!", category: "accessories__power-cord" },
    ],
  },
  {
    slug: "fiber-optic-offer",
    title: "Fiber Optic Offer",
    short: "Patch cords, power meters and joint boxes at a special price!",
    from: "2026-11-01",
    to: "2026-11-30",
    where: "Online",
    image: "/image/offers/fiber-optic-offer.webp",
    heading: "Fiber Optic Offer!!!",
    text: ["Buy selected Fiber Optic Patch Cords, Optical Power Meters and Joint Enclosures and get an exciting discount.", "Order now..."],
    sets: [
      { id: "patch", title: "Fiber Optic Patch Cord", blurb: "Selected patch cords with a discount!", category: "fiber-optic-accessories__fiber-optic-patch-cord" },
      { id: "opm", title: "Optical Power Meter", blurb: "Selected power meters at a special price!", category: "fiber-optic-accessories__optical-power-meter" },
      { id: "joint", title: "Fiber Joint Enclosure", blurb: "Selected joint boxes with a lower price!", category: "fiber-optic-accessories__fiber-joint-enclosure-tj-box" },
    ],
  },
];

export const getOffer = (slug: string) => OFFERS.find((o) => o.slug === slug) ?? null;

const dir = path.join(process.cwd(), "src/data/categories");

// The discounted products of a category file (a product with an old price and a price), most discounted first.
export function offerProducts(category: string, n = 12): CatProduct[] {
  const file = path.join(dir, category + ".json");
  if (!fs.existsSync(file)) return [];
  const c = JSON.parse(fs.readFileSync(file, "utf8")) as Category;
  const num = (s: string | null) => (s ? Number(s.replace(/[^\d.]/g, "")) || 0 : 0);
  return c.products
    .filter((p) => p.price && p.oldPrice && num(p.oldPrice) > num(p.price) && num(p.price) > 0)
    .sort((a, b) => num(b.oldPrice) / num(b.price) - num(a.oldPrice) / num(a.price))
    .slice(0, n);
}

// "2026-11-30" -> "30 Nov 2026"
export const dateText = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
