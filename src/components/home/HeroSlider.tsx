"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Img } from "@/types/home";

type Slide = Img & { href: string };

// Hero slider: no banner moves. The banner on top is cropped from its right edge towards the left until nothing is left of it and the
// next banner, lying under it, is shown. Bullets at the bottom, autoplay, pause while hovered.
export default function HeroSlider({ slides, delay, width, height }: { slides: Slide[]; delay: number; width: number; height: number }) {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const n = slides.length;

  const go = (k: number) => {
    if (k === i) return;
    setPrev(i);
    setI(k);
  };

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setInterval(() => go((i + 1) % n), delay * 1000 + 1500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, n, delay, i]);

  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 1060);
    return () => clearTimeout(t);
  }, [prev]);

  return (
    <div className="relative block max-w-full" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative w-full">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${width} / ${height}` }}>
          {slides.map((s, k) => (
            <div
              key={s.src + k}
              className={`absolute inset-0 ${k === prev ? "z-[2]" : k === i ? "z-[1]" : "pointer-events-none z-0 opacity-0"}`}
              style={k === prev ? { animation: "dcore-crop 1000ms cubic-bezier(0.16, 1, 0.3, 1) forwards" } : undefined}
            >
              <Link href={s.href || "#"} className="block h-full">
                <img src={s.src} alt={s.alt} width={width} height={height} className="block size-full object-cover" loading={k === 0 ? "eager" : "lazy"} />
              </Link>
            </div>
          ))}
          <div className="absolute bottom-[12px] left-1/2 z-[3] flex max-w-[calc(100%-16px)] -translate-x-1/2 items-center justify-center gap-[7px] rounded-full bg-black/30 px-[11px] py-[7px] shadow-[0_4px_14px_rgba(0,0,0,0.25)] backdrop-blur-[6px] max-[471px]:bottom-[8px] max-[471px]:gap-[5px] max-[471px]:px-[8px] max-[471px]:py-[5px]">
            {slides.map((_, k) => (
              <button
                key={k}
                type="button"
                aria-label={`Slide ${k + 1}`}
                onClick={() => go(k)}
                className={`h-[8px] cursor-pointer rounded-full transition-all duration-300 ease-out max-[471px]:h-[6px] ${
                  k === i ? "w-[26px] bg-[#01aef1] shadow-[0_0_8px_rgba(1,174,241,0.8)] max-[471px]:w-[18px]" : "w-[8px] bg-white/65 hover:bg-white max-[471px]:w-[6px]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
