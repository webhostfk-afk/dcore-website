"use client";
import { useState } from "react";
import Link from "next/link";

// The newsletter form of the footer (there is no server behind it in this clone, so a valid address only shows a thank-you line).
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setMsg({ ok: false, text: "Please enter a valid e-mail address." });
    if (!agree) return setMsg({ ok: false, text: "Please accept the privacy policy first." });
    setMsg({ ok: true, text: "Thank you! You are now subscribed." });
    setEmail("");
  };

  return (
    <form action="#" method="post" onSubmit={submit} noValidate>
      <div className="relative flex items-center rounded-full border border-white/15 bg-white/[0.06] p-[4px] transition-colors focus-within:border-[#01aef1]/70 focus-within:bg-white/[0.09]">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-label="Your email address"
          className="h-[40px] min-w-0 flex-1 bg-transparent px-[16px] text-[14px] text-white outline-none placeholder:text-[#ffffff80]"
        />
        <button
          type="submit"
          className="h-[40px] flex-none cursor-pointer rounded-full bg-[linear-gradient(120deg,#01aef1,#0189bc)] px-[20px] text-[13px] leading-none font-bold text-white shadow-[0_8px_20px_-8px_rgba(1,174,241,0.8)] transition-transform duration-200 hover:-translate-y-[1px]"
        >
          Subscribe
        </button>
      </div>
      <label className="mt-[12px] flex cursor-pointer items-start gap-[8px] text-[12px] leading-[1.6] text-[#ffffffa6]">
        <input type="checkbox" name="agree" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-[4px] size-[13px] flex-none accent-[#01aef1]" />
        <span>
          I have read and agree to the{" "}
          <Link href="/privacy-policy" className="text-[#01aef1] underline-offset-2 hover:underline">
            Privacy policy
          </Link>
        </span>
      </label>
      {msg && <div className={`mt-[10px] text-[13px] ${msg.ok ? "text-[#01aef1]" : "text-[#01aef1]"}`}>{msg.text}</div>}
    </form>
  );
}
