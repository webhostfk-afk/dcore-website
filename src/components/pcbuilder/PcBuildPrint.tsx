"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { buildStore } from "@/lib/pcbuild-store";
import { money } from "@/lib/shop-store";
import type { Slot } from "@/lib/pcbuilder";

const subscribeNone = () => () => {};

// The print page of the PC Builder: only the chosen parts in a table with the total (no header / footer). The two buttons on top are
// the same pills as the tabs of the product page and are not printed.
export default function PcBuildPrint({ slots }: { slots: Slot[] }) {
  const build = useSyncExternalStore(buildStore.subscribe, buildStore.getSnapshot, buildStore.getServerSnapshot);
  const ready = useSyncExternalStore(subscribeNone, () => true, () => false); // false while the server renders
  const date = ready ? new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : ""; // today (only in the browser)
  const rows = slots.filter((s) => build[s.id]);
  const total = rows.reduce((n, s) => n + build[s.id].p.price * build[s.id].qty, 0);
  const items = rows.reduce((n, s) => n + build[s.id].qty, 0);

  // the builder opens this page with ?print=1: the print dialog comes up by itself once the table is drawn
  useEffect(() => {
    if (!ready || rows.length === 0 || !/[?&]print=1/.test(window.location.search)) return;
    const t = setTimeout(() => window.print(), 500);
    return () => clearTimeout(t);
  }, [ready, rows.length]);

  const pill = "rounded-[3px] px-[14px] py-[8px] text-[13px] leading-[15px] font-bold whitespace-nowrap capitalize cursor-pointer";
  const th = "border border-[#0000001f] bg-[#f0fafe] px-[10px] py-[8px] text-left text-[13px] leading-[18px] font-bold text-black";
  const td = "border border-[#0000001f] px-[10px] py-[8px] align-middle text-[14px] leading-[20px] font-normal text-black";

  return (
    <div className="min-h-screen bg-[#f0fafe] text-[15px] leading-[28.5px] font-medium text-[#000000] print:bg-white">
      <div className="flex justify-center gap-[10px] px-[10px] py-[16px] print:hidden">
        <button type="button" onClick={() => window.print()} className={`${pill} bg-[#01aef1] text-white`}>
          Print
        </button>
        <Link href="/pc-builder" className={`${pill} bg-white text-[#000000]`}>
          Back to PC Builder
        </Link>
      </div>

      <div className="mx-auto max-w-[900px] bg-white px-[30px] py-[26px] shadow-[0_2px_10px_rgba(0,0,0,0.08)] max-[640px]:px-[12px] print:max-w-none print:px-0 print:py-0 print:shadow-none">
        <div className="flex items-center justify-between border-b-2 border-[#01aef1] pb-[12px]">
          <img src="/image/logo/dcore-dark.png" alt="dcore" width={612} height={236} className="block h-auto max-h-[52px] w-auto" />
          <div className="text-right text-[13px] leading-[20px] font-normal text-[#000000b3]">
            <div>{date}</div>
            <div>+8801844600030</div>
            <div>info@dcores.net</div>
          </div>
        </div>
        <h1 className="mt-[16px] text-[22px] leading-[28px] font-bold text-black">PC Builder - My Computer</h1>

        {!ready ? null : rows.length === 0 ? (
          <p className="py-[30px] font-normal text-[#00000099]">
            No parts are chosen yet. <Link href="/pc-builder" className="text-[#01aef1] underline">Go to the PC Builder</Link> and choose some parts first.
          </p>
        ) : (
          <div className="mt-[12px] overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={`${th} w-[40px]`}>#</th>
                  <th className={th}>Component</th>
                  <th className={th}>Product</th>
                  <th className={`${th} text-center`}>Qty</th>
                  <th className={`${th} text-right`}>Unit Price</th>
                  <th className={`${th} text-right`}>Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s, i) => {
                  const { p, qty } = build[s.id];
                  return (
                    <tr key={s.id} className="break-inside-avoid">
                      <td className={td}>{i + 1}</td>
                      <td className={`${td} font-bold whitespace-nowrap`}>{s.name}</td>
                      <td className={td}>
                        <div className="flex items-center gap-[10px]">
                          {p.image && <img src={p.image} alt="" width={44} height={44} className="size-[44px] flex-none object-contain" />}
                          <div>
                            <div>{p.name}</div>
                            {(p.brand || p.model) && <div className="text-[12px] leading-[16px] text-[#00000099]">{[p.brand && `Brand: ${p.brand}`, p.model && `Model: ${p.model}`].filter(Boolean).join("  ·  ")}</div>}
                          </div>
                        </div>
                      </td>
                      <td className={`${td} text-center`}>{qty}</td>
                      <td className={`${td} text-right whitespace-nowrap`}>{money(p.price)}</td>
                      <td className={`${td} text-right font-bold whitespace-nowrap`}>{money(p.price * qty)}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan={3} className={`${td} bg-[#f0fafe] text-right font-bold`}>
                    Total ({items} {items === 1 ? "item" : "items"})
                  </td>
                  <td colSpan={3} className={`${td} bg-[#01aef1] text-right text-[18px] font-bold text-white print:[print-color-adjust:exact]`}>
                    {money(total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-[16px] text-[12px] leading-[18px] font-normal text-[#00000099]">Prices and stock may change without notice. Please call before you order.</p>
      </div>
    </div>
  );
}
