import { NextResponse } from "next/server";
import { currentUser, writeDb } from "@/lib/auth-server";

const no = () => NextResponse.json({ error: "Please login." }, { status: 401 });

export async function GET() {
  const c = await currentUser();
  if (!c) return no();
  const orders = c.db.orders.filter((o) => o.userId === c.user.id).sort((a, b) => b.createdAt - a.createdAt);
  return NextResponse.json({ orders });
}

// The customer can cancel an order that has not been processed yet.
export async function POST(req: Request) {
  const c = await currentUser();
  if (!c) return no();
  const b = (await req.json().catch(() => ({}))) as { id?: string };
  const o = c.db.orders.find((x) => x.id === b.id && x.userId === c.user.id);
  if (!o) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  if (o.status !== "pending") return NextResponse.json({ error: "This order is already being processed. Please call us to cancel it." }, { status: 400 });
  o.status = "cancelled";
  writeDb(c.db);
  return NextResponse.json({ order: o });
}
