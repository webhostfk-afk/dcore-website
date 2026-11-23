"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

type Msg = { id: number; from: "me" | "team"; time: number; text: string };

const VID_KEY = "dcore:chat-vid";
const newVid = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, "0")).join("");
const getVid = () => {
  try {
    let v = localStorage.getItem(VID_KEY);
    if (!v) {
      v = newVid();
      localStorage.setItem(VID_KEY, v);
    }
    return v;
  } catch {
    return "";
  }
};

const TOPICS = ["Price & stock", "Technical advice", "Order status", "Warranty & service", "Bulk / corporate deal"];

const D = {
  chat: "M4 5h16v11H9l-5 4zM8 9h8M8 12h5",
  close: "M6 6l12 12M18 6L6 18",
  wa: "M3 21l1.6-4.7A9 9 0 1112 21a9 9 0 01-4.3-1.1zM9 8c0 4 3 7 7 7l1-2-2-1-1 1c-1-.4-2.4-1.7-3-3l1-1-1-2z",
  call: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  send: "M21 4L3 11l7 3 3 7zM10 14l11-10",
  plus: "M12 5v14M5 12h14",
  mic: "M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3zM6 11a6 6 0 0012 0M12 17v4M9 21h6",
  reset: "M4 4v6h6M20 20v-6h-6M20 10A8 8 0 006 6.3L4 10M4 14a8 8 0 0014 3.7L20 14",
  link: "M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1",
  track: "M12 21s-6-5.2-6-10a6 6 0 0112 0c0 4.800-6 10-6 10zM12 8.500a2.500 2.500 0 100 5 2.500 2.500 0 000-5z",
};
const Icon = ({ d, size = 20, sw = 1.9 }: { d: string; size?: number; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const clock = (t: number) => new Date(t).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const subscribeNone = () => () => {};

function Bubble({ me, time, children }: { me: boolean; time?: number; children: ReactNode }) {
  return (
    <div className={`flex ${me ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[84%] flex-col ${me ? "items-end" : "items-start"}`}>
        <div
          className={`px-[15px] py-[10px] text-[14px] leading-[21px] font-normal break-words whitespace-pre-wrap ${
            me ? "rounded-[20px_20px_5px_20px] bg-[linear-gradient(135deg,#01aef1,#0189bc)] text-white" : "rounded-[20px_20px_20px_5px] border border-[#0000001a] bg-white text-[#000000]"
          }`}
        >
          {children}
        </div>
        {time && <span className="mt-[3px] px-[4px] text-[11px] leading-[14px] text-[#00000080]">{clock(time)}</span>}
      </div>
    </div>
  );
}

// The chat of the shop: a round button in the corner opens one chat window. Messages are kept on the server (see lib/chat-server.ts) and
// the team answers them in /chat-admin.
export default function ChatWidget() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const micOk = useSyncExternalStore(
    subscribeNone,
    () => typeof window !== "undefined" && !!((window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition),
    () => false,
  );
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [plus, setPlus] = useState(false);
  const [listening, setListening] = useState(false);
  const [lift, setLift] = useState(false); // near the end of the page the button steps up so it does not cover the footer "back to top" button
  const body = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const rec = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    const check = () => setLift(document.documentElement.scrollHeight - (window.scrollY + window.innerHeight) < 140);
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open]);

  useEffect(() => {
    if (open) body.current?.scrollTo({ top: body.current.scrollHeight, behavior: "smooth" });
  }, [open, msgs.length]);

  // the conversation lives on the server: it is read when the window opens and every 4 seconds while it is open
  useEffect(() => {
    if (!open) return;
    const vid = getVid();
    let live = true;
    const load = () =>
      fetch(`/api/chat?vid=${vid}`)
        .then((r) => r.json())
        .then((d: { msgs: Msg[] }) => live && setMsgs((old) => (old.length === d.msgs.length && old[old.length - 1]?.id === d.msgs[d.msgs.length - 1]?.id ? old : d.msgs)))
        .catch(() => {});
    load();
    const t = setInterval(load, 4000);
    return () => {
      live = false;
      clearInterval(t);
    };
  }, [open]);

  const post = async (t: string) => {
    const now = Date.now();
    setMsgs((m) => [...m, { id: now, from: "me", time: now, text: t }]);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vid: getVid(), text: t, page: window.location.href }) });
      if (r.ok) setMsgs((await r.json()).msgs);
    } catch {}
  };
  const sendText = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    setText("");
    setPlus(false);
    post(t);
  };
  const sharePage = () => {
    setPlus(false);
    post(`Please look at this page:\n${window.location.href}`);
  };
  const mic = () => {
    if (listening) {
      rec.current?.stop();
      return;
    }
    const W = window as unknown as Record<string, new () => { lang: string; interimResults: boolean; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void; onerror: () => void; start: () => void; stop: () => void }>;
    const R = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!R) return;
    const r = new R();
    r.lang = navigator.language || "en-US";
    r.interimResults = false;
    r.onresult = (e) => setText((v) => (v ? v + " " : "") + Array.from(e.results).map((x) => x[0].transcript).join(" "));
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    rec.current = r;
    setListening(true);
    r.start();
  };

  const day = useMemo(() => (msgs.length ? new Date(msgs[0].time).toLocaleDateString([], { weekday: "long", day: "numeric", month: "short" }) : "Today"), [msgs]);

  return (
    <>
      <div
        role="dialog"
        aria-label="Chat with D CORE Solutions"
        aria-hidden={!open}
        className={`fixed right-[24px] bottom-[92px] z-[99999] flex h-[min(580px,calc(100vh-120px))] w-[min(430px,calc(100vw-48px))] origin-bottom-right flex-col overflow-hidden rounded-[26px] border border-[#0000001a] bg-white shadow-[0_24px_70px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 max-[761px]:inset-x-[8px] max-[761px]:bottom-[74px] max-[761px]:h-[min(600px,calc(100vh-140px))] max-[761px]:w-auto ${
          open ? "visible translate-y-0 scale-100 opacity-100" : "invisible translate-y-[16px] scale-[0.96] opacity-0"
        }`}
      >
        <div className="flex flex-none items-center gap-[10px] border-b border-[#0000001a] px-[16px] py-[12px]">
          <img src="/image/logo/dcore-dark.png" alt="dcore" width={612} height={236} className="block h-auto max-h-[38px] w-auto" />
          <div className="min-w-0 flex-1 text-[12px] leading-[16px] font-normal text-[#00000099] max-[400px]:hidden">
            <span className="relative mr-[6px] inline-flex size-[8px] align-middle">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#01aef1] opacity-60" />
              <span className="relative inline-flex size-[8px] rounded-full bg-[#01aef1]" />
            </span>
            Online - we reply here
          </div>
          <span className="flex-1 min-[401px]:hidden" />
          <button type="button" aria-label="Close chat" onClick={() => setOpen(false)} className="flex size-[40px] flex-none cursor-pointer items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-[#01aef1]">
            <Icon d={D.close} size={17} sw={2.2} />
          </button>
        </div>

        <div ref={body} className="flex min-h-0 flex-1 flex-col gap-[10px] overflow-y-auto bg-[radial-gradient(#e3f5fd_1px,transparent_1px)] [background-size:18px_18px] px-[16px] py-[14px]">
          <div className="self-center rounded-full bg-[#f0fafe] px-[12px] py-[2px] text-[11px] leading-[18px] font-bold text-[#00000099]">{day}</div>
          <Bubble me={false}>Welcome to D CORE Solutions. Ask about a product, a price or advice for your network and our team will help.</Bubble>
          {msgs.length === 0 && (
            <div className="flex flex-wrap gap-[8px]">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setText(`${t}: `);
                    area.current?.focus();
                  }}
                  className="cursor-pointer rounded-full border border-[#01aef1] bg-white px-[14px] py-[6px] text-[13px] leading-[18px] font-medium text-[#0189bc] transition-colors hover:bg-[#01aef1] hover:text-white"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          {msgs.map((m) => (
            <Bubble key={m.id} me={m.from === "me"} time={m.time}>
              {m.text}
            </Bubble>
          ))}
          {msgs.length > 0 && msgs[msgs.length - 1].from === "me" && <p className="self-center rounded-full bg-[#f0fafe] px-[12px] py-[3px] text-[11px] leading-[16px] text-[#00000099]">Message received - our team will reply here soon.</p>}
        </div>

        <div className="relative flex-none border-t border-[#0000001a] px-[12px] py-[12px]">
          {plus && (
            <div className="absolute bottom-[calc(100%-4px)] left-[12px] z-[3] w-[220px] overflow-hidden rounded-[16px] border border-[#0000001a] bg-white shadow-[0_14px_36px_-10px_rgba(0,0,0,0.35)]">
              {[
                { label: "Share this page", icon: D.link, run: sharePage },
                {
                  label: "Order help",
                  icon: D.track,
                  run: () => {
                    setText("Order help: ");
                    setPlus(false);
                    area.current?.focus();
                  },
                },
              ].map((x) => (
                <button key={x.label} type="button" onClick={x.run} className="flex w-full cursor-pointer items-center gap-[10px] px-[14px] py-[10px] text-left text-[14px] leading-[20px] font-medium text-black transition-colors hover:bg-[#f0fafe]">
                  <span className="text-[#01aef1]">
                    <Icon d={x.icon} size={18} />
                  </span>
                  {x.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-end gap-[8px]">
            <button type="button" aria-label="More" aria-expanded={plus} onClick={() => setPlus((v) => !v)} className={`flex size-[42px] flex-none cursor-pointer items-center justify-center rounded-full border border-[#0000001f] transition-all ${plus ? "rotate-45 bg-black text-white" : "bg-white text-[#000000b3] hover:border-[#01aef1] hover:text-[#01aef1]"}`}>
              <Icon d={D.plus} size={20} sw={2.2} />
            </button>
            {micOk && (
              <button type="button" aria-label="Speak" onClick={mic} className={`flex size-[42px] flex-none cursor-pointer items-center justify-center rounded-full border transition-colors ${listening ? "animate-pulse border-[#01aef1] bg-[#01aef1] text-white" : "border-[#0000001f] bg-white text-[#000000b3] hover:border-[#01aef1] hover:text-[#01aef1]"}`}>
                <Icon d={D.mic} size={19} />
              </button>
            )}
            <div className="flex min-w-0 flex-1 items-end rounded-[24px] border border-[#0000001f] bg-[#f0fafe] py-[5px] pr-[5px] pl-[16px] focus-within:border-[#01aef1]">
              <textarea
                ref={area}
                value={text}
                rows={1}
                onChange={(e) => {
                  setText(e.target.value);
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height = Math.min(96, e.currentTarget.scrollHeight) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendText(text);
                  }
                }}
                placeholder="Write your message..."
                aria-label="Your message"
                className="max-h-[96px] min-h-[24px] min-w-0 flex-1 resize-none self-center bg-transparent text-[14px] leading-[22px] font-normal text-black outline-none placeholder:text-[#00000080]"
              />
              <button type="button" aria-label="Send" onClick={() => sendText(text)} disabled={!text.trim()} className="flex size-[34px] flex-none cursor-pointer items-center justify-center rounded-full bg-[#01aef1] text-white transition-colors hover:bg-[#0189bc] disabled:cursor-default disabled:bg-[#00000026]">
                <Icon d={D.send} size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label={open ? "Close chat" : "Chat with us"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`fixed right-[24px] ${lift ? "bottom-[96px]" : "bottom-[24px]"} z-[99999] flex size-[58px] cursor-pointer items-center justify-center rounded-full bg-[#01aef1] text-white shadow-[0_10px_28px_-6px_rgba(1,174,241,0.8)] transition-transform duration-200 hover:scale-105 ${lift ? "max-[761px]:bottom-[136px]" : "max-[761px]:bottom-[74px]"} max-[640px]:right-[14px] ${open ? "max-[761px]:hidden" : ""}`}
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-[#01aef1] opacity-30 [animation-duration:2.4s]" />}
        <span className="relative">
          <Icon d={open ? D.close : D.chat} size={26} sw={open ? 2.2 : 1.9} />
        </span>
      </button>
    </>
  );
}
