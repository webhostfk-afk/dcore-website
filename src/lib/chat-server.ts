import fs from "node:fs";
import path from "node:path";

// The inbox of the shop chat: one small JSON file per visitor in .chat-data (next to the project, not inside src).
export type ChatMsg = { id: number; from: "me" | "team"; text: string; time: number; page?: string };
export type Conversation = { vid: string; updated: number; unread: number; msgs: ChatMsg[] };

const dir = path.join(process.cwd(), ".chat-data");
export const validVid = (v: unknown): v is string => typeof v === "string" && /^[a-z0-9-]{8,48}$/.test(v);
const file = (vid: string) => path.join(dir, `${vid}.json`);

export function readConv(vid: string): Conversation {
  try {
    return JSON.parse(fs.readFileSync(file(vid), "utf8")) as Conversation;
  } catch {
    return { vid, updated: 0, unread: 0, msgs: [] };
  }
}

export function addMsg(vid: string, from: "me" | "team", text: string, page?: string): Conversation {
  fs.mkdirSync(dir, { recursive: true });
  const c = readConv(vid);
  const now = Date.now();
  c.msgs.push({ id: now, from, text: text.slice(0, 2000), time: now, ...(page ? { page: page.slice(0, 300) } : {}) });
  c.msgs = c.msgs.slice(-300);
  c.updated = now;
  c.unread = from === "me" ? c.unread + 1 : 0;
  fs.writeFileSync(file(vid), JSON.stringify(c));
  return c;
}

export function markRead(vid: string) {
  const c = readConv(vid);
  if (c.unread) {
    c.unread = 0;
    fs.writeFileSync(file(vid), JSON.stringify(c));
  }
}

export function listConvs(): Conversation[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => readConv(f.replace(/\.json$/, "")))
    .filter((c) => c.msgs.length)
    .sort((a, b) => b.updated - a.updated);
}

// the admin key is set in .env.local (CHAT_ADMIN_KEY); without it nobody can open the admin side
export const adminOk = (key: string | null) => !!process.env.CHAT_ADMIN_KEY && key === process.env.CHAT_ADMIN_KEY;
