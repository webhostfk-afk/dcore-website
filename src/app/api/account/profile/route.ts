import { NextResponse } from "next/server";
import { currentUser, publicUser, validEmail, writeDb } from "@/lib/auth-server";

const no = () => NextResponse.json({ error: "Please login." }, { status: 401 });

export async function GET() {
  const c = await currentUser();
  return c ? NextResponse.json({ user: publicUser(c.user) }) : no();
}

export async function PATCH(req: Request) {
  const c = await currentUser();
  if (!c) return no();
  const b = (await req.json().catch(() => ({}))) as Record<string, string>;
  const name = (b.name ?? "").trim().replace(/\s+/g, " ");
  const email = (b.email ?? "").trim().toLowerCase();
  if (!name) return NextResponse.json({ error: "Full Name is required." }, { status: 400 });
  if (!validEmail(email)) return NextResponse.json({ error: "E-Mail Address does not appear to be valid." }, { status: 400 });
  if (c.db.users.some((u) => u.id !== c.user.id && u.email === email)) return NextResponse.json({ error: "This E-Mail Address belongs to another account." }, { status: 409 });
  const [first, ...rest] = name.split(" ");
  Object.assign(c.user, { firstname: first.slice(0, 40), lastname: rest.join(" ").slice(0, 40), email, city: (b.city ?? "").trim().slice(0, 60), region: (b.region ?? "").trim().slice(0, 60), address: (b.address ?? "").trim().slice(0, 200) });
  writeDb(c.db);
  return NextResponse.json({ user: publicUser(c.user) });
}
