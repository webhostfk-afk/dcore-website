"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import type { ProductView, SideProduct } from "@/types/product";
import { useShop } from "@/components/shop/ShopProvider";
import { toNumber } from "@/lib/shop-store";

const glyph = (code: string) => ({ "--i": `"${code}"` }) as CSSProperties;
const infoIcons = ["", "", ""];
const infoColors = ["bg-[#075e54]", "bg-[#0866ff]", "bg-[#24a1de]"];
const infoLinks = [
  { title: "WhatsApp", href: "https://api.whatsapp.com/send?phone=8801844678806" },
  { title: "Messenger", href: "https://m.me/otech.technologies" },
  { title: "Telegram", href: "https://t.me/otech_technologies" },
];
const toolLinks = [
  { title: "PC Builder", href: "/pc-builder", icon: "" },
  { title: "EMI Information", href: "/offers", icon: "" },
  { title: "Online Pay Numbers", href: "#", icon: "", popup: 339 },
];
const DECLAIMER =
  "** অর্ডার করার পূর্বে কাস্টমার কেয়ার থেকে পন্যের স্টক ও ডেলিভারি সম্পর্কে জেনে নেয়ার অনুরোধ করা যাচ্ছে। আই টি পণ্যের মূল্য অস্থিতিশীল হওয়ায় কারণে যেকোন মুহূর্তে, যেকোন আই টি পণ্যের মূল্য পরিবর্তন হতে পারে। কল করুন: 01844678800, 01844678806, 01844678801";

