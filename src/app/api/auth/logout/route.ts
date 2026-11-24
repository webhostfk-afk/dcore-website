import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE, readDb, writeDb } from "@/lib/auth-server";

export async function POST() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    const db = readDb();
    db.sessions = db.sessions.filter((s) => s.token !== token);
    writeDb(db);
  }
  jar.delete(COOKIE);
  return NextResponse.json({ ok: true });
}
