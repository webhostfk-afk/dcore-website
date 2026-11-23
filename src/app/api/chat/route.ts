import { NextResponse } from "next/server";
import { addMsg, readConv, validVid } from "@/lib/chat-server";

// Visitor side: GET ?vid=... returns the conversation; POST {vid, text, page} adds a message.
export function GET(req: Request) {
  const vid = new URL(req.url).searchParams.get("vid");
  if (!validVid(vid)) return NextResponse.json({ msgs: [] });
  return NextResponse.json({ msgs: readConv(vid).msgs });
}

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as { vid?: string; text?: string; page?: string };
  const text = (b.text ?? "").trim();
  if (!validVid(b.vid) || !text) return NextResponse.json({ error: "bad request" }, { status: 400 });
  return NextResponse.json({ msgs: addMsg(b.vid, "me", text, b.page).msgs });
}
