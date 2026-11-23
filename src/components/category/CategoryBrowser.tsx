"use client";
import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import type { Category, CatProduct } from "@/types/category";
import CatCard from "./CatCard";
import PriceSlider from "./PriceSlider";
import RefineCarousel from "./RefineCarousel";
import { useShop } from "@/components/shop/ShopProvider";

const SORTS: { value: string; label: string }[] = [
  { value: "p.sort_order|ASC", label: "Default" },
  { value: "pd.name|ASC", label: "Name (A - Z)" },
  { value: "pd.name|DESC", label: "Name (Z - A)" },
  { value: "p.price|ASC", label: "Price (Low > High)" },
  { value: "p.price|DESC", label: "Price (High > Low)" },
  { value: "rating|DESC", label: "Rating (Highest)" },
  { value: "rating|ASC", label: "Rating (Lowest)" },
  { value: "p.model|ASC", label: "Model (A - Z)" },
  { value: "p.model|DESC", label: "Model (Z - A)" },
];
const LIMITS = [16, 25, 50, 75, 100];
// the filter groups are listed price first, then availability, brand, and the rest (as the original theme orders them)
const rank = (code: string) => (code === "p" ? -10 : code === "q" ? -1 : code === "m" ? 0 : 100);
const num = (s: string | null) => (s ? Number(s.replace(/[^\d.]/g, "")) || 0 : 0);
const glyph = (c: string) => ({ "--i": `"${c}"` }) as CSSProperties;

function sortProducts(list: CatProduct[], sort: string) {
  const [field, dir] = sort.split("|");
  const out = [...list];
  const m = dir === "DESC" ? -1 : 1;
  if (field === "p.price") out.sort((a, b) => (num(a.price) - num(b.price)) * m);
  else if (field === "pd.name") out.sort((a, b) => a.name.localeCompare(b.name) * m);
  else if (field === "p.model") out.sort((a, b) => (a.model ?? "").localeCompare(b.model ?? "") * m);
  return out;
}

// Pagination links as OpenCart builds them: |< < 1 2 3 ... > >|  (8 numbers around the current page)
function pageList(page: number, pages: number) {
  const links = 8;
  let start = 1;
  let end = pages;
  if (pages > links) {
    start = page - Math.floor(links / 2);
    end = page + Math.floor(links / 2);
    if (start < 1) {
      end += Math.abs(start) + 1;
      start = 1;
    }
    if (end > pages) {
      start -= end - pages;
      end = pages;
    }
  }
  return { start, end };
}

const pgItem = "relative ml-[5px] block max-[769px]:mb-[5px] overflow-hidden rounded-[3px] border-l border-transparent first:ml-0 first:border-l-0";
const pgLink = "relative block cursor-pointer px-[6px] py-[5px] leading-[13px] text-[#01aef1] hover:text-[#01aef1]";
const pgIcon =
  "invisible before:visible before:absolute before:top-1/2 before:left-1/2 before:block before:h-[13px] before:w-[11.4px] before:-translate-x-1/2 before:-translate-y-1/2 before:font-[icomoon] before:text-[13px] before:leading-[13px] before:text-[#01aef1] before:content-(--i)";
const clearCls =
  "flex h-[20px] cursor-pointer items-center justify-center rounded-[3px] bg-[#000000] px-[6px] py-[2px] text-[12px] leading-[12px] font-normal text-white before:mr-[3px] before:block before:h-[12px] before:w-[12px] before:font-[icomoon] before:text-[12px] before:leading-[12px] before:content-(--i)";
const selectCls = "relative z-[2] h-[26px] rounded-[3px] border border-[#0000001f] bg-white text-[12px] max-[1025px]:text-[16px] text-[#000000b3]";
const labelCls = "relative flex h-[26px] items-center rounded-[3px] bg-[#e3f5fd] px-[10px] py-[5px] text-center text-[12px] leading-[18px] font-normal whitespace-nowrap text-[#000000b3] max-[471px]:hidden";

