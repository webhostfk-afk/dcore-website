import { NextResponse } from "next/server";
import { hashPassword, newSession, normPhone, publicUser, readDb, setSessionCookie, uid, validEmail, validPhone, writeDb, type User } from "@/lib/auth-server";

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, string>;
  const firstname = (b.firstname ?? "").trim().slice(0, 40);
  const lastname = (b.lastname ?? "").trim().slice(0, 40);
  const email = (b.email ?? "").trim().toLowerCase().slice(0, 120);
  const password = b.password ?? "";
  if (!firstname) return NextResponse.json({ error: "First Name is required." }, { status: 400 });
  if (!validEmail(email)) return NextResponse.json({ error: "E-Mail Address does not appear to be valid." }, { status: 400 });
  if (!validPhone(b.telephone ?? "")) return NextResponse.json({ error: "Enter a valid mobile number (01XXXXXXXXX)." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  const phone = normPhone(b.telephone);
  const db = readDb();
  if (db.users.some((u) => u.phone === phone)) return NextResponse.json({ error: "This phone number is already registered. Please login." }, { status: 409 });
  if (db.users.some((u) => u.email === email)) return NextResponse.json({ error: "This E-Mail Address is already registered. Please login." }, { status: 409 });
  const user: User = { id: uid(), firstname, lastname, email, phone, ...hashPassword(password), city: "", region: "", address: "", wishlist: [], points: 0, createdAt: Date.now() };
  db.users.push(user);
  // orders placed as a guest with the same phone number belong to the new account
  for (const o of db.orders) if (!o.userId && normPhone(o.phone) === phone) o.userId = user.id;
  const token = newSession(db, user.id);
  writeDb(db);
  await setSessionCookie(token);
  return NextResponse.json({ user: publicUser(user) });
}
