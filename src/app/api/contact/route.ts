import { NextResponse } from "next/server";
import { addMsg } from "@/lib/chat-server";

// The contact form lands in the same inbox as the shop chat (/chat-admin), as one new conversation per message.
export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as { name?: string; phone?: string; email?: string; message?: string };
  const name = (b.name ?? "").trim().slice(0, 100);
  const phone = (b.phone ?? "").trim().slice(0, 30);
  const email = (b.email ?? "").trim().slice(0, 120);
  const message = (b.message ?? "").trim().slice(0, 1500);
  if (!name || !/^[+\d][\d\s\-+()]{6,}$/.test(phone) || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Please fill in your name, a valid phone number and email." }, { status: 400 });
  }
  const vid = `contact-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  addMsg(vid, "me", `Contact form\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\n\n${message || "(no message)"}`, "/contact");
  return NextResponse.json({ ok: true });
}
