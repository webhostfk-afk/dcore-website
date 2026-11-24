"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { useShop } from "@/components/shop/ShopProvider";
import { cartTotal, money } from "@/lib/shop-store";

// Pieces shared by the desktop and the mobile header, written with Tailwind (values from the original theme).
// Icons are glyphs of the "icomoon" font: a CSS variable holds the character, painted by `before:content-(--i)`.
export const glyph = (code: string) => ({ "--i": `"${code}"` }) as CSSProperties;

type Suggestion = { id: string; name: string; href: string; image: string; price: string | null; oldPrice: string | null; requestPrice: boolean; label: string | null };

// The stock badge of a suggestion: green "In Stock", red "Out Of Stock", blue for the rest (Pre Order, Up Coming, Call for Price).
function stockBadge(s: Suggestion): { text: string; cls: string } {
  const label = (s.label ?? "").trim();
  if (/out/i.test(label)) return { text: label, cls: "bg-[#fde8e8] text-[#d92d20]" };
  if (!s.price && s.requestPrice) return { text: "Call for Price", cls: "bg-[#e8f4fe] text-[#0b7bc4]" };
  if (label && !/in stock/i.test(label) && !/^-?\d+(\.\d+)?\s*%$/.test(label)) return { text: label, cls: "bg-[#e8f4fe] text-[#0b7bc4]" };
  return { text: "In Stock", cls: "bg-[#dcf7e4] text-[#0b7a3b]" };
}

