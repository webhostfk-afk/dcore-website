import { home } from "@/data/home";

const ICONS = [
  // megaphone
  "M3 11v3a1 1 0 001 1h2l5 4V6L6 10H4a1 1 0 00-1 1zM15 9a4 4 0 010 6M18 6.5a8 8 0 010 11",
  // phone
  "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  // headset / wrench
  "M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z",
];

// the digits of a phone number are shown in the brand blue
const parts = (text: string) => text.split(/(\+?\d[\d ]{8,}\d)/g);

// The running notice line under the brands: a label on the left and the messages sliding from right to left without a break.
// It stops while the mouse is over it. The messages are the parts of `home.notice` (they end with "::").
export default function NoticeTicker() {
  const items = home.notice
    .split("::")
    .map((t) => t.replace(/^[\s\p{Extended_Pictographic}️]+/u, "").trim())
    .filter(Boolean);
  const row = (key: string, hidden?: boolean) => (
    <ul key={key} aria-hidden={hidden} className="flex flex-none items-center">
      {items.map((t, i) => (
        <li key={i} className="flex flex-none items-center gap-[10px] pr-[28px] text-[14px] leading-[22px] font-medium whitespace-nowrap text-[#000000] max-[471px]:text-[13px]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#01aef1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none">
            <path d={ICONS[i % ICONS.length]} />
          </svg>
          <span>
            {parts(t).map((x, k) =>
              /^\+?\d[\d ]{8,}\d$/.test(x) ? (
                <b key={k} className="font-bold text-[#01aef1]">
                  {x}
                </b>
              ) : (
                x
              ),
            )}
          </span>
          <span aria-hidden="true" className="ml-[18px] block size-[6px] rotate-45 bg-[#01aef1]/70" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="mx-auto mt-0 mb-[10px] flex h-[42px] w-full max-w-[1280px] items-stretch overflow-hidden rounded-full border border-[#0000001a] bg-white shadow-[0_6px_18px_-10px_rgba(0,0,0,0.25)] max-[1301px]:w-[calc(100%-20px)]">
      <div className="relative z-[2] flex flex-none items-center gap-[8px] rounded-full bg-[#01aef1] px-[18px] text-[13px] font-bold tracking-[0.04em] text-white uppercase shadow-[6px_0_14px_-6px_rgba(0,0,0,0.3)] max-[471px]:px-[12px]">
        <span className="relative flex size-[8px]">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-70" />
          <span className="relative inline-flex size-[8px] rounded-full bg-white" />
        </span>
        Notice
      </div>
      <div className="dcore-ticker group relative flex min-w-0 flex-1 items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[24px] bg-[linear-gradient(90deg,#ffffff,transparent)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[40px] bg-[linear-gradient(270deg,#ffffff,transparent)]" />
        <div className="dcore-ticker-track flex w-max flex-none items-center">
          {row("a")}
          {row("b", true)}
        </div>
      </div>
    </div>
  );
}
