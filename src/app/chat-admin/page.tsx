"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type Item = { vid: string; updated: number; unread: number; last: string; page: string };
type Msg = { id: number; from: "me" | "team"; text: string; time: number; page?: string };
const KEY = "dcore:chat-admin-key";
const when = (t: number) => new Date(t).toLocaleString([], { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

// The admin side of the shop chat: the conversations on the left, the open one on the right, a box to reply.
export default function ChatAdmin() {
  const [key, setKey] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  const [list, setList] = useState<Item[]>([]);
  const [vid, setVid] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);

  const api = useCallback(async (k: string, v?: string | null) => {
    const r = await fetch(`/api/chat/admin?key=${encodeURIComponent(k)}${v ? `&vid=${v}` : ""}`);
    return r.ok ? r.json() : null;
  }, []);

  const login = useCallback(
    async (k: string) => {
      const d = await api(k);
      if (!d) {
        setErr("Wrong key (or CHAT_ADMIN_KEY is not set in .env.local).");
        return;
      }
      setErr("");
      setOk(true);
      setList(d.list);
      try {
        localStorage.setItem(KEY, k);
      } catch {}
    },
    [api],
  );

  useEffect(() => {
    try {
      const k = localStorage.getItem(KEY);
      if (k) {
        setKey(k);
        login(k);
      }
    } catch {}
  }, [login]);

  // refresh the list and the open conversation every 4 seconds
  useEffect(() => {
    if (!ok) return;
    const t = setInterval(async () => {
      const d = await api(key);
      if (d) setList(d.list);
      if (vid) {
        const c = await api(key, vid);
        if (c) setMsgs(c.msgs);
      }
    }, 4000);
    return () => clearInterval(t);
  }, [ok, key, vid, api]);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length, vid]);

  const open = async (v: string) => {
    setVid(v);
    const c = await api(key, v);
    if (c) setMsgs(c.msgs);
  };
  const reply = async () => {
    const t = text.trim();
    if (!t || !vid) return;
    setText("");
    const r = await fetch("/api/chat/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, vid, text: t }) });
    if (r.ok) setMsgs((await r.json()).msgs);
  };

  if (!ok)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0fafe] p-[16px] text-[15px] font-medium">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(key);
          }}
          className="w-full max-w-[360px] rounded-[20px] bg-white p-[24px] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.3)]"
        >
          <h1 className="text-[20px] leading-[26px] font-bold">Chat inbox</h1>
          <p className="mt-[4px] mb-[14px] text-[13px] font-normal text-[#00000099]">Enter the admin key (CHAT_ADMIN_KEY in .env.local).</p>
          <input value={key} onChange={(e) => setKey(e.target.value)} type="password" placeholder="Admin key" className="h-[44px] w-full rounded-full border border-[#0000001f] bg-[#f0fafe] px-[16px] text-[14px] font-normal outline-none focus:border-[#01aef1]" />
          {err && <p className="mt-[8px] text-[13px] font-normal text-[#0189bc]">{err}</p>}
          <button type="submit" className="mt-[14px] h-[44px] w-full cursor-pointer rounded-full bg-[#01aef1] text-[14px] font-bold text-white hover:bg-[#0189bc]">
            Open
          </button>
        </form>
      </div>
    );

  return (
    <div className="flex h-screen bg-[#f0fafe] text-[14px] font-normal text-black max-[760px]:flex-col">
      <aside className={`w-[320px] flex-none overflow-y-auto border-r border-[#0000001a] bg-white max-[760px]:w-full max-[760px]:flex-1 ${vid ? "max-[760px]:hidden" : ""}`}>
        <div className="sticky top-0 border-b border-[#0000001a] bg-white px-[16px] py-[14px] text-[16px] leading-[22px] font-bold">Conversations ({list.length})</div>
        {list.length === 0 && <p className="p-[20px] text-[#00000099]">No messages yet.</p>}
        {list.map((c) => (
          <button key={c.vid} type="button" onClick={() => open(c.vid)} className={`block w-full cursor-pointer border-b border-[#0000001a] px-[16px] py-[12px] text-left hover:bg-[#f0fafe] ${vid === c.vid ? "bg-[#e3f5fd]" : ""}`}>
            <div className="flex items-center justify-between gap-[8px]">
              <b className="text-[13px] font-bold">Visitor {c.vid.slice(0, 6)}</b>
              <span className="text-[11px] text-[#00000080]">{when(c.updated)}</span>
            </div>
            <div className="mt-[2px] flex items-center gap-[8px]">
              <span className="line-clamp-1 flex-1 text-[#000000b3]">{c.last}</span>
              {c.unread > 0 && <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#01aef1] px-[5px] text-[11px] font-bold text-white">{c.unread}</span>}
            </div>
          </button>
        ))}
      </aside>
      <main className={`flex min-w-0 flex-1 flex-col ${vid ? "" : "max-[760px]:hidden"}`}>
        {vid ? (
          <>
            <div className="flex items-center gap-[10px] border-b border-[#0000001a] bg-white px-[16px] py-[12px]">
              <button type="button" onClick={() => setVid(null)} className="cursor-pointer text-[#01aef1] min-[761px]:hidden">
                ← Back
              </button>
              <b className="text-[15px] font-bold">Visitor {vid.slice(0, 6)}</b>
            </div>
            <div className="flex flex-1 flex-col gap-[8px] overflow-y-auto px-[16px] py-[14px]">
              {msgs.map((m) => (
                <div key={m.id} className={`flex ${m.from === "team" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[80%]">
                    <div className={`rounded-[16px] px-[14px] py-[8px] break-words whitespace-pre-wrap ${m.from === "team" ? "bg-[#01aef1] text-white" : "border border-[#0000001a] bg-white"}`}>{m.text}</div>
                    <div className={`mt-[2px] px-[4px] text-[11px] text-[#00000080] ${m.from === "team" ? "text-right" : ""}`}>
                      {when(m.time)}
                      {m.page && (
                        <>
                          {" · "}
                          <a href={m.page} target="_blank" rel="noopener noreferrer" className="text-[#0189bc] underline">
                            page
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={end} />
            </div>
            <div className="flex gap-[8px] border-t border-[#0000001a] bg-white p-[12px]">
              <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && reply()} placeholder="Write a reply..." className="h-[44px] min-w-0 flex-1 rounded-full border border-[#0000001f] bg-[#f0fafe] px-[16px] outline-none focus:border-[#01aef1]" />
              <button type="button" onClick={reply} disabled={!text.trim()} className="h-[44px] cursor-pointer rounded-full bg-[#01aef1] px-[22px] font-bold text-white hover:bg-[#0189bc] disabled:cursor-default disabled:opacity-50">
                Reply
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-[#00000099] max-[760px]:hidden">Choose a conversation.</div>
        )}
      </main>
    </div>
  );
}
