import { NextResponse } from "next/server";
import { addMsg } from "@/lib/chat-server";
import { normPhone, validPhone } from "@/lib/auth-server";

// There is no SMS service yet: a password reset request goes to the shop inbox (/chat-admin) and the team calls the customer.
export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as { phone?: string };
  if (!validPhone(b.phone ?? "")) return NextResponse.json({ error: "Enter the mobile number of your account (01XXXXXXXXX)." }, { status: 400 });
  const vid = `reset-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  addMsg(vid, "me", `Password reset request\nPhone: ${normPhone(b.phone!)}`, "/forgotten");
  return NextResponse.json({ ok: true });
}
