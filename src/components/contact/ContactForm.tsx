"use client";
import { useState } from "react";

const label = "mb-[6px] block text-[12px] leading-[16px] font-bold tracking-[0.02em] text-black uppercase";
const field =
  "block w-full rounded-[8px] border border-[#0000001f] bg-white px-[14px] text-[14px] font-normal text-black outline-none transition-colors placeholder:text-[#00000066] focus:border-[#01aef1] focus:shadow-[0_0_0_3px_rgba(1,174,241,0.18)]";

export default function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form).entries());
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
      const j = (await r.json().catch(() => ({}))) as { error?: string };
      if (r.ok) {
        form.reset();
        setMsg({ ok: true, text: "Thank you! Your message has been sent. We will get back to you soon." });
      } else setMsg({ ok: false, text: j.error ?? "Something went wrong. Please try again." });
    } catch {
      setMsg({ ok: false, text: "Could not send the message. Please check your connection and try again." });
    }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} noValidate className="text-left">
      <div className="grid grid-cols-2 gap-x-[14px] gap-y-[16px] max-[561px]:grid-cols-1">
        <div>
          <label htmlFor="c-name" className={label}>
            Name
          </label>
          <input id="c-name" name="name" required placeholder="Enter your name*" className={`${field} h-[42px]`} />
        </div>
        <div>
          <label htmlFor="c-phone" className={label}>
            Phone Number
          </label>
          <input id="c-phone" name="phone" type="tel" required placeholder="Enter your phone number*" className={`${field} h-[42px]`} />
        </div>
        <div className="col-span-2 max-[561px]:col-span-1">
          <label htmlFor="c-email" className={label}>
            Email
          </label>
          <input id="c-email" name="email" type="email" required placeholder="Enter your email*" className={`${field} h-[42px]`} />
        </div>
        <div className="col-span-2 max-[561px]:col-span-1">
          <label htmlFor="c-msg" className={label}>
            Your Message
          </label>
          <textarea id="c-msg" name="message" rows={5} className={`${field} resize-y py-[12px]`} />
        </div>
      </div>
      {msg && (
        <p className={`mt-[14px] rounded-[6px] px-[12px] py-[8px] text-[14px] leading-[20px] font-normal ${msg.ok ? "bg-[#dcf7e4] text-[#0b7a3b]" : "bg-[#fde8e8] text-[#d92d20]"}`}>{msg.text}</p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="mt-[18px] h-[42px] cursor-pointer rounded-[6px] bg-[#01aef1] px-[34px] text-[13px] font-bold tracking-[0.04em] text-white uppercase transition-colors hover:bg-[#0189bc] disabled:cursor-wait disabled:opacity-70"
      >
        {busy ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
