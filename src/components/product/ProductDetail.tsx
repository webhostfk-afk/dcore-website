"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import type { ProductView, SideProduct } from "@/types/product";
import { useShop } from "@/components/shop/ShopProvider";
import { saveLabel } from "@/lib/save-label";
import { toNumber } from "@/lib/shop-store";

const LENS = 0.4; // the zoom lens covers this part of the picture (40% of its width / height)
const glyph = (code: string) => ({ "--i": `"${code}"` }) as CSSProperties;
const toolLinks = [
  { title: "PC Builder", href: "/pc-builder", icon: "" },
  { title: "EMI Information", href: "/offers", icon: "" },
  { title: "Online Pay Numbers", href: "#", icon: "", popup: 339 },
];
const DECLAIMER =
  "** অর্ডার করার পূর্বে কাস্টমার কেয়ার থেকে পন্যের স্টক ও ডেলিভারি সম্পর্কে জেনে নেয়ার অনুরোধ করা যাচ্ছে। আই টি পণ্যের মূল্য অস্থিতিশীল হওয়ায় কারণে যেকোন মুহূর্তে, যেকোন আই টি পণ্যের মূল্য পরিবর্তন হতে পারে। কল করুন: 01844600030, 09678800672";

const tabBtn = "relative flex items-center rounded-[3px] px-[12px] py-[7px] max-[471px]:px-[10px] max-[471px]:py-[5px] text-[12px] leading-[15px] font-bold whitespace-nowrap capitalize";
const iconBtn =
  "relative flex min-w-0 [&>span]:min-w-0 h-[40px] flex-1 cursor-pointer items-center justify-center rounded-[3px] border-2 border-solid border-[#01aef1] bg-white px-[15px] max-[471px]:px-[10px] py-[5px] text-center text-[12px] leading-[12px] font-normal whitespace-nowrap text-[#01aef1] capitalize before:mr-[5px] before:block before:h-[18px] before:w-[18px] before:font-[icomoon] before:text-[18px] before:leading-[18px] before:content-(--i)";

function Features({ v }: { v: NonNullable<ProductView["features"]> }) {
  const [more, setMore] = useState(false);
  const render = (items: { h: string; c: unknown[] }[], depth = 0): React.ReactNode => (
    <ul className={`mb-[10px] list-disc ${depth ? "pl-0" : "pl-[20px]"}`}>
      {items.map((it, i) => (
        <li key={i} className={it.h ? "" : "list-none"}>
          <span dangerouslySetInnerHTML={{ __html: it.h }} />
          {it.c.length > 0 && render(it.c as { h: string; c: unknown[] }[], it.h ? 0 : 1)}
        </li>
      ))}
    </ul>
  );
  void more;
  void setMore;
  return (
    <div data-pd="feat" className="mb-[15px] block max-[761px]:mb-0">
      <h3 className="my-[15px] text-[18px] leading-[21.6px] font-medium text-black">{v.title}</h3>
      <div className="flex flex-col">
        <div className="relative text-left">{render(v.items)}</div>
        <div className="text-left">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const t = document.getElementById("product-tabs");
              if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
            }}
            className="relative inline-block py-[6px] text-center leading-[15px] font-medium text-[#01aef1] capitalize underline-offset-4 hover:underline"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
}

