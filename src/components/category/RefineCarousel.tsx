"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Item = { title: string; href: string };

function Arrow({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={dir === "left" ? "Previous categories" : "Next categories"}
      onClick={onClick}
      className={`absolute top-1/2 z-[2] flex size-[34px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[#000000] shadow-[0_3px_10px_rgba(0,0,0,0.22)] transition-colors duration-200 hover:bg-[#01aef1] hover:text-white max-[471px]:size-[28px] ${
        dir === "left" ? "left-0" : "right-0"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={dir === "left" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"} />
      </svg>
    </button>
  );
}

// The sub-categories of a category in one row; every name stays on one line. When they do not all fit, the arrows turn the row round like a
// wheel: the tile that leaves on one side comes back on the other side (an endless loop).
export default function RefineCarousel({ items }: { items: Item[] }) {
  const [list, setList] = useState(items);
  const [shift, setShift] = useState(0); // px
  const [anim, setAnim] = useState(false);
  const [loop, setLoop] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  // arrows only when the tiles do not fit into the row
  useEffect(() => {
    const measure = () => {
      if (busy.current || !box.current || !track.current) return;
      setLoop(track.current.scrollWidth > box.current.clientWidth + 1);
    };
    const ro = new ResizeObserver(measure); // it reports once at the start too
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, [list]);

  const width = (i: number) => (track.current?.children[i] as HTMLElement | undefined)?.offsetWidth ?? 0;

  const next = () => {
    if (busy.current) return;
    busy.current = true;
    setAnim(true);
    setShift(-width(0));
    setTimeout(() => {
      setAnim(false);
      setList((l) => [...l.slice(1), l[0]]);
      setShift(0);
      busy.current = false;
    }, 340);
  };

  const prev = () => {
    if (busy.current) return;
    busy.current = true;
    setAnim(false);
    setList((l) => [l[l.length - 1], ...l.slice(0, -1)]);
    requestAnimationFrame(() => {
      setShift(-width(0));
      requestAnimationFrame(() => {
        setAnim(true);
        setShift(0);
        setTimeout(() => {
          setAnim(false);
          busy.current = false;
        }, 340);
      });
    });
  };

  return (
    <div className="relative block rounded-t-[5px] bg-[#f0fafe] p-[10px]">
      <div className={`relative ${loop ? "px-[42px] max-[471px]:px-[34px]" : ""}`}>
        <div ref={box} className="overflow-hidden">
          <div
            ref={track}
            className={`flex w-max min-w-full flex-nowrap ${anim ? "transition-transform duration-[340ms] ease-in-out" : ""}`}
            style={{ transform: `translateX(${shift}px)` }}
          >
            {list.map((r) => (
              <div key={r.href} className="flex flex-none p-[8px] max-[471px]:p-[5px]">
                <Link
                  href={r.href}
                  className="flex h-full items-center justify-center rounded-[5px] border border-[#0000001f] bg-white px-[20px] py-[12px] text-[13px] leading-[1.2] whitespace-nowrap text-[#000000] transition-all duration-200 hover:border-[#01aef1] hover:text-[#01aef1] hover:shadow-[0_6px_16px_-6px_rgba(1,174,241,0.55)] max-[471px]:px-[14px]"
                >
                  {r.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
        {loop && (
          <>
            <Arrow dir="left" onClick={prev} />
            <Arrow dir="right" onClick={next} />
          </>
        )}
      </div>
    </div>
  );
}
