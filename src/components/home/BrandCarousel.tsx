"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Brand = { name: string; href: string; image: { src: string; width?: number; height?: number } };

// Brand logos: 8 per view (4 on phones), one step every 3 s, paused while hovered, back to the start at the end.
export default function BrandCarousel({ brands }: { brands: Brand[] }) {
  const box = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [max, setMax] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const measure = () => {
      const t = track.current;
      const b = box.current;
      const first = t?.children[0] as HTMLElement | undefined;
      if (!t || !b || !first) return;
      const step = first.offsetWidth + 10;
      const visible = Math.max(1, Math.round((b.clientWidth + 10) / step));
      const m = Math.max(0, brands.length - visible);
      setMax(m);
      setIndex((i) => Math.min(i, m));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [brands.length]);

  useEffect(() => {
    if (paused || max === 0) return;
    const t = setInterval(() => setIndex((i) => (i >= max ? 0 : i + 1)), 3000);
    return () => clearInterval(t);
  }, [paused, max]);

  useEffect(() => {
    const t = track.current;
    const first = t?.children[0] as HTMLElement | undefined;
    if (t && first) t.style.transform = `translate3d(${-index * (first.offsetWidth + 10)}px,0,0)`;
  }, [index, max]);

  return (
    <div className="relative block pb-[15px]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div ref={box} className="relative z-[1] block overflow-hidden">
        <div ref={track} className="relative flex transition-transform duration-[400ms]">
          {brands.map((b) => (
            <div key={b.href} className="relative mr-[10px] block w-[calc((100%-70px)/8-0.01px)] flex-none max-[471px]:w-[calc((100%-30px)/4-0.01px)]">
              <div className="relative flex flex-wrap rounded-[5px] bg-white">
                <div className="block w-full p-[11px]">
                  <Link href={b.href} className="block">
                    <img src={b.image.src} width={b.image.width} height={b.image.height} alt={b.name} title={b.name} className="block max-w-full rounded-[5px] align-middle" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
