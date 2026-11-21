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
      <div className="relative flex items-center rounded-full border border-white/15 bg-white/[0.06] p-[4px] transition-colors focus-within:border-[#e4212a]/70 focus-within:bg-white/[0.09]">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-label="Your email address"
          className="h-[40px] min-w-0 flex-1 bg-transparent px-[16px] text-[14px] text-white outline-none placeholder:text-[#7c8896]"
        />
        <button
          type="submit"
          className="h-[40px] flex-none cursor-pointer rounded-full bg-[linear-gradient(120deg,#e4212a,#ff6b3d)] px-[20px] text-[13px] leading-none font-bold text-white shadow-[0_8px_20px_-8px_rgba(228,33,42,0.8)] transition-transform duration-200 hover:-translate-y-[1px]"
        >
          Subscribe
        </button>
      </div>
      <label className="mt-[12px] flex cursor-pointer items-start gap-[8px] text-[12px] leading-[1.6] text-[#8b97a5]">
        <input type="checkbox" name="agree" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-[4px] size-[13px] flex-none accent-[#e4212a]" />
        <span>
          I have read and agree to the{" "}
          <Link href="/privacy-policy" className="text-[#ff9a6b] underline-offset-2 hover:underline">
            Privacy policy
          </Link>
        </span>
      </label>
      {msg && <div className={`mt-[10px] text-[13px] ${msg.ok ? "text-[#4ade80]" : "text-[#ff8a8a]"}`}>{msg.text}</div>}
    </form>
  );
}
