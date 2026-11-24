import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { cookies } from "next/headers";

// Customer accounts, sessions and orders are kept in one small JSON file in .data (next to the project, not inside src).
// It is a simple store for one server: replace it with a real database before the shop gets many customers.
export type Address = { label: string; line1: string; city: string; region: string };
export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  username?: string; // optional sign-in name (the demo account)
  salt: string;
  hash: string;
  city: string;
  region: string;
  address: string;
  wishlist: string[];
  points: number;
  createdAt: number;
};
export type OrderItem = { id: string; name: string; href: string; image: string; price: number; qty: number };
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
export type Order = {
  id: string;
  number: string;
  userId: string | null;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  shipping: string;
  payment: string;
  comment: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  createdAt: number;
  deliveredAt?: number;
};
export type ReturnReq = { id: string; number: string; userId: string; orderId: string; orderNumber: string; itemId: string; product: string; qty: number; reason: string; details: string; status: "requested" | "approved" | "received" | "refunded" | "rejected"; createdAt: number };
type Db = { users: User[]; sessions: { token: string; userId: string; exp: number }[]; orders: Order[]; returns: ReturnReq[]; seq: number };

const dir = path.join(process.cwd(), ".data");
const file = path.join(dir, "db.json");
export const COOKIE = "dc_session";
export const RETURN_DAYS = 7;
const DAY = 86400000;

export function readDb(): Db {
  try {
    const d = JSON.parse(fs.readFileSync(file, "utf8")) as Partial<Db>;
    return { users: d.users ?? [], sessions: d.sessions ?? [], orders: d.orders ?? [], returns: d.returns ?? [], seq: d.seq ?? 0 };
  } catch {
    return { users: [], sessions: [], orders: [], returns: [], seq: 0 };
  }
}
export function writeDb(db: Db) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(db));
}

export const normPhone = (s: string) => {
  const d = s.replace(/[^\d+]/g, "");
  if (d.startsWith("+880")) return "0" + d.slice(4);
  if (d.startsWith("880")) return "0" + d.slice(3);
  return d;
};
export const validPhone = (s: string) => /^01[3-9]\d{8}$/.test(normPhone(s));
export const validEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export function hashPassword(pw: string, salt = crypto.randomBytes(16).toString("hex")) {
  return { salt, hash: crypto.scryptSync(pw, salt, 64).toString("hex") };
}
export function checkPassword(u: User, pw: string) {
  const a = Buffer.from(crypto.scryptSync(pw, u.salt, 64).toString("hex"));
  const b = Buffer.from(u.hash);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const publicUser = (u: User) => ({
  id: u.id,
  firstname: u.firstname,
  lastname: u.lastname,
  name: [u.firstname, u.lastname].filter(Boolean).join(" "),
  email: u.email,
  phone: u.phone,
  city: u.city,
  region: u.region,
  address: u.address,
  points: u.points,
  wishlist: u.wishlist,
});

export function newSession(db: Db, userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const now = Date.now();
  db.sessions = db.sessions.filter((s) => s.exp > now).slice(-500);
  db.sessions.push({ token, userId, exp: now + 30 * DAY });
  return token;
}
export async function setSessionCookie(token: string) {
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 30 * 86400, secure: process.env.NODE_ENV === "production" });
}

// The signed-in customer of this request (or null).
export async function currentUser(): Promise<{ db: Db; user: User } | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const db = readDb();
  const s = db.sessions.find((x) => x.token === token && x.exp > Date.now());
  const user = s && db.users.find((u) => u.id === s.userId);
  return user ? { db, user } : null;
}

export const nextOrderNumber = (db: Db) => {
  db.seq += 1;
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `DC${ymd}${String(db.seq).padStart(4, "0")}`;
};
export const uid = () => crypto.randomBytes(8).toString("hex");

// Delivered orders that are still inside the return period, with the products not yet asked to return.
export function returnable(db: Db, userId: string) {
  const now = Date.now();
  return db.orders
    .filter((o) => o.userId === userId && o.status === "delivered" && o.deliveredAt && now - o.deliveredAt <= RETURN_DAYS * DAY)
    .map((o) => ({
      id: o.id,
      number: o.number,
      deliveredAt: o.deliveredAt!,
      daysLeft: Math.max(0, Math.ceil((RETURN_DAYS * DAY - (now - o.deliveredAt!)) / DAY)),
      items: o.items
        .map((i) => ({ ...i, left: i.qty - db.returns.filter((r) => r.orderId === o.id && r.itemId === i.id && r.status !== "rejected").reduce((n, r) => n + r.qty, 0) }))
        .filter((i) => i.left > 0),
    }))
    .filter((o) => o.items.length);
}