// The category page below the breadcrumb: filter column, toolbar, product tiles / rows, pagination, and the text blocks at the bottom.
export default function CategoryBrowser({ data, refine = [], top, bottom }: { data: Category; refine?: { title: string; href: string }[]; top?: React.ReactNode; bottom?: React.ReactNode }) {
  const { compare } = useShop();
  const price = data.filters.find((f) => f.type === "price");
  const [sort, setSort] = useState("p.price|ASC");
  const [touched, setTouched] = useState(false); // until the visitor picks a sort, the shop's own order is kept
  const [limit, setLimit] = useState(16);
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [range, setRange] = useState<[number, number]>(price && price.type === "price" ? [price.min, price.max] : [0, 0]);
  const [picked, setPicked] = useState<Record<string, string[]>>({});
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [drawer, setDrawer] = useState(false);

  const filtered = useMemo(() => {
    let list = data.products;
    for (const f of data.filters) {
      if (f.type !== "checkbox") continue;
      const sel = picked[f.code];
      if (!sel || !sel.length) continue;
      const ids = new Set(f.options.filter((o) => sel.includes(o.value)).flatMap((o) => o.ids));
      list = list.filter((p) => ids.has(p.id));
    }
    if (price && price.type === "price" && (range[0] > price.min || range[1] < price.max)) {
      list = list.filter((p) => {
        const v = num(p.price);
        return !p.requestPrice && v >= range[0] && v <= range[1];
      });
    }
    return touched ? sortProducts(list, sort) : list;
  }, [data, picked, range, sort, touched, price]);

  const pages = Math.max(1, Math.ceil(filtered.length / limit));
  const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * limit, cur * limit);
  const { start, end } = pageList(cur, pages);
  const go = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const reset = () => {
    setPicked({});
    if (price && price.type === "price") setRange([price.min, price.max]);
    setPage(1);
  };
  // typed prices are applied when the field loses focus (as in the original filter)
  const commitRange = (text: string, which: "min" | "max", lo: number, hi: number) => {
    const v = Number(text.replace(/\D/g, ""));
    if (!v && v !== 0) return;
    setRange(([a, b]) => (which === "min" ? [Math.min(Math.max(v, lo), b), b] : [a, Math.max(Math.min(v, hi), a)]));
    setPage(1);
  };
  const toggle = (code: string, value: string) => {
    setPicked((s) => {
      const cur2 = s[code] ?? [];
      return { ...s, [code]: cur2.includes(value) ? cur2.filter((v) => v !== value) : [...cur2, value] };
    });
    setPage(1);
  };

  const filterPanels = (
    <div className="-mt-[10px] flex flex-col shadow-[2px_2px_5px_1px_rgba(0,0,0,0.1)]">
      {[...data.filters].sort((a, b) => rank(a.code) - rank(b.code)).map((f, idx) => {
        const isOpen = open[f.code] ?? true;
        return (
          <div key={f.code} className="relative z-[1] mt-[10px]">
            <div className={`relative z-[2] rounded-t-[5px] border-b bg-[#f0fafe] shadow-[2px_2px_5px_1px_rgba(0,0,0,0.1)] ${idx === 0 ? "border-[#e3f5fd]" : "border-y border-[#0000001f]"}`}>
              <a
                aria-expanded={isOpen}
                onClick={() => setOpen((s) => ({ ...s, [f.code]: !isOpen }))}
                style={glyph(isOpen ? "" : "")}
                className="flex cursor-pointer items-center justify-between rounded-t-[5px] px-[10px] py-[7px] text-[13px] leading-[24.7px] font-medium text-[#000000] uppercase before:order-2 before:mr-[3px] before:block before:h-[13px] before:font-[icomoon] before:text-[13px] before:leading-[13px] before:content-(--i)"
              >
                <span>{f.title}</span>
              </a>
            </div>
            {isOpen && (
              <div className="relative z-[1]">
                <div className="max-h-[250px] overflow-auto rounded-b-[5px] border-b border-[#e3f5fd] bg-[#f0fafe] px-[10px] pt-[10px] pb-[20px]">
                  {f.type === "price" && price?.type === "price" ? (
                    <div className="pb-[10px]">
                      <div className="relative -top-[18px] h-[40px]">
                        <PriceSlider
                          min={f.min}
                          max={f.max}
                          from={range[0]}
                          to={range[1]}
                          onChange={(a, b) => {
                            setRange([a, b]);
                            setPage(1);
                          }}
                        />
                      </div>
                      <div className="relative flex items-center">
                        {([0, 1] as const).map((k) => (
                          <span key={k} className="contents">
                            <input
                              key={`${k}-${range[k]}`}
                              type="text"
                              name={k === 0 ? "min" : "max"}
                              defaultValue={range[k]}
                              onBlur={(e) => commitRange(e.target.value, k === 0 ? "min" : "max", f.min, f.max)}
                              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                              className="h-[32.5px] w-[90px] min-w-0 max-[1025px]:h-[34.4px] rounded-[3px] border border-[#0000001f] bg-white px-[2px] py-px text-center text-[13px] text-[#000000b3] outline-none"
                            />
                            <span className={`block px-[4px] ${k === 0 ? "mr-[14.25px]" : ""}`}>৳</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    f.type === "checkbox" && (
                      <div>
                        {f.options.map((o) => (
                          <label key={o.value} className="relative flex cursor-pointer items-center p-[5px] text-[14px] leading-[26.6px] font-normal">
                            <input type="checkbox" name={f.code} value={o.value} checked={(picked[f.code] ?? []).includes(o.value)} onChange={() => toggle(f.code, o.value)} className="mr-[2px] size-[13px]" />
                            <span className="mx-[5px] overflow-hidden">{o.label}</span>
                          </label>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const refineBlock = refine.length > 0 ? <RefineCarousel key={refine.map((r) => r.href).join("|")} items={refine} /> : null;

  const frame = "mx-auto flex w-full max-w-[1280px] flex-1 flex-col text-[15px] leading-[28.5px] font-medium text-[#000000]";

  // a category without products has no filter, no toolbar and uses the full width
  if (data.products.length === 0) {
    return (
      <div className={frame}>
        <div className="flex flex-1">
          <div className="flex min-w-0 flex-1 flex-col p-[20px] max-[471px]:p-[5px]">
            {top}
            {refineBlock}
            {!refineBlock && !top && (
              <div className="block">
                <p>There are no products to list in this category.</p>
                <div className="mt-[20px] text-right">
                  <Link href="/" className="inline-block rounded-[3px] bg-[#01aef1] px-[18px] py-[13px] text-[13px] leading-[13px] text-white uppercase">
                    Continue
                  </Link>
                </div>
              </div>
            )}
            {bottom}
          </div>
        </div>
      </div>
    );
  }

  const info = `Showing ${(cur - 1) * limit + 1} to ${Math.min(cur * limit, filtered.length)} of ${filtered.length} (${pages} Page${pages > 1 ? "s" : ""})`;

  return (
    <div className={frame}>
      <div className="flex flex-1">
        <aside className="block w-[260px] flex-none pr-[10px] pb-[10px] max-[1301px]:w-[240px] max-[1301px]:p-[20px] max-[769px]:hidden">
          <div className={`${top ? "" : "mt-[10px] "}mb-[30px]`}>
            <div className="flex flex-col">
              <h3 className="relative mb-[15px] h-[40.19px] rounded-[3px] bg-[#f0fafe] p-[10px] text-[16px] leading-[19.2px] font-medium text-black shadow-[2px_2px_5px_1px_rgba(0,0,0,0.1)]">
                <span>Filter</span>
                <button type="button" onClick={reset} style={glyph("")} className={`${clearCls} absolute top-[19.59px] right-[10px] -translate-y-1/2`}>
                  Clear
                </button>
              </h3>
              {filterPanels}
            </div>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col py-[20px] pl-[20px] max-[1301px]:px-[20px] max-[1301px]:pt-0 max-[1301px]:pb-[20px] max-[471px]:p-[5px]">
          {top}
          {refineBlock}
          <div className="block">
            <div className={`mb-[20px] flex flex-wrap items-center rounded-b-[5px] border-b border-[#d1effc] bg-[#f0fafe] p-[10px] shadow-[2px_2px_5px_1px_rgba(0,0,0,0.1)] ${top ? "" : "max-[1025px]:mt-[15px]"}`}>
              <div className="flex items-center">
                <button
                  type="button"
                  title="Grid"
                  onClick={() => setView("grid")}
                  style={glyph("")}
                  className="relative cursor-pointer text-center leading-[15px] before:inline before:font-[icomoon] before:text-[18px] before:text-[#000000] before:content-(--i)"
                />
                <button
                  type="button"
                  title="List"
                  onClick={() => setView("list")}
                  style={glyph("")}
                  className="relative ml-[10px] cursor-pointer text-center leading-[15px] before:inline before:font-[icomoon] before:text-[19px] before:text-[#000000] before:content-(--i)"
                />
                <Link
                  href="/compare"
                  style={glyph("")}
                  className="relative ml-[10px] flex items-center pl-[15px] text-[#000000] before:mr-[5px] before:block before:h-[34.19px] before:w-[18px] before:font-[icomoon] before:text-[18px] before:leading-[34.19px] before:content-(--i)"
                >
                  <span className="flex max-[471px]:hidden">Product Compare</span>
                  <span className="ml-[5px] flex h-[18.14px] min-w-[18.14px] flex-none max-[471px]:ml-0 items-center justify-center rounded-[50px] bg-[#01aef1] px-[3px] text-[11px] leading-[0] font-normal text-white shadow-[0_5px_7px_-9px_#000000]">
                    {compare.length}
                  </span>
                </Link>
              </div>
              <div className="ml-auto flex">
                <div className="relative mx-[10px] flex items-center">
                  <label htmlFor="input-sort" className={labelCls}>
                    Sort By:
                  </label>
                  <select
                    id="input-sort"
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setTouched(true);
                      setPage(1);
                    }}
                    className={`${selectCls} max-[471px]:w-[100px]`}
                  >
                    {SORTS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative flex items-center">
                  <label htmlFor="input-limit" className={labelCls}>
                    Show:
                  </label>
                  <select
                    id="input-limit"
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className={selectCls}
                  >
                    {LIMITS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className={view === "grid" ? "mt-[10px] -mr-[10px] -mb-[10px] -ml-[10px] flex flex-wrap" : "block"}>
              {shown.map((p) => (
                <CatCard key={p.id} p={p} view={view} />
              ))}
            </div>
            {filtered.length === 0 && <p>There are no products to list in this category.</p>}
            {filtered.length > 0 && (
              <div className="mt-[20px] flex items-center text-[13px] leading-[24.7px] tracking-[1px] max-[769px]:flex-wrap">
                <div className="relative text-left max-[769px]:w-full max-[769px]:text-center">
                  {pages > 1 && (
                    <ul className="flex max-[769px]:justify-center">
                      {cur > 1 && (
                        <>
                          <li className={`${pgItem} bg-[#f0fafe]`}>
                            <a aria-label="First page" onClick={() => go(1)} style={glyph("")} className={`${pgLink} ${pgIcon} before:rotate-180`}>
                              |&lt;
                            </a>
                          </li>
                          <li className={`${pgItem} bg-[#f0fafe]`}>
                            <a aria-label="Previous page" onClick={() => go(cur - 1)} style={glyph("")} className={`${pgLink} ${pgIcon} before:-rotate-90`}>
                              &lt;
                            </a>
                          </li>
                        </>
                      )}
                      {Array.from({ length: end - start + 1 }, (_, k) => start + k).map((n) =>
                        n === cur ? (
                          <li key={n} className={`${pgItem} bg-[#000000]`}>
                            <span className="relative z-[2] block px-[6px] py-[5px] leading-[13px] text-[#f0fafe]">{n}</span>
                          </li>
                        ) : (
                          <li key={n} className={`${pgItem} bg-[#f0fafe]`}>
                            <a onClick={() => go(n)} className={pgLink}>
                              {n}
                            </a>
                          </li>
                        ),
                      )}
                      {cur < pages && (
                        <>
                          <li className={`${pgItem} bg-[#f0fafe]`}>
                            <a aria-label="Next page" onClick={() => go(cur + 1)} style={glyph("")} className={`${pgLink} ${pgIcon} before:rotate-90`}>
                              &gt;
                            </a>
                          </li>
                          <li className={`${pgItem} bg-[#f0fafe]`}>
                            <a aria-label="Last page" onClick={() => go(pages)} style={glyph("")} className={`${pgLink} ${pgIcon}`}>
                              &gt;|
                            </a>
                          </li>
                        </>
                      )}
                    </ul>
                  )}
                </div>
                <div className="relative ml-auto text-right max-[769px]:ml-0 max-[769px]:w-full max-[769px]:text-center">{info}</div>
              </div>
            )}
          </div>
          {bottom}
        </div>
      </div>

      {/* on tablets and phones the filter opens as a drawer from the left */}
      <div onClick={() => setDrawer(false)} className={`fixed inset-0 z-[49999] bg-black/50 transition-opacity duration-[350ms] min-[769px]:hidden ${drawer ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <div
        aria-hidden={!drawer}
        className={`fixed top-0 bottom-0 left-0 z-[50000] w-[40%] bg-[#f0fafe] shadow-[0_15px_90px_-10px_rgba(0,0,0,0.2)] transition-[transform,visibility] duration-[350ms] max-[761px]:w-[85%] min-[769px]:hidden ${drawer ? "visible translate-x-0" : "invisible -translate-x-full"}`}
      >
        <div className="relative z-[1] flex h-[45px] items-center justify-between border-b border-[#0000001f]">
          <span className="flex h-[44px] items-center px-[12px] text-[13px] leading-[24.7px] font-bold text-[#00000099] capitalize">Filter</span>
          <div className="relative flex h-[44px] items-center">
            <button type="button" onClick={reset} style={glyph("")} className={`${clearCls} mr-[10px]`}>
              Clear
            </button>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setDrawer(false)}
              style={glyph("")}
              className="flex h-[44px] w-[45px] cursor-pointer items-center justify-center text-[25px] leading-[47.5px] before:mr-[3px] before:inline before:font-[icomoon] before:text-[#01aef1] before:content-(--i)"
            />
          </div>
        </div>
        <div className="h-[calc(100%-45px)] overflow-x-hidden overflow-y-auto p-[10px] pb-[55px]">{filterPanels}</div>
      </div>
      <button
        type="button"
        onClick={() => setDrawer(true)}
        style={glyph("")}
        className="fixed bottom-[20px] left-1/2 z-[100] flex -translate-x-1/2 cursor-pointer items-center rounded-[3px] bg-[#01aef1] py-[10px] pr-[20px] pl-[10px] text-[13px] leading-[13px] font-normal text-white capitalize shadow-[0_5px_7px_-9px_#000000] before:mr-[7px] before:block before:font-[icomoon] before:text-[20px] before:leading-[13px] before:content-(--i) min-[769px]:hidden"
      >
        Filter
      </button>
    </div>
  );
}