function SideCard({ p }: { p: SideProduct }) {
  const shop = useShop();
  const item = { id: p.href, name: p.name, href: p.href.trim(), image: p.image?.src ?? "", model: "", price: toNumber(p.now || p.single) };
  const small = "relative mr-[8px] flex h-[30px] w-[36px] cursor-pointer items-center justify-center rounded-[3px] bg-white text-[#000000] before:block before:font-[icomoon] before:content-(--i)";
  return (
    <div className="relative flex [&:not(:first-child)]:mt-[10px]">
      <div className="relative flex min-w-0 flex-1 rounded-[3px] border border-[#0000001f] bg-white p-[7px] max-[471px]:flex-col">
        <div className="relative w-1/4 flex-none max-[471px]:w-full">
          <Link href={p.href.trim()} className="flex">
            {p.image && <img src={p.image.src} width={p.image.width} height={p.image.height} alt={p.name} title={p.name} className="size-full rounded-[3px]" />}
          </Link>
        </div>
        <div className="min-w-0 flex-1 pl-[8px] max-[471px]:pt-[8px] max-[471px]:pl-0">
          <div className="mb-[2px] text-[13px] leading-[16.9px]">
            <Link href={p.href.trim()} className="line-clamp-2 text-[#000000] hover:text-[#01aef1]">
              {p.name}
            </Link>
          </div>
          <div className="mb-[2px] flex items-center text-[14px] leading-[26.6px]">
            {p.now ? (
              <>
                <span className="mr-[5px] block leading-[18.9px] text-[#01aef1]">{p.now}</span>
                <span className="block text-[13px] leading-[17.55px] text-[#00000099] line-through">{p.old}</span>
              </>
            ) : (
              <span className="block leading-[18.9px] text-[#01aef1]">{p.single}</span>
            )}
          </div>
          <div className="-ml-[3px] flex">
            <a onClick={() => shop.addToCart(item, 1)} style={glyph("")} className={`${small} before:h-[14px] before:text-[14px] before:leading-[14px]`} title="Add to Cart" />
            <a onClick={() => shop.wishlist({ name: p.name, href: item.href, image: item.image })} style={glyph("")} className={`${small} before:h-[13px] before:text-[13px] before:leading-[13px]`} title="Add to Wish List" />
            <a
              onClick={() => shop.addToCompare({ id: item.id, name: p.name, href: item.href, image: item.image, model: "", brand: "", price: p.now || p.single, oldPrice: p.old })}
              style={glyph("")}
              className={`${small.replace("mr-[8px]", "")} before:h-[13px] before:text-[13px] before:leading-[13px]`}
              title="Compare this Product"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// The products the visitor looked at before (kept in this browser only); the current one is added once the page is shown.
const RECENT_KEY = "dcore-recent-products";
const RECENT_MAX = 8;
function readRecent(): SideProduct[] {
  try {
    const l = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(l) ? l : [];
  } catch {
    return [];
  }
}

// The product page body (gallery, details, tabs, "From same brand", tags), written with Tailwind.
export default function ProductDetail({ v, href }: { v: ProductView; href: string }) {
  const shop = useShop();
  const [cur, setCur] = useState(0);
  const [qty, setQty] = useState("1");
  const [open, setOpen] = useState(true);
  const [recent, setRecent] = useState<SideProduct[]>([]);
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://dcores.net${href}`; // the link that is shared (the shop address)
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null); // top-left of the zoom lens on the main picture (0..1)
  const [tab, setTab] = useState(Math.max(0, v.tabs.findIndex((t) => t.active)));
  const goTab = (i: number) => {
    setTab(i);
    const el = document.getElementById(`product-pane-${i}`);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
  };
  const model = v.stats.find((s) => /model/.test(s.cls))?.value ?? "";
  const brand = v.stats.find((s) => /manufacturer/.test(s.cls));
  const priceText = v.price.new || v.price.single;
  const request = v.request || !priceText; // no price (0) = nothing to sell: ask for the price instead
  const outStock = v.stats.some((x) => /out-of-stock/.test(x.cls));
  useEffect(() => {
    const list = readRecent().filter((p) => p.href.trim() !== href);
    setRecent(list.slice(0, 3));
    const me: SideProduct = { href, image: v.images[0] ?? v.thumbs[0] ?? null, name: v.title, now: v.price.new, old: v.price.old, single: v.price.single, tax: "", out: outStock };
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify([me, ...list].slice(0, RECENT_MAX)));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [href]);
  const q = () => Math.max(1, parseInt(qty, 10) || 1);
  const item = { id: v.id, name: v.title, href, image: v.thumbs[0]?.src ?? v.images[0]?.src ?? "", model, price: toNumber(priceText) };
  const ask = () => shop.askPrice({ id: v.id, name: v.title });
  const step = (d: number) => setQty(String(Math.max(1, q() + d)));
  const go = (n: number) => setCur(Math.max(0, Math.min(v.images.length - 1, n)));

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col text-[15px] leading-[28.5px] font-medium text-[#000000]">
      <div className="flex flex-1">
        <div className="min-w-0 flex-1 py-[20px] max-[1301px]:px-[20px] max-[1301px]:pt-0 max-[1301px]:pb-[20px]">
          {/* ---- gallery + details */}
          <div className="flex rounded-[5px] bg-white max-[471px]:flex-col">
            <div className="relative w-[45%] flex-none bg-white p-[10px] max-[471px]:w-full max-[471px]:px-[12px]">
              <div className="relative flex flex-col">
                <div className="mb-[10px] hidden items-center justify-between gap-[8px] whitespace-nowrap rounded-full border border-[#0000001f] px-[14px] py-[6px] text-[14px] leading-[22px] font-normal text-black max-[761px]:flex max-[471px]:text-[13px]">
                  <span className="flex items-center gap-[10px]">
                    Share:
                    <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className="flex">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 21l1.6-4.7A9 9 0 1112 21a9 9 0 01-4.3-1.1zM9 8c0 4 3 7 7 7l1-2-2-1-1 1c-1-.4-2.4-1.700-3-3l1-1-1-2z" /></svg>
                    </a>
                    <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Telegram" className="flex">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 4L3 11l6 2 2 6 3-4 5 4zM9 13l8-6" /></svg>
                    </a>
                    <button type="button" aria-label="Copy link" onClick={() => { try { navigator.clipboard.writeText(window.location.href); } catch {} setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="flex cursor-pointer">
                      {copied ? <span className="text-[12px] text-[#01aef1]">Copied</span> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.700l1-1" /></svg>}
                    </button>
                  </span>
                  <button type="button" onClick={() => shop.wishlist({ name: v.title, href, image: item.image })} className="flex cursor-pointer items-center gap-[4px]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z" /></svg>
                    Save
                  </button>
                  <button type="button" onClick={() => shop.addToCompare({ id: v.id, name: v.title, href, image: item.image, model, brand: brand?.value ?? "", price: priceText, oldPrice: v.price.old })} className="flex cursor-pointer items-center gap-[4px]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 3h14v14H5zM12 7v6M9 10h6M3 8v13h13" /></svg>
                    Compare
                  </button>
                </div>
                <div
                  className="relative aspect-square cursor-crosshair overflow-hidden max-[761px]:cursor-auto"
                  onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    const k = (n: number) => Math.min(1 - LENS, Math.max(0, n - LENS / 2));
                    setLens({ x: k((e.clientX - r.left) / r.width), y: k((e.clientY - r.top) / r.height) });
                  }}
                  onMouseLeave={() => setLens(null)}
                >
                  <div className="relative flex size-full transition-transform duration-300" style={{ transform: `translate3d(${-cur * 100}%,0,0)` }}>
                    {v.images.map((im, i) => (
                      <div key={im.src} className="relative size-full flex-none">
                        <img src={im.src} alt={im.alt} title={im.alt} width={im.width} height={im.height} loading={i === 0 ? "eager" : "lazy"} className="inline size-full" />
                      </div>
                    ))}
                  </div>
                  {v.labels.length > 0 && (
                    <div className="absolute inset-0 z-[1] flex flex-col overflow-hidden">
                      {v.labels.map((l) => (
                        <span key={l.text} className={`absolute left-0 mr-[5px] flex ${l.out ? "top-0" : "top-[5px]"}`}>
                          <b className={`relative flex min-w-[45px] items-center justify-center rounded-[3px] px-[5px] pt-[5px] pb-[6px] text-[11px] leading-[11px] font-bold whitespace-nowrap text-white uppercase ${l.out ? "bg-[#01aef1]" : "bg-[#01aef1]"}`}>{l.out ? l.text : saveLabel(l.text, v.price.new, v.price.old)}</b>
                        </span>
                      ))}
                    </div>
                  )}
                  {lens && <div className="pointer-events-none absolute z-[2] border border-[#00000040] bg-white/30 max-[761px]:hidden" style={{ width: `${LENS * 100}%`, height: `${LENS * 100}%`, left: `${lens.x * 100}%`, top: `${lens.y * 100}%` }} />}
                </div>
                {lens && v.images[cur] && (
                  <div
                    className="pointer-events-none absolute top-0 left-[calc(100%+10px)] z-[30] aspect-square w-full rounded-[5px] border border-[#0000001f] bg-white bg-no-repeat shadow-[0_10px_30px_rgba(0,0,0,0.18)] max-[761px]:hidden"
                    style={{ backgroundImage: `url(${v.images[cur].src})`, backgroundSize: `${100 / LENS}%`, backgroundPosition: `${(lens.x / (1 - LENS)) * 100}% ${(lens.y / (1 - LENS)) * 100}%` }}
                  />
                )}
                {v.thumbs.length > 1 && (
                  <div data-pd="thumbs" className="m-[15px] flex flex-wrap justify-center">
                    {v.thumbs.map((im, i) => (
                      <div key={im.src} onClick={() => go(i)} className="w-[10%] cursor-pointer p-[3px] max-[471px]:w-1/4">
                        <img src={im.src} alt={im.alt} width={im.width} height={im.height} className={`block h-auto w-full border bg-white transition-colors duration-150 ${i === cur ? "border-[#01aef1]" : "border-[#0000001f] hover:border-[#01aef1]"}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {v.banner?.image && (
                <div data-pd="banner" className="mt-[20px] flex flex-col p-[5px]">
                  {(() => {
                    const im = v.banner.image;
                    const pic = <img src={im.src} width={im.width || undefined} height={im.height || undefined} alt={im.alt} className="block h-auto w-full" />;
                    return v.banner.href ? (
                      <Link href={v.banner.href} className="block">
                        {pic}
                      </Link>
                    ) : (
                      <a className="block">{pic}</a>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="relative min-w-0 flex-1 max-[471px]:w-full">
              <div className="flex flex-col py-[15px] pr-[10px] pl-[15px]">
                <div data-pd="title" className="mt-[10px] text-left text-[20px] leading-[24px] max-[761px]:text-[#01aef1] max-[359px]:text-[13px] max-[359px]:leading-[15.6px] text-black">{v.title}</div>
                <div data-pd="stats" className="mb-[10px] flex justify-between p-[3px] max-[761px]:mt-[10px] max-[761px]:mb-[20px]">
                  <ul className="flex flex-1 flex-wrap overflow-auto">
                    {v.stats.map((s, i) => (
                      <li key={i} className="mt-[10px] mr-[10px] flex items-center bg-[#d1effc] px-[12px] max-[761px]:rounded-full max-[761px]:px-[14px] max-[761px]:text-[13px]">
                        {s.plain ? (
                          <span>
                            {s.value}
                            {/price\s*:\s*$/i.test(s.value.trim()) ? " On request" : ""}
                          </span>
                        ) : (
                          <>
                            <b className="mr-[3px] text-[14px] leading-[26.6px] font-normal">{s.label}</b>
                            {s.href ? (
                              <Link href={s.href} className="flex flex-col text-[#01aef1]">
                                {s.value}
                              </Link>
                            ) : (
                              <span className={/in-stock/.test(s.cls) ? "text-[14px] leading-[26.6px] font-bold text-[#01aef1]" : /out-of-stock/.test(s.cls) ? "text-[14px] leading-[26.6px] font-bold text-[#000000]" : "text-[14px] leading-[26.6px]"}>{s.value || (/price/i.test(s.label) ? "Price on request" : "")}
                                {/price\s*:\s*$/i.test(s.value.trim()) ? " On request" : ""}
                              </span>
                            )}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {v.features && <Features v={v.features} />}

                {/* price */}
                <div data-pd="price" className={`my-[10px] flex-col text-left ${priceText ? "flex" : "hidden"}`}>
                  <div className="flex items-center text-[26px] leading-[26px] font-bold whitespace-nowrap text-black">
                    {v.price.new ? (
                      <>
                        <div className="text-[#01aef1]">{v.price.new}</div>
                        <div className="-mb-[5px] ml-[10px] text-[16px] leading-[16px] text-[#00000099] line-through">{v.price.old}</div>
                      </>
                    ) : (
                      v.price.single && <div className="text-[#01aef1]">{v.price.single}</div>
                    )}
                  </div>
                  {v.price.discounts.length > 0 && (
                    <div className="mt-[5px] text-[14px] leading-[20px] font-normal text-[#00000099]">
                      {v.price.discounts.map((d) => (
                        <div key={d}>{d}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* buttons */}
                <div className="max-[471px]:-mx-[15px] max-[471px]:pb-[15px]">
                  <div className="flex flex-wrap items-center">
                    <div data-pd="step" className={`-ml-[30px] max-[361px]:-ml-[15px] ${outStock ? "hidden" : "flex"} w-full flex-wrap items-center max-[471px]:mt-[10px]`}>
                      {!request && !v.stepperHidden && (
                        <div className="relative ml-[30px] flex h-[44px] w-[100px] items-center border border-[#0000001f] max-[471px]:ml-[26px] max-[471px]:h-[40px] max-[471px]:w-[80px]">
                          <input
                            id="product-quantity"
                            type="text"
                            name="quantity"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            className="h-full min-w-0 flex-1 bg-[#f0fafe] pr-[25px] pl-[2px] text-center leading-[19.5px] text-[#000000b3] outline-none"
                          />
                          <span className="absolute top-0 left-[73px] z-[10] flex h-full w-[25px] flex-col max-[471px]:left-[52px] max-[471px]:w-[26px]">
                            {[
                              ["", 1],
                              ["", -1],
                            ].map(([c, d]) => (
                              <i
                                key={String(d)}
                                onClick={() => step(Number(d))}
                                style={glyph(String(c))}
                                className="flex h-1/2 w-full cursor-pointer items-center justify-center bg-[#e3f5fd] text-[#00000099] before:block before:h-[15px] before:w-[12px] before:font-[icomoon] before:text-[15px] before:leading-[15px] before:content-(--i)"
                              />
                            ))}
                          </span>
                        </div>
                      )}
                      {request ? (
                        <a onClick={ask} className="relative ml-[30px] flex h-[44px] cursor-pointer items-center justify-center rounded-[3px] bg-[#000000] px-[15px] py-[13px] text-center text-[13px] leading-[13px] font-normal whitespace-nowrap text-white uppercase max-[471px]:h-[41px]">
                          <i className="fa fa-question-circle mr-[5px] text-[11px]" /> <span className="block">{v.askText || "Request Price"}</span>
                        </a>
                      ) : (
                        <>
                          <div className="mx-[15px] flex text-[0px] leading-[0px] max-[471px]:mx-[15px]">
                            <a
                              onClick={() => shop.addToCart(item, q(), true)}
                              style={glyph("")}
                              className="relative flex h-[44px] w-[250px] cursor-pointer items-center justify-center rounded-[3px] max-[471px]:h-[41px] bg-[#01aef1] max-[1301px]:w-auto max-[471px]:w-auto py-[13px] pr-[15px] pl-[10px] max-[471px]:pl-[15px] text-center text-[13px] leading-[13px] font-normal whitespace-nowrap text-[#f0fafe] capitalize before:block before:font-[icomoon] before:text-[22px] before:leading-[22px] before:content-(--i) max-[471px]:before:hidden"
                            >
                              <span className="px-[5.2px] max-[471px]:px-0">Buy Now</span>
                            </a>
                          </div>
                          <a
                            onClick={() => shop.addToCart(item, q())}
                            style={glyph("")}
                            className="relative flex h-[44px] w-[250px] cursor-pointer items-center justify-center rounded-[3px] max-[471px]:h-[41px] bg-black max-[1301px]:w-auto px-[15px] py-[13px] text-center text-[13px] leading-[13px] font-normal whitespace-nowrap text-white uppercase before:mr-[5px] before:block before:font-[icomoon] before:text-[18px] before:leading-[18px] before:content-(--i) max-[471px]:before:hidden"
                          >
                            <span>Add to Cart</span>
                          </a>
                        </>
                      )}
                    </div>
                    <div data-pd="wl" className={`${request ? "mt-[6px]" : "mt-[10px]"} max-[471px]:mt-[5px] flex w-full max-[761px]:hidden items-center justify-center max-[471px]:w-[calc(100%-10px)] max-[471px]:pl-[5px]`}>
                      <a onClick={() => shop.wishlist({ name: v.title, href, image: item.image })} style={glyph("")} className={`${iconBtn} mr-[5px] max-[761px]:px-[10px]`}>
                        <span>Add to Wish List</span>
                      </a>
                      <a
                        onClick={() => shop.addToCompare({ id: v.id, name: v.title, href, image: item.image, model, brand: brand?.value ?? "", price: priceText, oldPrice: v.price.old })}
                        style={glyph("")}
                        className={`${iconBtn} min-w-0 before:text-[#000000]`}
                      >
                        <span>Compare this Product</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* tools + disclaimer */}
                <div className="mb-[15px] block max-[761px]:mb-0">
                  <div data-pd="tools" className="pt-[10px] max-[761px]:mt-[20px] max-[761px]:pt-0">
                    <div className="flex max-[761px]:flex-col">
                      {toolLinks.map((l) => (
                        <div key={l.title} className="w-1/3 p-[2.5px] max-[761px]:w-full">
                          <Link
                            href={l.href}
                            {...(l.popup ? { "data-popup": l.popup } : {})}
                            style={glyph(l.icon)}
                            className="relative flex h-full min-h-[30px] bg-[#0000001f] text-left before:flex before:min-h-[30px] before:w-[40px] before:flex-none before:items-center before:justify-center before:bg-[#000000] before:font-[icomoon] before:text-[15px] before:text-white before:content-(--i)"
                          >
                            <div className="flex flex-col justify-center pl-[10px]">
                              <div className="text-[13px] leading-[24.7px] font-bold text-black">{l.title}</div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div data-pd="acc" className="relative mt-[15px]">
                    <h4 className="my-[15px] text-[13px] leading-[16.5px] uppercase">
                      <a
                        onClick={() => setOpen((x) => !x)}
                        style={glyph(open ? "" : "")}
                        className="flex cursor-pointer items-center justify-between text-[15px] text-[#000000] before:order-2 before:mr-[3px] before:block before:h-[15px] before:font-[icomoon] before:text-[15px] before:leading-[15px] before:content-(--i)"
                      >
                        Product Information Declaimer
                      </a>
                    </h4>
                    <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <div className="text-left max-[761px]:text-center">{DECLAIMER}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---- tabs and "from same brand" */}
          <div className="mt-[20px] flex max-[471px]:flex-col" id="product-tabs">
            <div className="relative w-3/4 max-[471px]:w-full max-[471px]:px-[5px]">
              <ul className="-mb-px flex overflow-x-auto overflow-y-hidden">
                {v.tabs.map((x, i) => (
                  <li key={x.title} className={`relative mr-[20px] flex h-[30px] max-[471px]:h-[26px] rounded-[3px] last:mr-0 ${i === tab ? "z-[2]" : ""}`}>
                    <a onClick={() => goTab(i)} className={`${tabBtn} h-[29px] max-[471px]:h-[25px] cursor-pointer ${i === tab ? "z-[1] bg-[#01aef1] text-white" : "z-[1] bg-white text-[#000000]"}`}>
                      {x.title}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="relative pt-[20px]">
                {v.tabs.map((t, ti) => (
                  <div key={t.title} id={`product-pane-${ti}`} className="mb-[15px] max-[1025px]:mb-[25px]">
                    <div className="relative flex flex-col bg-white p-[10px]">
                      {t.kind === "description" && <div className="legacy-html relative block text-left" dangerouslySetInnerHTML={{ __html: t.html ?? "" }} />}
                      {t.kind === "compat" && (
                        <div className="block text-left">
                          <h3 className="my-[15px] text-[20px] leading-[22px] font-medium">{t.title2}</h3>
                          <div className="block min-h-[0.01%] overflow-x-auto">
                            <table className="w-full max-w-full border-separate border-spacing-0">
                              <thead>
                                <tr>
                                  {(t.head ?? []).map((h, i) => (
                                    <td key={i} className="bg-white px-[14px] py-[8px] align-middle text-[14px] leading-[20px] font-bold text-[#01aef1] capitalize">
                                      {h}
                                    </td>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {(t.rows ?? []).map((r) => (
                                  <tr key={r.href + r.name}>
                                    <td className="border-b border-[#e3f5fd] bg-white px-[14px] py-[8px] align-middle text-[14px] leading-[20px] text-black max-[471px]:text-[13px] max-[471px]:leading-[18.5714px]">
                                      <Link href={r.href} className="inline-block text-[#01aef1]">
                                        {r.name}
                                      </Link>
                                    </td>
                                    <td className="border-b border-[#e3f5fd] bg-white px-[14px] py-[8px] align-middle text-[14px] leading-[20px] text-black max-[471px]:text-[13px] max-[471px]:leading-[18.5714px]">
                                      <p className="block text-[14px] leading-[20px] whitespace-nowrap text-[#000000cc] max-[471px]:text-[13px] max-[471px]:leading-[18.5714px]">
                                        {r.now ? (
                                          <>
                                            <span className="font-semibold text-[#01aef1]">{r.now}</span>{" "}
                                            <span className="ml-[10px] text-[#00000080] line-through">{r.old}</span>
                                          </>
                                        ) : (
                                          r.single
                                        )}
                                      </p>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                      {t.kind === "review" && (
                        <form className="relative block text-left" onSubmit={(e) => e.preventDefault()}>
                          <div className="block">
                            <p>There are no reviews for this product.</p>
                          </div>
                          <h4 className="mt-[10px] mb-[15px] text-[18px] leading-[19.8px] font-medium uppercase">Write a review</h4>
                          <div className="relative mb-[8px] flex max-[471px]:mb-[3px] flex-wrap">
                            <label htmlFor="input-name" className="flex min-h-px w-[150px] flex-none pt-[7px] pb-[5px] text-[14px] leading-[26.6px] max-[471px]:pt-[6.5px] max-[471px]:pb-[2.5px] max-[471px]:text-[12px] max-[471px]:leading-[22.8px] font-normal after:ml-[3px] after:text-[#01aef1] after:content-['*']">
                              Your Name
                            </label>
                            <input id="input-name" name="name" type="text" className="block h-[38px] max-[471px]:h-[32px] min-w-[200px] max-w-[500px] flex-1 max-[471px]:max-w-none rounded-[3px] border border-[#0000001f] bg-white px-[12px] py-[6px] text-[14px] leading-[18.2px] text-[#000000b3] outline-none" />
                          </div>
                          <div className="relative mb-[8px] flex max-[471px]:mb-[3px] flex-wrap">
                            <label htmlFor="input-review" className="flex w-[150px] flex-none pt-[7px] pb-[5px] text-[14px] leading-[26.6px] max-[471px]:pt-[6.5px] max-[471px]:pb-[2.5px] max-[471px]:text-[12px] max-[471px]:leading-[22.8px] font-normal after:ml-[3px] after:text-[#01aef1] after:content-['*']">
                              Your Review
                            </label>
                            <div className="min-w-[200px] max-w-[790px] flex-1">
                              <textarea id="input-review" name="text" rows={5} className="block h-[100px] w-full rounded-[3px] border border-[#0000001f] bg-white px-[12px] py-[6px] text-[14px] leading-[18.2px] text-[#000000b3] outline-none" />
                              <div className="mt-[5px] block text-[14px] text-[#00000099]">
                                <span className="text-[#01aef1]">Note:</span> HTML is not translated!
                              </div>
                            </div>
                          </div>
                          <div className="relative mb-[8px] flex max-[471px]:mb-[3px] flex-wrap">
                            <label className="flex w-[150px] flex-none pt-[7px] pb-[5px] text-[14px] leading-[26.6px] max-[471px]:pt-[6.5px] max-[471px]:pb-[2.5px] max-[471px]:text-[12px] max-[471px]:leading-[22.8px] font-normal after:ml-[3px] after:text-[#01aef1] after:content-['*']">Rating</label>
                            <div className="relative flex min-h-[35px] max-[471px]:min-h-[31px] min-w-[200px] max-w-[790px] flex-1 flex-wrap items-center">
                              <span>Bad</span>
                              {[1, 2, 3, 4, 5].map((n) => (
                                <input key={n} type="radio" name="rating" value={n} className="mx-[5px] max-[471px]:mx-[6px]" />
                              ))}
                              <span>Good</span>
                            </div>
                          </div>
                          <div className="mt-[20px] max-[471px]:mt-[23px] flex justify-end">
                            <button type="button" className="relative flex w-full cursor-pointer items-center justify-center rounded-[3px] bg-[#000000] px-[18px] py-[13px] text-center text-[13px] leading-[13px] font-normal text-white uppercase">
                              Continue
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative w-1/4 px-[10px] max-[471px]:w-full">
              <div className="flex flex-col">
                {recent.length > 0 && (
                  <div className="mb-[20px] block">
                    <h3 className="mt-[10px] text-left text-[20px] leading-[24px] max-[359px]:text-[13px] max-[359px]:leading-[15.6px] font-medium text-black">Recently Viewed</h3>
                    <div className="flex flex-col">
                      {recent.map((p) => (
                        <SideCard key={p.href} p={p} />
                      ))}
                    </div>
                  </div>
                )}
                {v.side && (
                  <div className="mb-[20px] block">
                    <h3 className="mt-[10px] text-left text-[20px] leading-[24px] max-[359px]:text-[13px] max-[359px]:leading-[15.6px] font-medium text-black">{v.side.title}</h3>
                    <div className="flex flex-col">
                      {v.side.items.map((p) => (
                        <SideCard key={p.href} p={p} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {v.tags && (
            <div className="mt-[15px] flex flex-wrap items-center text-[13px] leading-[24.7px] font-bold text-black">
              <span className="mr-[8px] mb-[8px] block">{v.tags.title}</span>
              {v.tags.links.map((l) => (
                <Link key={l.href + l.text} href={l.href} className="mr-[8px] mb-[8px] block rounded-[99px] bg-[#f0fafe] px-[8px] font-normal text-black">
                  {l.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
