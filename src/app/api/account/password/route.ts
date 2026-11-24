import { NextResponse } from "next/server";
import { checkPassword, currentUser, hashPassword, writeDb } from "@/lib/auth-server";

export async function POST(req: Request) {
  const c = await currentUser();
  if (!c) return NextResponse.json({ error: "Please login." }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as { current?: string; next?: string };
  if (!checkPassword(c.user, b.current ?? "")) return NextResponse.json({ error: "Your current password is not correct." }, { status: 400 });
  if ((b.next ?? "").length < 8) return NextResponse.json({ error: "The new password must be at least 8 characters." }, { status: 400 });
  Object.assign(c.user, hashPassword(b.next!));
  writeDb(c.db);
  return NextResponse.json({ ok: true });
}