const tabBtn = "relative flex items-center rounded-[3px] px-[12px] py-[7px] max-[471px]:px-[10px] max-[471px]:py-[5px] text-[12px] leading-[15px] font-bold whitespace-nowrap capitalize";
const iconBtn =
  "relative flex min-w-0 [&>span]:min-w-0 h-[40px] flex-1 cursor-pointer items-center justify-center rounded-[3px] border-2 border-solid border-[#142b6b] bg-white px-[15px] max-[471px]:px-[10px] py-[5px] text-center text-[12px] leading-[12px] font-normal whitespace-nowrap text-[#142b6b] capitalize before:mr-[5px] before:block before:h-[18px] before:w-[18px] before:font-[icomoon] before:text-[18px] before:leading-[18px] before:content-(--i)";

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
            className="relative inline-block rounded-[3px] bg-[#e4212a] px-[18px] py-[13px] text-center leading-[15px] text-white capitalize shadow-[0_10px_30px_-5px_rgba(198,194,194,0.2)]"
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
  const small = "relative mr-[8px] flex h-[30px] w-[36px] cursor-pointer items-center justify-center rounded-[3px] bg-white text-[#1a202c] before:block before:font-[icomoon] before:content-(--i)";
  return (
    <div className="relative flex [&:not(:first-child)]:mt-[10px]">
      <div className="relative flex min-w-0 flex-1 rounded-[3px] border border-[#e2e2e2] bg-white p-[7px] max-[471px]:flex-col">
        <div className="relative w-1/4 flex-none max-[471px]:w-full">
          <Link href={p.href.trim()} className="flex">
            {p.image && <img src={p.image.src} width={p.image.width} height={p.image.height} alt={p.name} title={p.name} className="size-full rounded-[3px]" />}
          </Link>
        </div>
        <div className="min-w-0 flex-1 pl-[8px] max-[471px]:pt-[8px] max-[471px]:pl-0">
          <div className="mb-[2px] text-[13px] leading-[16.9px]">
            <Link href={p.href.trim()} className="block text-[#333] hover:text-[#db2427]">
              {p.name}
            </Link>
          </div>
          <div className="mb-[2px] flex items-center text-[14px] leading-[26.6px]">
            {p.now ? (
              <>
                <span className="mr-[5px] block leading-[18.9px] text-[#e4212a]">{p.now}</span>
                <span className="block text-[13px] leading-[17.55px] text-[#696973] line-through">{p.old}</span>
              </>
            ) : (
              <span className="block leading-[18.9px] text-[#e4212a]">{p.single}</span>
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

// The product page body (gallery, details, tabs, "From same brand", tags), written with Tailwind.
export default function ProductDetail({ v, href }: { v: ProductView; href: string }) {
  const shop = useShop();
  const [cur, setCur] = useState(0);
  const [qty, setQty] = useState("1");
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState(Math.max(0, v.tabs.findIndex((t) => t.active)));
  const goTab = (i: number) => {
    setTab(i);
    const el = document.getElementById(`product-pane-${i}`);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
  };
  const model = v.stats.find((s) => /model/.test(s.cls))?.value ?? "";
  const brand = v.stats.find((s) => /manufacturer/.test(s.cls));
  const priceText = v.price.new || v.price.single;
  const outStock = v.stats.some((x) => /out-of-stock/.test(x.cls));
  const q = () => Math.max(1, parseInt(qty, 10) || 1);
  const item = { id: v.id, name: v.title, href, image: v.thumbs[0]?.src ?? v.images[0]?.src ?? "", model, price: toNumber(priceText) };
  const ask = () => shop.askPrice({ id: v.id, name: v.title });
  const step = (d: number) => setQty(String(Math.max(1, q() + d)));
  const go = (n: number) => setCur(Math.max(0, Math.min(v.images.length - 1, n)));

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col text-[15px] leading-[28.5px] font-medium text-[#333]">
      <div className="flex flex-1">
        <div className="min-w-0 flex-1 py-[20px] max-[1301px]:px-[20px] max-[1301px]:pt-0 max-[1301px]:pb-[20px]">
          {/* ---- gallery + details */}
          <div className="flex rounded-[5px] bg-white max-[471px]:flex-col">
            <div className="relative w-[45%] flex-none bg-white p-[10px] max-[471px]:w-full max-[471px]:px-[12px]">
              <div className="relative flex flex-col">
                <div className="relative aspect-square overflow-hidden">
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
                          <b className={`relative flex min-w-[45px] items-center justify-center rounded-[3px] px-[5px] pt-[5px] pb-[6px] text-[11px] leading-[11px] font-bold whitespace-nowrap text-white uppercase ${l.out ? "bg-[#e4212a]" : "bg-[#db2427]"}`}>{l.text}</b>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {v.thumbs.length > 1 && (
                  <div data-pd="thumbs" className="m-[15px] flex flex-wrap justify-center">
                    {v.thumbs.map((im, i) => (
                      <div key={im.src} onClick={() => go(i)} className="w-[10%] cursor-pointer max-[471px]:w-1/4">
                        <img src={im.src} alt={im.alt} width={im.width} height={im.height} className={`inline h-auto border-b border-transparent bg-[#eee] ${i === v.thumbs.length - 1 ? "w-[calc(100%-1px)]" : "w-full"}`} />
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
                <div data-pd="title" className="mt-[10px] text-left text-[20px] leading-[24px] max-[359px]:text-[13px] max-[359px]:leading-[15.6px] text-black">{v.title}</div>
                {v.minimum && (
                  <div className="-mt-[6px] mb-[9px] rounded-[3px] border border-[#bce8f1] bg-[#d9edf7] p-[15px] text-left text-[#31708f]">
                    <i className="fa fa-info-circle mr-[4.8px]" /> {v.minimum}
                  </div>
                )}
                <div data-pd="stats" className="mb-[10px] flex justify-between p-[3px] max-[761px]:mt-[10px] max-[761px]:mb-[20px]">
                  <ul className="flex flex-1 flex-wrap overflow-auto">
                    {v.stats.map((s, i) => (
                      <li key={i} className="mt-[10px] mr-[10px] flex items-center rounded-[3px] bg-[#ddd] px-[10px]">
                        {s.plain ? (
                          <span>{s.value}</span>
                        ) : (
                          <>
                            <b className="mr-[3px] text-[14px] leading-[26.6px] font-normal">{s.label}</b>
                            {s.href ? (
                              <Link href={s.href} className="flex flex-col text-[#337ab7]">
                                {s.value}
                              </Link>
                            ) : (
                              <span className={/in-stock/.test(s.cls) ? "text-[14px] leading-[26.6px] font-bold text-[#50ad55]" : /out-of-stock/.test(s.cls) ? "text-[14px] leading-[26.6px] font-bold text-[#ff0101]" : "text-[14px] leading-[26.6px]"}>{s.value}</span>
                            )}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* chat links */}
                <div data-pd="chat" className="mb-[15px] max-[761px]:mb-[10px]">
                  <div className="-ml-[3px] flex rounded-[5px]">
                    {infoLinks.map((l, i) => (
                      <div key={l.title} className="w-1/5 flex-none p-[5px] max-[1025px]:w-1/4 max-[761px]:w-1/6 max-[471px]:w-auto">
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={glyph(infoIcons[i])}
                          className={`relative flex h-[40px] w-full rounded-[5px] max-[761px]:overflow-hidden max-[471px]:w-[40px] ${infoColors[i]} text-left before:flex before:size-[40px] before:flex-none before:items-center before:justify-center before:font-[icomoon] before:text-[25px] before:text-white before:content-(--i)`}
                        >
                          <div className="flex flex-col justify-center">
                            <div className="font-normal text-white max-[471px]:hidden">{l.title}</div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {v.features && <Features v={v.features} />}

                {/* price */}
                <div data-pd="price" className={`my-[10px] flex-col text-left ${priceText ? "flex" : "hidden"}`}>
                  <div className="flex items-center text-[26px] leading-[26px] font-bold whitespace-nowrap text-black">
                    {v.price.new ? (
                      <>
                        <div className="text-[#f25438]">{v.price.new}</div>
                        <div className="-mb-[5px] ml-[10px] text-[16px] leading-[16px] text-[#696973] line-through">{v.price.old}</div>
                      </>
                    ) : (
                      v.price.single && <div className="text-[#f25438]">{v.price.single}</div>
                    )}
                  </div>
                  {v.price.discounts.length > 0 && (
                    <div className="mt-[5px] text-[14px] leading-[20px] font-normal text-[#696973]">
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
                      {!v.request && !v.stepperHidden && (
                        <div className="relative ml-[30px] flex h-[44px] w-[100px] items-center border border-[#e2e2e2] max-[471px]:ml-[26px] max-[471px]:h-[40px] max-[471px]:w-[80px]">
                          <input
                            id="product-quantity"
                            type="text"
                            name="quantity"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            className="h-full min-w-0 flex-1 bg-[#f2f3f7] pr-[25px] pl-[2px] text-center leading-[19.5px] text-[#555] outline-none"
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
                                className="flex h-1/2 w-full cursor-pointer items-center justify-center bg-[#e6e6e6] text-[#696973] before:block before:h-[15px] before:w-[12px] before:font-[icomoon] before:text-[15px] before:leading-[15px] before:content-(--i)"
                              />
                            ))}
                          </span>
                        </div>
                      )}
                      {v.request ? (
                        <a onClick={ask} className="relative ml-[30px] flex h-[44px] cursor-pointer items-center justify-center rounded-[3px] bg-[#1a202c] px-[15px] py-[13px] text-center text-[13px] leading-[13px] font-normal whitespace-nowrap text-white uppercase max-[471px]:h-[41px]">
                          <i className="fa fa-question-circle mr-[5px] text-[11px]" /> <span className="block">{v.askText || "Request Price"}</span>
                        </a>
                      ) : (
                        <>
                          <div className="mx-[15px] flex text-[0px] leading-[0px] max-[471px]:mx-[15px]">
                            <a
                              onClick={() => shop.addToCart(item, q(), true)}
                              style={glyph("")}
                              className="relative flex h-[44px] w-[250px] cursor-pointer items-center justify-center rounded-[3px] max-[471px]:h-[41px] bg-[#db2427] max-[1301px]:w-auto max-[471px]:w-auto py-[13px] pr-[15px] pl-[10px] max-[471px]:pl-[15px] text-center text-[13px] leading-[13px] font-normal whitespace-nowrap text-[#f2f3f7] capitalize before:block before:font-[icomoon] before:text-[22px] before:leading-[22px] before:content-(--i) max-[471px]:before:hidden"
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
                    <div data-pd="wl" className={`${v.request ? "mt-[6px]" : "mt-[10px]"} max-[471px]:mt-[5px] flex w-full items-center justify-center max-[471px]:w-[calc(100%-10px)] max-[471px]:pl-[5px]`}>
                      <a onClick={() => shop.wishlist({ name: v.title, href, image: item.image })} style={glyph("")} className={`${iconBtn} mr-[5px] max-[761px]:px-[10px]`}>
                        <span>Add to Wish List</span>
                      </a>
                      <a
                        onClick={() => shop.addToCompare({ id: v.id, name: v.title, href, image: item.image, model, brand: brand?.value ?? "", price: priceText, oldPrice: v.price.old })}
                        style={glyph("")}
                        className={`${iconBtn} min-w-0 before:text-[#1a202c]`}
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
                            className="relative flex h-full min-h-[30px] bg-[#e2e2e2] text-left before:flex before:min-h-[30px] before:w-[40px] before:flex-none before:items-center before:justify-center before:bg-[#070707] before:font-[icomoon] before:text-[15px] before:text-white before:content-(--i)"
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
                        className="flex cursor-pointer items-center justify-between text-[15px] text-[#1a202c] before:order-2 before:mr-[3px] before:block before:h-[15px] before:font-[icomoon] before:text-[15px] before:leading-[15px] before:content-(--i)"
                      >
                        Product Information Declaimer
                      </a>
                    </h4>
                    {open && <div className="text-left max-[761px]:text-center">{DECLAIMER}</div>}
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
                    <a onClick={() => goTab(i)} className={`${tabBtn} h-[29px] max-[471px]:h-[25px] cursor-pointer ${i === tab ? "z-[1] bg-[#e4212a] text-white" : "z-[1] bg-white text-[#0f1625]"}`}>
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
                                    <td key={i} className="bg-white px-[14px] py-[8px] align-middle text-[14px] leading-[20px] font-bold text-[#2c3a96] capitalize">
                                      {h}
                                    </td>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {(t.rows ?? []).map((r) => (
                                  <tr key={r.href + r.name}>
                                    <td className="border-b border-[#eee] bg-white px-[14px] py-[8px] align-middle text-[14px] leading-[20px] text-black max-[471px]:text-[13px] max-[471px]:leading-[18.5714px]">
                                      <Link href={r.href} className="inline-block text-[#337ab7]">
                                        {r.name}
                                      </Link>
                                    </td>
                                    <td className="border-b border-[#eee] bg-white px-[14px] py-[8px] align-middle text-[14px] leading-[20px] text-black max-[471px]:text-[13px] max-[471px]:leading-[18.5714px]">
                                      <p className="block text-[14px] leading-[20px] whitespace-nowrap text-[#444] max-[471px]:text-[13px] max-[471px]:leading-[18.5714px]">
                                        {r.now ? (
                                          <>
                                            <span className="font-semibold text-[#f85639]">{r.now}</span>{" "}
                                            <span className="ml-[10px] text-[#999] line-through">{r.old}</span>
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
                          <div className="block text-center">
                            <button
                              type="button"
                              onClick={() => document.getElementById("product-tabs")?.scrollIntoView({ behavior: "smooth" })}
                              className="relative inline-flex cursor-pointer items-center justify-center rounded-[3px] bg-[#1a202c] px-[18px] py-[13px] text-center align-middle text-[13px] leading-[13px] font-normal text-white uppercase"
                            >
                              View Details
                            </button>
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
                            <label htmlFor="input-name" className="flex min-h-px w-[150px] flex-none pt-[7px] pb-[5px] text-[14px] leading-[26.6px] max-[471px]:pt-[6.5px] max-[471px]:pb-[2.5px] max-[471px]:text-[12px] max-[471px]:leading-[22.8px] font-normal after:ml-[3px] after:text-[#e4212a] after:content-['*']">
                              Your Name
                            </label>
                            <input id="input-name" name="name" type="text" className="block h-[38px] max-[471px]:h-[32px] min-w-[200px] max-w-[500px] flex-1 max-[471px]:max-w-none rounded-[3px] border border-[#e2e2e2] bg-white px-[12px] py-[6px] text-[14px] leading-[18.2px] text-[#555] outline-none" />
                          </div>
                          <div className="relative mb-[8px] flex max-[471px]:mb-[3px] flex-wrap">
                            <label htmlFor="input-review" className="flex w-[150px] flex-none pt-[7px] pb-[5px] text-[14px] leading-[26.6px] max-[471px]:pt-[6.5px] max-[471px]:pb-[2.5px] max-[471px]:text-[12px] max-[471px]:leading-[22.8px] font-normal after:ml-[3px] after:text-[#e4212a] after:content-['*']">
                              Your Review
                            </label>
                            <div className="min-w-[200px] max-w-[790px] flex-1">
                              <textarea id="input-review" name="text" rows={5} className="block h-[100px] w-full rounded-[3px] border border-[#e2e2e2] bg-white px-[12px] py-[6px] text-[14px] leading-[18.2px] text-[#555] outline-none" />
                              <div className="mt-[5px] block text-[14px] text-[#737373]">
                                <span className="text-[#e4212a]">Note:</span> HTML is not translated!
                              </div>
                            </div>
                          </div>
                          <div className="relative mb-[8px] flex max-[471px]:mb-[3px] flex-wrap">
                            <label className="flex w-[150px] flex-none pt-[7px] pb-[5px] text-[14px] leading-[26.6px] max-[471px]:pt-[6.5px] max-[471px]:pb-[2.5px] max-[471px]:text-[12px] max-[471px]:leading-[22.8px] font-normal after:ml-[3px] after:text-[#e4212a] after:content-['*']">Rating</label>
                            <div className="relative flex min-h-[35px] max-[471px]:min-h-[31px] min-w-[200px] max-w-[790px] flex-1 flex-wrap items-center">
                              <span>Bad</span>
                              {[1, 2, 3, 4, 5].map((n) => (
                                <input key={n} type="radio" name="rating" value={n} className="mx-[5px] max-[471px]:mx-[6px]" />
                              ))}
                              <span>Good</span>
                            </div>
                          </div>
                          <div className="mt-[20px] max-[471px]:mt-[23px] flex justify-end">
                            <button type="button" className="relative flex w-full cursor-pointer items-center justify-center rounded-[3px] bg-[#1a202c] px-[18px] py-[13px] text-center text-[13px] leading-[13px] font-normal text-white uppercase">
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
              {v.side && (
                <div className="flex flex-col">
                  <div className="mb-[20px] block">
                    <h3 className="mt-[10px] text-left text-[20px] leading-[24px] max-[359px]:text-[13px] max-[359px]:leading-[15.6px] font-medium text-black">{v.side.title}</h3>
                    <div className="flex flex-col">
                      {v.side.items.map((p) => (
                        <SideCard key={p.href} p={p} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {v.tags && (
            <div className="mt-[15px] flex flex-wrap items-center text-[13px] leading-[24.7px] font-bold text-black">
              <span className="mr-[8px] mb-[8px] block">{v.tags.title}</span>
              {v.tags.links.map((l) => (
                <Link key={l.href + l.text} href={l.href} className="mr-[8px] mb-[8px] block rounded-[99px] bg-[#f2f3f7] px-[8px] font-normal text-black">
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
