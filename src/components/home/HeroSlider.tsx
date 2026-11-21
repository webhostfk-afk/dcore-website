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
    const t = setTimeout(() => setPrev(null), 760);
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
              style={k === prev ? { animation: "otech-crop 700ms cubic-bezier(0.55, 0, 0.3, 1) forwards" } : undefined}
            >
              <Link href={s.href || "#"} className="block h-full">
                <img src={s.src} alt={s.alt} width={width} height={height} className="block size-full object-cover" loading={k === 0 ? "eager" : "lazy"} />
              </Link>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-1/2 -my-[22px] w-max max-w-full -translate-x-1/2">
          <div className="flex flex-wrap justify-center">
            {slides.map((_, k) => (
              <div
                key={k}
                onClick={() => go(k)}
                className={`m-[5px] h-[7px] w-[25px] cursor-pointer hover:bg-[#e96631] max-[471px]:h-[5px] ${k === i ? "bg-[#e96631]" : "bg-[#696973]"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
