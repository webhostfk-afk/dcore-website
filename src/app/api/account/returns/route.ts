import { NextResponse } from "next/server";
import { RETURN_DAYS, currentUser, returnable, uid, writeDb, type ReturnReq } from "@/lib/auth-server";

const no = () => NextResponse.json({ error: "Please login." }, { status: 401 });

export async function GET() {
  const c = await currentUser();
  if (!c) return no();
  return NextResponse.json({
    windowDays: RETURN_DAYS,
    requests: c.db.returns.filter((r) => r.userId === c.user.id).sort((a, b) => b.createdAt - a.createdAt),
    eligible: returnable(c.db, c.user.id),
  });
}

// POST {orderId, reason, details, items:[{id, qty}]}
export async function POST(req: Request) {
  const c = await currentUser();
  if (!c) return no();
  const b = (await req.json().catch(() => ({}))) as { orderId?: string; reason?: string; details?: string; items?: { id: string; qty: number }[] };
  const order = returnable(c.db, c.user.id).find((o) => o.id === b.orderId);
  if (!order) return NextResponse.json({ error: `Nothing can be returned for this order. A product can be returned within ${RETURN_DAYS} days after delivery.` }, { status: 400 });
  const details = (b.details ?? "").trim().slice(0, 600);
  if (details.length < 5) return NextResponse.json({ error: "Please tell us what is wrong with the product." }, { status: 400 });
  const made: ReturnReq[] = [];
  for (const it of b.items ?? []) {
    const line = order.items.find((i) => i.id === it.id);
    const qty = Math.floor(Number(it.qty));
    if (!line || !(qty >= 1) || qty > line.left) continue;
    const n = c.db.seq + 1;
    c.db.seq = n;
    made.push({ id: uid(), number: `RT${String(n).padStart(5, "0")}`, userId: c.user.id, orderId: order.id, orderNumber: order.number, itemId: line.id, product: line.name, qty, reason: String(b.reason ?? "other").slice(0, 40), details, status: "requested", createdAt: Date.now() });
  }
  if (!made.length) return NextResponse.json({ error: "Tick the product you want to return." }, { status: 400 });
  c.db.returns.push(...made);
  writeDb(c.db);
  return NextResponse.json({ requests: made });
}
