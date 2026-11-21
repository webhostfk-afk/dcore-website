"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { home } from "@/data/home";
import { useShop } from "@/components/shop/ShopProvider";
import { cartCount } from "@/lib/shop-store";
import { Search, glyph } from "./HeaderParts";

// The bar shown on tablets and phones (viewport up to 1025px wide): menu button, logo, search, cart.
export default function MobileHeader({ onMenu, onCart }: { onMenu: () => void; onCart: () => void }) {
  const { cart } = useShop();
  const [search, setSearch] = useState(false);
  const count = cartCount(cart);
  const l = home.logo;
  return (
    <div className="flex flex-col text-[15px] leading-[28.5px] font-medium text-[#333] min-[1025px]:hidden">
      <div className="relative z-[1] flex h-[50px] items-center justify-between border-b border-black/20 bg-white">
        <div className="ml-[150px] h-[49px] w-[190px] shrink">
          <Link href={l.href} className="flex h-[49px] items-center justify-center p-[5px]">
            <img src={l.src} width={l.width} height={l.height} alt={l.alt} title={l.alt} className="relative -left-[25px] h-auto max-w-full" />
          </Link>
        </div>
        <div className="flex h-[49px] w-[115px] flex-none items-center px-[10px]">
          <button
            type="button"
            aria-label="Menu"
            onClick={onMenu}
            style={glyph("")}
            className="absolute top-0 left-0 flex h-[49px] w-[50px] cursor-pointer items-center justify-center text-[20px] leading-[38px] before:block before:font-[icomoon] before:leading-[38px] before:content-(--i)"
          />
          <div className="flex h-[49px] w-[50px] items-center justify-center">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearch((v) => !v)}
              style={glyph("")}
              className="relative h-[49px] w-[50px] cursor-pointer text-center text-[20px] leading-[38px] before:inline before:font-[icomoon] before:content-(--i)"
            />
          </div>
          <div className="flex h-[49px] w-[45px] items-center justify-center">
            <div className="relative h-[49px] w-[45px] rounded-[5px] bg-[#f2f3f7]">
              <button type="button" aria-label="Shopping cart" onClick={onCart} className="relative flex h-[49px] w-[45px] cursor-pointer items-center justify-center text-black">
                <span
                  style={glyph("") as CSSProperties}
                  className="flex h-[49px] w-[45px] flex-col items-center justify-center bg-white text-[22.5px] min-[762px]:rounded-[3px] leading-[22.5px] before:ml-[5px] before:block before:font-[icomoon] before:text-[25px] before:text-[#e4212a] before:content-(--i)"
                />
                <span className="absolute top-0 left-[30.16px] z-[1] mt-[7px] flex h-[14.84px] min-w-[14.84px] items-center justify-center rounded-[100px] bg-[#e4212a] px-[3px] text-[9px] leading-[0] font-normal text-white shadow-[0_10px_30px_-5px_rgba(198,194,194,0.2)]">
                  {count}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {search && (
        <div className="absolute top-[49px] left-0 z-[1000] w-full pt-[10px] text-left">
          <Search variant="mobile" onDone={() => setSearch(false)} />
        </div>
      )}
    </div>
  );
}
