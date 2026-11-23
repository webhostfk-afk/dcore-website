"use client";
import { useEffect, useState } from "react";
import type { CatProduct } from "@/types/category";
import CatCard from "@/components/category/CatCard";

type Set = { id: string; title: string; blurb: string; products: CatProduct[] };

const two = (n: number) => String(n).padStart(2, "0");

// "ENDING IN" box: days / hours / minutes / seconds left until the end of the offer (the last day is valid until 23:59).
function Countdown({ end }: { end: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const to = new Date(end + "T23:59:59").getTime();
    const tick = () => setLeft(Math.max(0, to - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [end]);
  const s = Math.floor((left ?? 0) / 1000);
  const parts = [
    ["Days", Math.floor(s / 86400)],
    ["Hours", Math.floor((s % 86400) / 3600)],
    ["Minutes", Math.floor((s % 3600) / 60)],
    ["Seconds", s % 60],
  ] as const;
  const over = left === 0;
  return (
    <div className="mx-auto my-[24px] w-max max-w-full rounded-[8px] border border-[#0000001a] bg-white px-[22px] py-[10px] text-center">
      <span className="block text-[13px] leading-[24px] font-bold tracking-[0.08em] text-[#000000]">{over ? "OFFER ENDED" : "ENDING IN"}</span>
      <div className="mt-[4px] flex justify-center gap-[14px] max-[471px]:gap-[8px]">
        {parts.map(([tag, n]) => (
          <span key={tag} className="flex flex-col items-center">
            <span className="flex gap-[3px]">
              {(left === null ? "--" : two(n)).split("").map((d, i) => (
                <span key={i} className="flex h-[30px] w-[24px] items-center justify-center rounded-[4px] bg-[#01aef1] text-[18px] leading-[18px] font-bold text-white max-[471px]:h-[26px] max-[471px]:w-[20px]">
                  {d}
                </span>
              ))}
            </span>
            <span className="mt-[3px] text-[11px] leading-[14px] font-normal text-[#00000099]">{tag}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// The page of one offer: a text box with the countdown, then "Shop by Category" (left) and the products of every category (right).
export default function OfferDetail({ heading, text, to, sets }: { heading: string; text: string[]; to: string; sets: Set[] }) {
  const [active, setActive] = useState(sets[0]?.id);
  const go = (id: string) => {
    setActive(id);
    const el = document.getElementById(`offer-set-${id}`);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110, behavior: "smooth" });
  };
  return (
    <div className="w-full bg-[#f0fafe] py-[20px] text-[15px] leading-[28.5px] font-medium text-[#000000]">
      <div className="mx-auto max-w-[1280px] px-[15px] max-[1301px]:px-[20px] max-[471px]:px-[10px]">
        <div className="rounded-[8px] bg-white px-[20px] py-[30px] text-center shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
          <h1 className="text-[28px] leading-[34px] font-bold text-[#000000] max-[471px]:text-[22px] max-[471px]:leading-[28px]">{heading}</h1>
          {text.map((t, i) => (
            <p key={i} className="mx-auto mt-[12px] max-w-[900px] text-[16px] leading-[26px] font-normal text-[#000000cc]">
              {t}
            </p>
          ))}
          <Countdown end={to} />
        </div>

        <div className="mt-[20px] flex max-[769px]:flex-col">
          <aside className="w-[260px] flex-none pr-[20px] max-[1301px]:w-[240px] max-[769px]:w-full max-[769px]:pr-0">
            <div className="sticky top-[110px] overflow-hidden rounded-[8px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] max-[769px]:static">
              <h3 className="border-b border-[#0000001a] px-[15px] py-[14px] text-[17px] leading-[22px] font-bold text-[#000000]">Shop by Category</h3>
              <ul className="max-[769px]:flex max-[769px]:overflow-x-auto">
                {sets.map((s) => (
                  <li key={s.id} className="max-[769px]:flex-none">
                    <button
                      type="button"
                      onClick={() => go(s.id)}
                      className={`block w-full cursor-pointer px-[15px] py-[10px] text-left text-[15px] leading-[20px] font-normal whitespace-nowrap transition-colors duration-150 hover:bg-[#f0fafe] hover:text-[#01aef1] ${
                        active === s.id ? "bg-[#f0fafe] font-bold text-[#01aef1]" : "text-[#000000]"
                      }`}
                    >
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <div className="min-w-0 flex-1 max-[769px]:mt-[20px]">
            {sets.map((s) => (
              <section key={s.id} id={`offer-set-${s.id}`} className="mb-[30px]">
                <h3 className="text-center text-[24px] leading-[30px] font-bold text-[#000000]">{s.title}</h3>
                <p className="mt-[2px] mb-[6px] text-center text-[15px] leading-[24px] font-normal text-[#000000b3]">{s.blurb}</p>
                {s.products.length === 0 ? (
                  <p className="text-center font-normal">No products in this offer right now.</p>
                ) : (
                  <div className="-m-[10px] mt-[6px] flex flex-wrap">
                    {s.products.map((p) => (
                      <CatCard key={p.id} p={p} view="grid" />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
