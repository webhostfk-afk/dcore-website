"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { toNumber } from "@/lib/shop-store";
import { useShop } from "./ShopProvider";

type Detail = { model: string; brand: string; stock: string; features: string[] };
type Hit = { id: string; name: string; href: string; image: string; price: string | null; oldPrice: string | null };
const MAX = 4;

const Search = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-4-4" />
  </svg>
);

// "Search and Select Product": type two letters, pick a product from the list, it is added to the comparison.
function Picker({ taken, onPick, onRemove }: { taken: string[]; onPick: (h: Hit) => void; onRemove?: () => void }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = q.trim();
    if (t.length < 2) return;
    const ctl = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(t)}`, { signal: ctl.signal })
        .then((r) => r.json())
        .then((l: Hit[]) => setHits(l.filter((x) => !taken.includes(x.id))))
        .catch(() => {});
    }, 200);
    return () => {
      clearTimeout(timer);
      ctl.abort();
    };
  }, [q, taken]);

  useEffect(() => {
    const away = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, []);

  const shown = q.trim().length < 2 ? [] : hits;
  return (
    <div ref={box} className="relative">
      <div className="flex h-[42px] items-center rounded-[3px] border border-[#0000001f] bg-[#f0fafe] pr-[10px] pl-[14px] focus-within:border-[#01aef1]">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search and Select Product"
          aria-label="Search and Select Product"
          className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-black outline-none placeholder:text-[#00000080]"
        />
        {onRemove ? (
          <button type="button" aria-label="Remove product" onClick={onRemove} className="ml-[6px] flex size-[24px] cursor-pointer items-center justify-center text-[20px] leading-none text-[#000000b3] hover:text-[#01aef1]">
            ×
          </button>
        ) : (
          <span className="ml-[6px] text-[#000000b3]">
            <Search />
          </span>
        )}
      </div>
      {open && shown.length > 0 && (
        <ul className="absolute top-[44px] left-0 z-[30] max-h-[320px] w-[min(340px,calc(100vw-30px))] overflow-y-auto rounded-[3px] border border-[#0000001f] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
          {shown.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => {
                  onPick(h);
                  setQ("");
                  setOpen(false);
                }}
                className="flex w-full cursor-pointer items-center gap-[10px] border-b border-[#0000001a] px-[10px] py-[8px] text-left last:border-b-0 hover:bg-[#f0fafe]"
              >
                {h.image && <img src={h.image} alt="" width={44} height={44} className="size-[44px] flex-none object-contain" />}
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 block text-[13px] leading-[18px] font-medium text-black">{h.name}</span>
                  <span className="block text-[13px] leading-[18px] font-bold text-[#01aef1]">{h.price ?? "On request"}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const cellBase = "border-l border-[#0000001a] first:border-l-0 px-[14px] py-[12px] text-[14px] leading-[22px] font-normal text-black max-[471px]:px-[8px] max-[471px]:text-[13px]";
const rowLine = "border-t border-[#0000001a]";

export default function CompareView() {
  const { compare, removeFromCompare, addToCompare, addToCart } = useShop();
  const [details, setDetails] = useState<Record<string, Detail>>({});
  const [copied, setCopied] = useState(false);
  const [specOpen, setSpecOpen] = useState(true);
  const n = compare.length;
  const slots = Math.min(MAX, Math.max(2, n + 1));
  const ids = useMemo(() => compare.map((p) => p.id), [compare]);
  const idKey = ids.join(",");
  const slugKey = compare.map((p) => encodeURIComponent(p.href.split("/").filter(Boolean).pop() ?? "")).join(",");

  useEffect(() => {
    if (!idKey) return;
    let off = false;
    fetch(`/api/compare?ids=${idKey}&slugs=${slugKey}`)
      .then((r) => r.json())
      .then((d: Record<string, Detail>) => !off && setDetails((o) => ({ ...o, ...d })))
      .catch(() => {});
    return () => {
      off = true;
    };
  }, [idKey, slugKey]);

  const share = () => {
    const text = ["Product Comparison", ...compare.map((p) => `${p.name} - ${window.location.origin}${p.href}`)].join("\n");
    try {
      navigator.clipboard.writeText(text);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // "Label: value" features become rows of the table (the labels of all products together); the other lines go into one row
  const parsed = compare.map((p) => {
    const map = new Map<string, string>();
    const others: string[] = [];
    for (const t of details[p.id]?.features ?? []) {
      const m = /^([^:\d][^:]{1,39}?[^\d\s:]):\s*(.+)$/.exec(t);
      if (m && !map.has(m[1].trim())) map.set(m[1].trim(), m[2].trim());
      else others.push(t);
    }
    return { map, others };
  });
  const labels = [...new Set(parsed.flatMap((x) => [...x.map.keys()]))];
  // phones show only two products at a time: the last two that were added (the label of a row becomes a bar above its two cells)
  const cols = { "--cd": `minmax(120px,0.75fr) repeat(${slots}, minmax(180px,1fr))` } as CSSProperties;
  const gridCls = "grid grid-cols-[var(--cd)] max-[640px]:grid-cols-2";
  const first = Math.max(0, n - 2);
  const mob = (i: number) => (i >= first && i < first + 2 ? "" : "max-[640px]:hidden");
  const cells = Array.from({ length: slots }, (_, i) => compare[i] ?? null);
  const row = (label: string, render: (i: number) => React.ReactNode, emptyOnPhone = false) => (
    <div key={label} className={`${gridCls} ${rowLine} ${emptyOnPhone ? "max-[640px]:hidden" : ""}`} style={cols}>
      <div className={`${cellBase} text-[#00000099] max-[640px]:col-span-2 max-[640px]:border-l-0 max-[640px]:bg-[#f0fafe] max-[640px]:py-[6px] max-[640px]:text-center max-[640px]:text-[13px] max-[640px]:font-bold`}>{label}</div>
      {cells.map((p, i) => (
        <div key={i} className={`${cellBase} ${mob(i)}`}>
          {p ? render(i) : null}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-[#f0fafe] py-[20px] text-[15px] leading-[28.5px] font-medium text-[#000000] max-[471px]:py-[10px]">
      <div className="mx-auto max-w-[1280px] px-[15px] max-[471px]:px-[8px]">
        <div className="rounded-[6px] bg-white px-[20px] py-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] max-[471px]:px-[10px]">
          <div className="flex items-start justify-between gap-[12px] border-b border-[#0000001a] pb-[18px] max-[640px]:flex-col max-[640px]:items-center max-[640px]:text-center">
            <div>
              <h1 className="text-[18px] leading-[24px] font-bold text-black">Product Comparison</h1>
              <p className="mt-[4px] text-[15px] leading-[22px] font-normal text-[#000000b3]">Find and select products to see the differences and similarities between them</p>
            </div>
            <div className="flex gap-[10px]">
              <button type="button" onClick={() => window.print()} className="flex h-[42px] cursor-pointer items-center gap-[8px] rounded-[4px] bg-[#f0fafe] px-[18px] text-[14px] leading-[14px] font-bold text-black hover:bg-[#e3f5fd] print:hidden">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z" />
                </svg>
                Print
              </button>
              <button type="button" onClick={share} disabled={n === 0} className="flex h-[42px] cursor-pointer items-center gap-[8px] rounded-[4px] bg-[#01aef1] px-[22px] text-[14px] leading-[14px] font-bold text-white transition-colors hover:bg-[#0189bc] disabled:cursor-default disabled:opacity-50 print:hidden">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 4l-6 16-3-7-7-3zM11 13l9-9" />
                </svg>
                {copied ? "Copied" : "Share"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[var(--mw)] max-[640px]:min-w-0" style={{ "--mw": `${120 + slots * 180}px` } as CSSProperties}>
              {/* pick / remove */}
              <div className={gridCls} style={cols}>
                <div className={`${cellBase} pt-[16px] text-[#00000099] max-[640px]:hidden`}>You can add Max {MAX} Products</div>
                {cells.map((p, i) => (
                  <div key={i} className={`${cellBase} ${mob(i)} pt-[14px]`}>
                    <Picker taken={ids} onPick={(h) => addToCompare({ id: h.id, name: h.name, href: h.href, image: h.image, model: "", brand: "", price: h.price ?? "", oldPrice: h.oldPrice ?? "" })} onRemove={p ? () => removeFromCompare(p.id) : undefined} />
                  </div>
                ))}
              </div>

              {/* picture, name, price, buy */}
              <div className={gridCls} style={cols}>
                <div className={`${cellBase} max-[640px]:hidden`} />
                {cells.map((p, i) =>
                  p ? (
                    <div key={i} className={`${cellBase} ${mob(i)} flex flex-col items-center text-center`}>
                      <Link href={p.href} className="block">
                        {p.image ? (
                          <img src={p.image} width={200} height={200} alt={p.name} title={p.name} className="mx-auto block size-[200px] object-contain max-[471px]:size-[140px]" />
                        ) : (
                          <span className="mx-auto block size-[200px] rounded-[4px] bg-[#f0fafe] max-[471px]:size-[140px]" />
                        )}
                      </Link>
                      <Link href={p.href} className="mt-[10px] block text-[15px] leading-[21px] font-bold text-black hover:text-[#01aef1]">
                        {p.name}
                      </Link>
                      <div className="mt-[8px] flex items-baseline justify-center gap-[8px]">
                        <span className="text-[22px] leading-[28px] font-bold text-[#01aef1] max-[471px]:text-[18px]">{toNumber(p.price) > 0 ? p.price : "On request"}</span>
                        {p.oldPrice && <span className="text-[13px] font-normal text-[#00000080] line-through">{p.oldPrice}</span>}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className={`${cellBase} ${mob(i)} flex items-center justify-center text-center text-[#000000b3]`}>
                      {n === 0 || i === n ? "Find and select product to compare" : ""}
                    </div>
                  ),
                )}
              </div>

              {row("Model", (i) => details[cells[i]!.id]?.model || cells[i]!.model || "-")}
              {row("Brand", (i) => details[cells[i]!.id]?.brand || cells[i]!.brand || "-")}
              {row("Availability", (i) => details[cells[i]!.id]?.stock ?? "In Stock")}
              {row("Rating", () => (
                <span className="inline-flex items-center gap-[5px] rounded-full bg-[#f0fafe] px-[10px] py-[1px] text-[13px] text-[#000000b3]">
                  <span className="text-[#01aef1]">★</span>
                  <b className="font-bold text-black">0/5</b> (0 Reviews)
                </span>
              ))}
              {n > 0 && (
                <>
                  {row("Summary", (i) => {
                    const f = details[cells[i]!.id]?.features ?? [];
                    return f.length ? (
                      <div>
                        {f.slice(0, 4).map((t, k) => (
                          <div key={k}>{t}</div>
                        ))}
                      </div>
                    ) : (
                      "-"
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setSpecOpen((o) => !o)}
                    aria-expanded={specOpen}
                    className={`${rowLine} flex w-full cursor-pointer items-center justify-between bg-[#f0fafe] px-[14px] py-[10px] text-left text-[17px] leading-[24px] font-bold text-[#01aef1]`}
                  >
                    Specification
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${specOpen ? "" : "-rotate-90"}`} aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${specOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      {labels.map((l) => row(l, (i) => parsed[i].map.get(l) ?? "", !parsed.slice(first, first + 2).some((x) => x.map.has(l))))}
                      {row("Other Features", (i) =>
                        parsed[i].others.length ? (
                          <ul className="list-disc pl-[18px]">
                            {parsed[i].others.map((t, k) => (
                              <li key={k}>{t}</li>
                            ))}
                          </ul>
                        ) : (
                          ""
                        ),
                        !parsed.slice(first, first + 2).some((x) => x.others.length),
                      )}
                    </div>
                  </div>
                  <div className={`${gridCls} border-t border-[#0000001a] print:hidden`} style={cols}>
                    <div className={`${cellBase} max-[640px]:hidden`} />
                    {cells.map((p, i) => (
                      <div key={i} className={`${cellBase} ${mob(i)}`}>
                        {p && (
                          <button
                            type="button"
                            onClick={() => addToCart({ id: p.id, name: p.name, href: p.href, image: p.image, model: p.model, price: toNumber(p.price) }, 1, true)}
                            className="h-[40px] w-full cursor-pointer rounded-[4px] bg-[#01aef1] text-[14px] leading-[14px] font-bold text-white transition-colors hover:bg-[#0189bc]"
                          >
                            {toNumber(p.price) > 0 ? "Buy Now" : "Request Price"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
