import { NextResponse } from "next/server";
import { currentUser, nextOrderNumber, readDb, uid, validEmail, validPhone, writeDb, type Order } from "@/lib/auth-server";
import { allProducts } from "@/lib/catalog";

// The checkout posts the order here. A guest order is kept too; it joins an account that is made later with the same phone number.
export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const s = (k: string, n = 200) => String(b[k] ?? "").trim().slice(0, n);
  const name = s("name", 80), phone = s("phone", 20), email = s("email", 120).toLowerCase();
  if (!name || !validPhone(phone) || !validEmail(email) || s("address", 200).length < 3) return NextResponse.json({ error: "Please check your name, phone, email and address." }, { status: 400 });
  // prices come from the shop's own catalogue, not from the browser
  const by = new Map(allProducts().map((p) => [p.id, p]));
  const num = (v: string | null) => (v ? Number(v.replace(/[^\d.]/g, "")) || 0 : 0);
  const raw = Array.isArray(b.items) ? (b.items as { id?: string; qty?: number }[]) : [];
  const items = raw.flatMap((i) => {
    const p = by.get(String(i.id));
    const qty = Math.floor(Number(i.qty));
    if (!p || !(qty >= 1) || qty > 999) return [];
    return [{ id: p.id, name: p.name, href: p.href, image: p.image?.src ?? "", price: num(p.price), qty }];
  });
  if (!items.length) return NextResponse.json({ error: "Your shopping cart is empty." }, { status: 400 });
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const shippingFee = Math.max(0, Math.min(5000, Number(b.shippingFee) || 0));
  const c = await currentUser();
  const db = c?.db ?? readDb();
  const order: Order = {
    id: uid(),
    number: nextOrderNumber(db),
    userId: c?.user.id ?? null,
    name,
    phone,
    email,
    address: s("address"),
    city: s("city", 60),
    region: s("region", 60),
    shipping: s("shipping", 60),
    payment: s("payment", 60),
    comment: s("comment", 500),
    items,
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
    status: "pending",
    createdAt: Date.now(),
  };
  db.orders.push(order);
  // a signed-in customer without a saved address gets the delivery address as the default
  if (c && !c.user.address) Object.assign(c.user, { address: order.address, city: order.city, region: order.region });
  writeDb(db);
  return NextResponse.json({ number: order.number, total: order.total });
}
