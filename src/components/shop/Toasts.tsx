import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";

export type ToastItem = { key: number; className: string; image?: string; title: string; message: ReactNode; buttons?: boolean };

const glyph = (code: string) => ({ "--i": `"${code}"` }) as CSSProperties;
const btn =
  "inline-flex h-[39px] grow items-center justify-center rounded-[3px] px-[18px] text-center text-[13px] leading-[13px] font-normal text-white uppercase";

// The little boxes in the top right corner ("Success: You have added ... to your shopping cart!").
export default function Toasts({ list, onClose }: { list: ToastItem[]; onClose: (key: number) => void }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2147483647] flex h-full w-full flex-col items-end">
      {list.map((t) => (
        <div
          key={t.key}
          className="dcore-fade pointer-events-auto relative m-[20px] mb-0 max-w-[400px] rounded-[5px] bg-[#f0fafe] p-[10px] text-[15px] leading-[28.5px] text-[#00000099] shadow-[0_15px_90px_-10px_rgba(0,0,0,0.2)]"
        >
          <button
            type="button"
            aria-label="Close"
            style={glyph("")}
            onClick={() => onClose(t.key)}
            className="absolute top-0 right-0 mt-[5px] mr-[5px] h-[26px] w-[36px] cursor-pointer rounded-[3px] bg-white text-[12px] text-[#000000] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:font-[icomoon] before:text-[20px] before:content-(--i) hover:text-[#01aef1]"
          />
          <div className="flex">
            {t.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.image} width={60} height={60} alt="" className="h-[60px] w-[60px] flex-[1_0_auto]" />
            )}
            <div className="min-w-0 pl-[10px]">
              <div className="mb-[5px] text-[15px] leading-[28.5px] font-semibold">{t.title}</div>
              <div className="[&_a]:text-[#01aef1] [&_a:hover]:text-[#0189bc]">{t.message}</div>
            </div>
          </div>
          {t.buttons && (
            <div className="-m-[10px] mt-[5px] flex items-center justify-center p-[10px]">
              <Link
                href="/cart"
                style={glyph("")}
                className={`${btn} bg-[#000000] before:mr-[5px] before:font-[icomoon] before:content-(--i) hover:bg-[#01aef1]`}
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                style={glyph("")}
                className={`${btn} ml-[10px] bg-[#01aef1] after:ml-[5px] after:font-[icomoon] after:content-(--i) hover:bg-[#01aef1]`}
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
