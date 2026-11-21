"use client";
import { Children, useEffect, useRef, useState } from "react";

// Sliding row of product cards: one card per step, autoplay every 3 s, paused while hovered, back to the start at the end.
export default function ProductCarousel({ children, peek = false }: { children: React.ReactNode; peek?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [max, setMax] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = Children.count(children);

  useEffect(() => {
    const measure = () => {
      const t = track.current;
      const b = box.current;
      const first = t?.children[0] as HTMLElement | undefined;
      if (!t || !b || !first) return;
      const gap = parseFloat(getComputedStyle(first).marginRight) || 0;
      const visible = Math.max(1, Math.round((b.clientWidth + gap) / (first.offsetWidth + gap)));
      const m = Math.max(0, count - visible);
      setMax(m);
      setIndex((i) => Math.min(i, m));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [count]);

  useEffect(() => {
    if (paused || max === 0) return;
    const t = setInterval(() => setIndex((i) => (i >= max ? 0 : i + 1)), 3000);
    return () => clearInterval(t);
  }, [paused, max]);

  useEffect(() => {
    const t = track.current;
    const first = t?.children[0] as HTMLElement | undefined;
    if (!t || !first) return;
    const gap = parseFloat(getComputedStyle(first).marginRight) || 0;
    t.style.transform = `translate3d(${-index * (first.offsetWidth + gap)}px,0,0)`;
  }, [index, max]);

  return (
    <div className="relative block pt-[10px]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div ref={box} className={`relative z-[1] block overflow-hidden ${peek ? "max-[761px]:overflow-visible" : ""}`}>
        <div ref={track} className="relative flex transition-transform duration-500">
          {children}
        </div>
      </div>
    </div>
  );
}
