"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import { EMPTY_BUILD as EMPTY, buildStore, type Pick } from "@/lib/pcbuild-store";
import { cartStore, money } from "@/lib/shop-store";
import type { BuilderProduct, Slot } from "@/lib/pcbuilder";


// small line icons of the parts (one per slot)
const PATHS: Record<string, string> = {
  cpu: "M7 7h10v10H7zM10 10h4v4h-4zM9 3v4M12 3v4M15 3v4M9 17v4M12 17v4M15 17v4M3 9h4M3 12h4M3 15h4M17 9h4M17 12h4M17 15h4",
  cooler: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 12c0-4 2-6 5-6M12 12c4 0 6 2 6 5M12 12c0 4-2 6-5 6M12 12c-4 0-6-2-6-5",
  board: "M4 4h16v16H4zM8 8h5v5H8zM15 7h2M15 10h2M8 16h8M17 14v3",
  ram: "M3 8h18v7H3zM6 15v3M10 15v3M14 15v3M18 15v3M7 11h2M11 11h2M15 11h2",
  storage: "M5 4h14v16H5zM9 14a3 3 0 106 0 3 3 0 00-6 0zM9 8h6",
  psu: "M4 6h16v12H4zM8 12a3 3 0 106 0 3 3 0 00-6 0zM17 9h1M17 12h1M17 15h1",
  case: "M7 3h10v18H7zM10 6h4M10 9h4M12 17h.01",
  monitor: "M3 5h18v11H3zM9 20h6M12 16v4",
  fan: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 12c0-3 1.5-5 4-5M12 12c3 0 5 1.5 5 4M12 12c0 3-1.5 5-4 5M12 12c-3 0-5-1.5-5-4",
  keyboard: "M3 7h18v10H3zM6 10h1M9 10h1M12 10h1M15 10h1M18 10h.01M7 14h10",
  paste: "M9 3h6v5l2 3v10H7V11l2-3zM9 14h6",
};
function Icon({ name, size = 30 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name] ?? PATHS.board} />
    </svg>
  );
}

const act = "flex cursor-pointer flex-col items-center gap-[2px] border-r border-[#0000001a] px-[18px] text-[13px] leading-[18px] font-normal text-[#000000b3] max-[471px]:text-[#01aef1] transition-colors last:border-r-0 hover:text-[#01aef1] max-[471px]:px-[10px]";

