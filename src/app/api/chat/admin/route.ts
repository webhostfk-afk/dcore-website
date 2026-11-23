import { NextResponse } from "next/server";
import { addMsg, adminOk, listConvs, markRead, readConv, validVid } from "@/lib/chat-server";

// Admin side (needs the key): GET -> list of conversations, GET ?vid -> one conversation (marks it read), POST {vid, text} -> reply.
export function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  if (!adminOk(q.get("key"))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const vid = q.get("vid");
  if (validVid(vid)) {
    markRead(vid);
    return NextResponse.json({ msgs: readConv(vid).msgs });
  }
  return NextResponse.json({ list: listConvs().map((c) => ({ vid: c.vid, updated: c.updated, unread: c.unread, last: c.msgs[c.msgs.length - 1]?.text ?? "", page: [...c.msgs].reverse().find((m) => m.page)?.page ?? "" })) });
}

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as { key?: string; vid?: string; text?: string };
  if (!adminOk(b.key ?? null)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const text = (b.text ?? "").trim();
  if (!validVid(b.vid) || !text) return NextResponse.json({ error: "bad request" }, { status: 400 });
  return NextResponse.json({ msgs: addMsg(b.vid, "team", text).msgs });
}
