import type { CSSProperties } from "react";

const items = [
  { href: "https://t.me/otech_technologies", bg: "bg-[#24a1de]", bottom: "bottom-[60px]", glyph: "", mb: "before:mb-[5px]" },
  { href: "https://www.m.me/otech.technologies", bg: "bg-[#1877f2]", bottom: "bottom-[110px]", glyph: "", mb: "" },
  { href: "https://api.whatsapp.com/send?phone=8801844678806", bg: "bg-[#075e54]", bottom: "bottom-[160px]", glyph: "", mb: "before:mb-[5px]" },
];

// The round chat buttons (Telegram, Messenger, WhatsApp) fixed to the right edge of every page.
export default function SideMenu() {
  return (
    <ul>
      {items.map((it) => (
        <li
          key={it.href}
          className={`fixed right-[30px] ${it.bottom} z-[99999] w-[42px] rounded-[4px] border border-solid border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.1),-5px_5px_10px_rgba(0,0,0,0.1)] ${it.bg}`}
        >
          <a
            href={it.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ "--i": `"${it.glyph}"` } as CSSProperties}
            className={`relative flex w-full flex-col items-center justify-center rounded-[4px] px-[10px] py-[5px] text-[10px] text-white before:my-[2px] before:flex before:w-full before:items-center before:justify-center before:font-[icomoon] before:text-[20px] before:leading-[1.1] before:content-(--i) ${it.mb}`}
          >
            <span className="relative -top-[2px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