// variant "mobile" is the narrower bar that slides under the mobile header.
export function Search({ variant = "desktop", onDone }: { variant?: "desktop" | "mobile"; onDone?: () => void }) {
  const m = variant === "mobile";
  const router = useRouter();
  const [q, setQ] = useState("");
  const [list, setList] = useState<{ q: string; total: number; items: Suggestion[] }>({ q: "", total: 0, items: [] });

  useEffect(() => {
    if (q.trim().length < 2) return;
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
        .then((r) => r.json())
        .then((d: { total: number; items: Suggestion[] }) => setList({ q, total: d.total, items: d.items }))
        .catch(() => {});
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  const go = () => q.trim() && router.push(`/search?search=${encodeURIComponent(q.trim())}`);
  const shown = list.q === q && q.trim().length >= 2 ? list.items : [];
  const close = () => {
    setList({ q: "", total: 0, items: [] });
    onDone?.();
  };
  return (
    <div className={`relative w-full ${m ? "h-[35px]" : "h-[40px]"}`}>
      {shown.length > 0 && (
        <div className={`absolute left-0 z-[100] block w-full pt-[10px] ${m ? "top-[35px]" : "top-[40px]"}`}>
          <div className="overflow-hidden rounded-[12px] border border-[#e1e8f0] bg-white text-left text-[14px] leading-[20px] text-[#000000b3] shadow-[0_28px_56px_-18px_rgba(0,39,65,0.5)]">
            <div className="flex items-center justify-between gap-[12px] border-b border-[#e8edf4] bg-[#f6f9fd] px-[16px] py-[12px] text-[15px] leading-[22px] font-bold text-[#1877f2]">
              <span>
                Showing {shown.length} out of {list.total} products
              </span>
              <Link href={`/search?search=${encodeURIComponent(q.trim())}`} onClick={close} className="whitespace-nowrap hover:text-[#01aef1]">
                View All
              </Link>
            </div>
            <div className="max-h-[min(58vh,520px)] overflow-y-auto overscroll-contain">
              {shown.map((s) => {
                const b = stockBadge(s);
                return (
                  <Link key={s.id} href={s.href} onClick={close} className="flex items-center gap-[12px] border-b border-[#eef2f7] px-[14px] py-[10px] last:border-b-0 hover:bg-[#f2f7ff]">
                    <span className="grid h-[56px] w-[56px] flex-none place-items-center overflow-hidden rounded-[8px] border border-[#e4eaf2] bg-white">
                      {s.image && <img src={s.image} width={56} height={56} alt="" className="h-auto max-h-full w-auto max-w-full object-contain" />}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                      <span className="line-clamp-2 text-[14px] leading-[18px] font-semibold text-[#002741]">{s.name}</span>
                      <span className="flex items-baseline gap-[8px] text-[13px]">
                        {s.price ? <b className="font-extrabold text-[#002741]">{s.price}</b> : <b className="font-extrabold text-[#002741]">Call for Price</b>}
                        {s.price && s.oldPrice && <s className="text-[12px] text-[#8a94a3]">{s.oldPrice}</s>}
                      </span>
                    </span>
                    <em className={`flex-none rounded-[8px] px-[10px] py-[5px] text-[12px] leading-[16px] font-bold whitespace-nowrap not-italic ${b.cls}`}>{b.text}</em>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className={`flex w-full items-center rounded-[3px] border border-[#01aef1] text-left ${m ? "h-[35px]" : "h-[40px]"}`}>
        <span className={`relative flex-1 rounded-l-[3px] ${m ? "h-[33px]" : "h-[38px]"}`}>
          <input
            type="text"
            name="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
            placeholder="Search..."
            autoComplete="off"
            className={`relative inline-block w-full rounded-l-[3px] bg-white px-[12px] text-[#000000b3] outline-none placeholder:text-[#00000080] ${m ? "h-[33px] text-[16px] leading-[30.4px]" : "h-[38px]"}`}
          />
        </span>
        <button
          type="button"
          aria-label="Search"
          onClick={go}
          style={glyph("")}
          className={`w-[50px] cursor-pointer rounded-r-[3px] bg-white text-center text-[#000000] before:inline before:font-[icomoon] before:content-(--i) hover:before:text-[#01aef1] ${m ? "h-[33px] text-[18px] leading-[34.2px] before:leading-[34.2px]" : "h-[38px] text-[20px] leading-[38px] before:leading-[38px]"}`}
        />
      </div>
    </div>
  );
}

export function CartDropdown({ flat = false, onNavigate }: { flat?: boolean; onNavigate?: () => void }) {
  const { cart, removeFromCart } = useShop();
  const total = money(cartTotal(cart));
  return (
    <ul className={`flex flex-col overflow-hidden rounded-[3px] ${flat ? "" : "bg-[#f0fafe] shadow-[0_15px_90px_-10px_rgba(0,0,0,0.2)]"}`}>
      {cart.length === 0 ? (
        <li>
          <p className="p-[20px] text-center">Your shopping cart is empty!</p>
        </li>
      ) : (
        <>
          <li className="-mb-px max-h-[275px] overflow-x-hidden overflow-y-auto rounded-t-[3px]">
            <table className="w-full border-collapse text-[14px] leading-[20px] text-black">
              <tbody>
                {cart.map((i) => (
                  <tr key={i.id}>
                    <td className="border-b border-[#0000001f] p-[8px] text-center align-middle">
                      <Link href={i.href} onClick={onNavigate} className="inline-block text-[#01aef1]">
                        <img src={i.image} width={60} height={60} alt={i.name} title={i.name} className="inline h-auto align-middle" />
                      </Link>
                    </td>
                    <td className="border-b border-[#0000001f] p-[8px] text-left align-middle">
                      <Link href={i.href} onClick={onNavigate} className="inline-block text-[#01aef1] hover:text-[#0189bc]">
                        {i.name}
                      </Link>
                      <br />
                    </td>
                    <td className="border-b border-[#0000001f] p-[8px] text-right align-middle whitespace-nowrap">x {i.qty}</td>
                    <td className="border-b border-[#0000001f] p-[8px] text-right align-middle whitespace-nowrap">{money(i.qty * i.price)}</td>
                    <td className="border-b border-[#0000001f] px-[5px] py-[7px] text-center align-middle">
                      <button
                        type="button"
                        title="Remove"
                        onClick={() => removeFromCart(i.id)}
                        style={glyph("")}
                        className="relative inline-block h-[18px] w-[15px] cursor-pointer pt-[2px] text-[15px] leading-[15px] text-[#01aef1] before:font-[icomoon] before:content-(--i)"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </li>
          <li>
            <div>
              <table className="w-full border-collapse text-[14px] leading-[20px] font-bold text-black">
                <tbody>
                  {["Sub-Total", "Total"].map((t) => (
                    <tr key={t}>
                      <td className="w-3/4 bg-[#e3f5fd] px-[12px] py-[5px] text-right align-middle font-bold">{t}</td>
                      <td className="w-1/4 bg-[#e3f5fd] px-[12px] py-[5px] text-right align-middle font-bold">{total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-center bg-[#e3f5fd] p-[13px]">
                <Link href="/cart" onClick={onNavigate} className="relative mx-[6px] flex items-center justify-center rounded-[3px] bg-[#000000] px-[18px] py-[13px] text-center text-[13px] leading-[13px] font-normal text-white uppercase">
                  View Cart
                </Link>
                <Link href="/checkout" onClick={onNavigate} className="relative mx-[6px] flex items-center justify-center rounded-[3px] bg-[#01aef1] px-[18px] py-[13px] text-center text-[13px] leading-[13px] font-normal text-white uppercase">
                  Checkout
                </Link>
              </div>
            </div>
          </li>
        </>
      )}
    </ul>
  );
}

