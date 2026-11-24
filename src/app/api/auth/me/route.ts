import { NextResponse } from "next/server";
import { currentUser, publicUser } from "@/lib/auth-server";


export async function GET() {
  const c = await currentUser();
  return NextResponse.json({ user: c ? publicUser(c.user) : null });
}
