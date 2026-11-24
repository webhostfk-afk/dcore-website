import { NextResponse } from "next/server";
import { checkPassword, newSession, normPhone, publicUser, readDb, setSessionCookie, writeDb } from "@/lib/auth-server";

// A small brake against guessing passwords: 8 wrong tries per sign-in name in 10 minutes.
const tries = new Map<string, { n: number; t: number }>();

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as { username?: string; password?: string };
  const name = (b.username ?? "").trim().toLowerCase();
  const key = name || "-";
  const now = Date.now();
  const t = tries.get(key);
  if (t && now - t.t < 600000 && t.n >= 8) return NextResponse.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
  const db = readDb();
  const phone = normPhone(name);
  const user = db.users.find((u) => u.phone === phone || u.email === name || u.username === name);
  if (!user || !checkPassword(user, b.password ?? "")) {
    tries.set(key, { n: t && now - t.t < 600000 ? t.n + 1 : 1, t: t && now - t.t < 600000 ? t.t : now });
    return NextResponse.json({ error: "Warning: No match for Phone/E-Mail and/or Password." }, { status: 401 });
  }
  tries.delete(key);
  const token = newSession(db, user.id);
  writeDb(db);
  await setSessionCookie(token);
  return NextResponse.json({ user: publicUser(user) });
}
