"use client";
import { useRef } from "react";

const H = 15; // handle width in px

// The price range slider of the filter: a 1px line, the selected part in red and two 15px round handles.
export default function PriceSlider({ min, max, from, to, onChange }: { min: number; max: number; from: number; to: number; onChange: (from: number, to: number) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const span = Math.max(1, max - min);
  const pf = (from - min) / span;
  const pt = (to - min) / span;

  const drag = (which: "from" | "to") => (e: React.PointerEvent) => {
    e.preventDefault();
    const el = box.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const move = (ev: PointerEvent) => {
      const p = Math.min(1, Math.max(0, (ev.clientX - rect.left - H / 2) / (rect.width - H)));
      const v = Math.round(min + p * span);
      if (which === "from") onChange(Math.min(v, to), to);
      else onChange(from, Math.max(v, from));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const pos = (p: number) => `calc((100% - ${H}px) * ${p})`;
  return (
    <div ref={box} className="relative h-[10px] w-full">
      <span className="absolute top-[37.5px] left-0 h-px w-full rounded-[10px] bg-[#01aef1]" />
      <span className="absolute top-[37.5px] h-px rounded-[10px] bg-[#01aef1]" style={{ left: `calc(${H / 2}px + ${pos(pf)})`, width: `calc((100% - ${H}px) * ${pt - pf})` }} />
      <span className="absolute top-[30px] z-[1] size-[15px] cursor-pointer touch-none rounded-[50%] bg-[#01aef1]" style={{ left: pos(pf) }} onPointerDown={drag("from")} />
      <span className="absolute top-[30px] z-[1] size-[15px] cursor-pointer touch-none rounded-[50%] bg-[#01aef1]" style={{ left: pos(pt) }} onPointerDown={drag("to")} />
    </div>
  );
}