// The chooser: all products of one part, with a search box and a sort order; "Add" puts the product into the build.
function Chooser({ slot, products, onPick, onClose }: { slot: Slot; products: BuilderProduct[]; onPick: (p: BuilderProduct) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("default");
  const [brand, setBrand] = useState("");
  const brands = useMemo(() => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(), [products]);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    const l = products.filter((p) => (!t || (p.name + " " + p.model).toLowerCase().includes(t)) && (!brand || p.brand === brand));
    if (sort === "low") l.sort((a, b) => a.price - b.price);
    if (sort === "high") l.sort((a, b) => b.price - a.price);
    return l;
  }, [products, q, sort, brand]);
  const field = "h-[38px] rounded-[3px] border border-[#0000001f] bg-white px-[10px] text-[14px] font-normal text-black outline-none focus:border-[#01aef1]";
  return (
    <div className="fixed inset-0 z-[60000] flex items-start justify-center overflow-y-auto bg-black/50 p-[20px] max-[471px]:p-[8px]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-[900px] rounded-[6px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between border-b border-[#0000001a] px-[20px] py-[14px]">
          <h3 className="text-[20px] leading-[26px] font-bold text-black">Choose {slot.name}</h3>
          <button type="button" aria-label="Close" onClick={onClose} className="flex size-[34px] cursor-pointer items-center justify-center rounded-full text-[22px] leading-none text-[#000000b3] hover:bg-[#f0fafe] hover:text-[#01aef1]">
            ×
          </button>
        </div>
        <div className="flex flex-wrap gap-[10px] border-b border-[#0000001a] bg-[#f0fafe] px-[20px] py-[12px]">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className={`${field} min-w-[160px] flex-1`} />
          {brands.length > 1 && (
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className={field}>
              <option value="">All brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          )}
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={field}>
            <option value="default">Default</option>
            <option value="low">Price (Low &gt; High)</option>
            <option value="high">Price (High &gt; Low)</option>
          </select>
        </div>
        <div className="px-[20px] py-[6px]">
          {list.length === 0 && <p className="py-[30px] text-center font-normal text-[#00000099]">No products found.</p>}
          {list.map((p) => (
            <div key={p.id} className="flex items-center gap-[14px] border-b border-[#0000001a] py-[12px] last:border-b-0 max-[471px]:flex-wrap">
              <div className="size-[80px] flex-none">{p.image && <img src={p.image} alt={p.name} width={80} height={80} className="size-full object-contain" />}</div>
              <div className="min-w-0 flex-1">
                <Link href={p.href} target="_blank" className="block text-[15px] leading-[21px] font-medium text-black hover:text-[#01aef1]">
                  {p.name}
                </Link>
                <div className="text-[13px] leading-[20px] font-normal text-[#00000099]">{[p.brand && `Brand: ${p.brand}`, p.model && `Model: ${p.model}`].filter(Boolean).join("  ·  ")}</div>
                <div className="mt-[2px] flex items-center gap-[8px] text-[17px] leading-[24px] font-bold text-[#01aef1]">
                  {money(p.price)}
                  {p.oldPrice > p.price && <span className="text-[13px] font-normal text-[#00000080] line-through">{money(p.oldPrice)}</span>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onPick(p)}
                className="h-[38px] flex-none cursor-pointer rounded-[4px] border-2 border-[#01aef1] px-[22px] text-[14px] leading-[14px] font-bold text-[#01aef1] transition-colors hover:bg-[#01aef1] hover:text-white"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PcBuilder({ slots, products }: { slots: Slot[]; products: Record<string, BuilderProduct[]> }) {
  const router = useRouter();
  const build = useSyncExternalStore(buildStore.subscribe, buildStore.getSnapshot, buildStore.getServerSnapshot);
  const [choosing, setChoosing] = useState<Slot | null>(null);
  const [hide, setHide] = useState(false);
  const [error, setError] = useState("");

  const picks = slots.filter((s) => build[s.id]);
  const total = picks.reduce((n, s) => n + build[s.id].p.price * build[s.id].qty, 0);
  const items = picks.reduce((n, s) => n + build[s.id].qty, 0);

  const set = (id: string, v: Pick | null) => {
    const next = { ...build };
    if (v) next[id] = v;
    else delete next[id];
    buildStore.set(next);
  };
  const setQty = (id: string, qty: number) => set(id, { ...build[id], qty: Math.max(1, Math.min(99, qty || 1)) });

  const addToCart = () => {
    const missing = slots.filter((s) => s.required && !build[s.id]).map((s) => s.name);
    if (missing.length) return setError(`Please choose the required parts first: ${missing.join(", ")}.`);
    if (picks.length === 0) return setError("Please choose some parts first.");
    setError("");
    let cart = cartStore.getSnapshot();
    for (const s of picks) {
      const { p, qty } = build[s.id];
      const found = cart.find((i) => i.id === p.id);
      cart = found ? cart.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i)) : [...cart, { id: p.id, name: p.name, href: p.href, image: p.image, model: p.model, price: p.price, qty }];
    }
    cartStore.set(cart);
    router.push("/cart");
  };

  const row = (s: Slot) => {
    const b = build[s.id];
    if (hide && !b) return null;
    return (
      <div key={s.id} className="flex items-center gap-[14px] border-b border-[#0000001a] px-[10px] py-[14px] max-[640px]:grid max-[640px]:grid-cols-[60px_1fr_auto] max-[640px]:items-start max-[640px]:gap-x-[12px] max-[640px]:gap-y-[4px] max-[640px]:px-[4px]">
        <div className="flex size-[60px] flex-none items-center justify-center rounded-[4px] bg-[#f0fafe] text-[#01aef1] max-[640px]:row-span-2">
          {b && b.p.image ? <img src={b.p.image} alt={b.p.name} width={60} height={60} className="size-full rounded-[4px] object-contain" /> : <Icon name={s.icon} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-[6px] text-[13px] leading-[18px] font-normal text-[#000000b3] max-[640px]:font-bold max-[640px]:text-[#01aef1]">
            <span>{s.name}</span>
            {s.required && <span className="rounded-[2px] bg-[#000000] px-[5px] text-[11px] leading-[16px] text-white">Required</span>}
          </div>
          {b ? (
            <>
              <Link href={b.p.href} className="mt-[2px] block text-[15px] leading-[21px] font-medium text-black hover:text-[#01aef1]">
                {b.p.name}
              </Link>
              {b.p.brand && <div className="text-[12px] leading-[18px] font-normal text-[#00000099]">Brand: {b.p.brand}</div>}
            </>
          ) : (
            <div className="mt-[8px] h-[10px] w-[min(100%,350px)] rounded-full bg-[#e3f5fd]" />
          )}
        </div>
        <div className={`flex w-[170px] flex-none items-center justify-end gap-[10px] max-[640px]:col-span-2 max-[640px]:col-start-2 max-[640px]:row-start-2 max-[640px]:w-auto max-[640px]:justify-between ${b ? "" : "max-[640px]:hidden"}`}>
          {b ? (
            <>
              <div className="flex h-[30px] overflow-hidden rounded-[3px] border border-[#0000001f]">
                <button type="button" aria-label="Less" onClick={() => setQty(s.id, b.qty - 1)} className="w-[24px] cursor-pointer bg-[#f0fafe] text-[16px] leading-none hover:bg-[#e3f5fd]">
                  −
                </button>
                <input
                  value={b.qty}
                  onChange={(e) => setQty(s.id, parseInt(e.target.value, 10))}
                  inputMode="numeric"
                  aria-label="Quantity"
                  className="w-[34px] border-x border-[#0000001f] bg-white text-center text-[14px] font-normal outline-none"
                />
                <button type="button" aria-label="More" onClick={() => setQty(s.id, b.qty + 1)} className="w-[24px] cursor-pointer bg-[#f0fafe] text-[16px] leading-none hover:bg-[#e3f5fd]">
                  +
                </button>
              </div>
              <div className="min-w-[78px] text-right text-[16px] leading-[22px] font-bold text-[#01aef1]">{money(b.p.price * b.qty)}</div>
            </>
          ) : (
            <div className="h-[10px] w-[78px] rounded-full bg-[#e3f5fd]" />
          )}
        </div>
        <div className="flex flex-none items-center gap-[8px] border-l border-[#0000001a] pl-[14px] max-[640px]:col-start-3 max-[640px]:row-start-1 max-[640px]:gap-[2px] max-[640px]:border-l-0 max-[640px]:pl-0">
          <button
            type="button"
            onClick={() => setChoosing(s)}
            className={`h-[40px] min-w-[90px] cursor-pointer rounded-[4px] border-2 border-[#01aef1] px-[14px] text-[14px] leading-[14px] font-bold text-[#01aef1] transition-colors hover:bg-[#01aef1] hover:text-white ${b ? "max-[640px]:flex max-[640px]:size-[34px] max-[640px]:min-w-0 max-[640px]:items-center max-[640px]:justify-center max-[640px]:border-0 max-[640px]:p-0 max-[640px]:hover:bg-[#f0fafe] max-[640px]:hover:text-[#01aef1]" : ""}`}
            aria-label={b ? `Change ${s.name}` : `Choose ${s.name}`}
          >
            <span className={b ? "max-[640px]:hidden" : ""}>{b ? "Change" : "Choose"}</span>
            {b && (
              <svg className="hidden max-[640px]:block" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4v6h6M20 20v-6h-6M20 10A8 8 0 006 6.3L4 10M4 14a8 8 0 0014 3.7L20 14" />
              </svg>
            )}
          </button>
          {b && (
            <button type="button" aria-label={`Remove ${s.name}`} onClick={() => set(s.id, null)} className="flex size-[34px] cursor-pointer items-center justify-center rounded-full text-[20px] leading-none text-[#000000b3] hover:bg-[#f0fafe] hover:text-[#01aef1]">
              ×
            </button>
          )}
        </div>
      </div>
    );
  };

  const group = (id: "core" | "other", label: string) => {
    const l = slots.filter((s) => s.group === id);
    const shown = l.filter((s) => !hide || build[s.id]);
    if (shown.length === 0) return null;
    return (
      <>
        <div className="mt-[6px] bg-[#000000] px-[10px] py-[2px] text-[13px] leading-[20px] font-bold text-white">{label}</div>
        {l.map(row)}
      </>
    );
  };

  return (
    <div className="w-full bg-[#f0fafe] py-[20px] text-[15px] leading-[28.5px] font-medium text-[#000000]">
      <div className="mx-auto max-w-[950px] px-[15px] max-[471px]:px-[8px]">
        <div className="overflow-hidden rounded-[6px] border border-[#d1effc] bg-white">
          <div className="flex items-center justify-between border-b border-[#d1effc] bg-[#f0fafe] px-[20px] py-[12px] max-[471px]:px-[10px]">
            <Link href="/">
              <img src="/image/logo/dcore-dark.png" alt="dcore" width={612} height={236} className="block h-auto max-h-[44px] w-auto" />
            </Link>
            <div className="flex">
              <button type="button" onClick={addToCart} className={act}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 4h2l2.4 11h10.2L20 7H6M9 20h.01M17 20h.01" />
                </svg>
                <span className="max-[471px]:hidden">Add to Cart</span>
              </button>
              <button type="button" onClick={() => window.open("/pc-builder/print?print=1", "_blank")} className={`${act} max-[471px]:hidden`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z" />
                </svg>
                <span className="max-[471px]:hidden">Print</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  buildStore.set(EMPTY);
                  setError("");
                }}
                className={act}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4v6h6M20 20v-6h-6M20 10A8 8 0 006 6.3L4 10M4 14a8 8 0 0014 3.7L20 14" />
                </svg>
                <span className="max-[471px]:hidden">Reset</span>
              </button>
            </div>
          </div>

          <div className="px-[20px] pt-[18px] pb-[24px] max-[471px]:px-[10px]">
            <div className="flex items-start justify-between gap-[16px] max-[640px]:flex-col max-[640px]:items-center max-[640px]:text-center">
              <div>
                <h1 className="text-[20px] leading-[26px] font-bold text-[#000000] max-[640px]:hidden">PC Builder - Build Your Own Computer</h1>
                <label className="mt-[6px] flex cursor-pointer items-center gap-[8px] text-[14px] leading-[20px] font-normal text-[#000000b3]">
                  <input type="checkbox" checked={hide} onChange={(e) => setHide(e.target.checked)} className="size-[16px] accent-[#01aef1]" />
                  Hide Unconfigured Components
                </label>
              </div>
              <div className="min-w-[150px] rounded-[4px] bg-[#01aef1] px-[22px] py-[8px] text-center text-white max-[640px]:w-full">
                <div className="text-[22px] leading-[28px] font-bold">{money(total)}</div>
                <div className="text-[12px] leading-[16px] font-normal">{items} Items</div>
              </div>
            </div>

            {error && <div className="mt-[14px] rounded-[4px] border border-[#01aef1] bg-[#e3f5fd] px-[14px] py-[8px] text-[14px] leading-[22px] font-normal text-[#0189bc]">{error}</div>}

            <div className="mt-[14px]">
              {group("core", "Core Components")}
              {group("other", "Peripherals & Others")}
              {hide && picks.length === 0 && <p className="py-[20px] text-center font-normal text-[#00000099]">No component is configured yet.</p>}
            </div>

            <div className="mt-[18px] flex justify-end">
              <button type="button" onClick={addToCart} className="h-[42px] cursor-pointer rounded-[4px] bg-[#01aef1] px-[28px] text-[14px] leading-[14px] font-bold text-white transition-colors hover:bg-[#0189bc]">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      {choosing && (
        <Chooser
          slot={choosing}
          products={products[choosing.id] ?? []}
          onClose={() => setChoosing(null)}
          onPick={(p) => {
            set(choosing.id, { p, qty: build[choosing.id]?.qty ?? 1 });
            setChoosing(null);
            setError("");
          }}
        />
      )}
    </div>
  );
}
