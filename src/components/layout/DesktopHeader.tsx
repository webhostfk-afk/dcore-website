"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { home } from "@/data/home";
import { useShop } from "@/components/shop/ShopProvider";
import { cartCount } from "@/lib/shop-store";
import { signOut, useCustomer } from "@/lib/customer";
import { CartDropdown, Search, glyph } from "./HeaderParts";
import DesktopMenu from "./DesktopMenu";

// Desktop header (viewport wider than 1025px), written with Tailwind. Values come from the original theme.
function Logo() {
  const l = home.logo;
  return (
    <div className="h-[70px] w-full">
      <Link href={l.href} className="flex h-[70px] w-full items-center justify-start py-[7px] pr-[7px] pl-0">
        <img src={l.src} width={l.width} height={l.height} alt={l.alt} title={l.alt} className="h-auto max-h-[56px] w-auto max-w-full self-center" />
      </Link>
    </div>
  );
}

function Cart() {
  const { cart } = useShop();
  const [open, setOpen] = useState(false);
  const count = cartCount(cart);
  return (
    <div className="relative ml-[25px] h-[45px] w-[45px] flex-1 rounded-[5px] bg-[#f0fafe] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.2)]" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link href="/cart" aria-label="Shopping cart" className="relative flex h-[45px] w-[45px] items-center justify-end text-black hover:text-[#000000]">
        <span style={glyph("")} className="flex h-[45px] w-[45px] flex-col items-center justify-center rounded-[3px] text-[22.5px] leading-[22.5px] before:ml-[5px] before:block before:font-[icomoon] before:text-[25px] before:text-[#01aef1] before:content-(--i)" />
        <span className="absolute top-0 left-[26.86px] z-[1] mt-[-7px] flex h-[18.14px] min-w-[18.14px] translate-x-[5px] max-[1301px]:translate-x-0 items-center justify-center rounded-[50px] bg-[#01aef1] px-[3px] text-[11px] leading-[0] font-normal text-white shadow-[0_5px_7px_-9px_#000000]">{count}</span>
      </Link>
      {open && (
        <div className="absolute top-[45px] right-0 z-[1000] w-[400px] pt-[14px] text-[13px] leading-[24.7px] font-medium text-[#000000]">
          <span className="absolute top-[4px] right-[12px] h-0 w-0 border-x-[10px] border-b-[10px] border-x-transparent border-b-[#f0fafe]" />
          <CartDropdown />
        </div>
      )}
    </div>
  );
}

function Account() {
  const [open, setOpen] = useState(false);
  const me = useCustomer();
  // signed out: Log in / Register; signed in: My Account / Wishlist / Logout
  const items: { label: string; href: string; out?: boolean }[] = me
    ? [{ label: "My Account", href: "/account" }, { label: "Wishlist", href: "/account#wishlist" }, { label: "Logout", href: "/login", out: true }]
    : home.topRight.slice(1);
  const icons = ["", ""];
  return (
    <li className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        href="/login"
        style={{ ...glyph(""), "--j": "\"\"" } as CSSProperties}
        className="group relative flex items-center p-[5px] text-left text-[13px] leading-[24.7px] text-white before:mr-[5px] before:block before:h-[18px] before:w-[18px] before:font-[icomoon] before:text-[18px] before:leading-[18px] before:content-(--i) after:mt-[2px] after:block after:rotate-90 after:px-[3px] after:font-[icomoon] after:text-[11px] after:leading-[20.9px] after:content-(--j) hover:text-[#01aef1]"
      >
        <span className="block max-w-[110px] overflow-hidden text-ellipsis whitespace-nowrap">{me ? me.firstname : "Account"}</span>
      </Link>
      {open && (
        <div className="absolute top-[34.69px] left-1/2 z-[1000] -translate-x-1/2 pt-[10px] text-left">
          <span className="absolute top-0 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[10px] border-b-[10px] border-x-transparent border-b-[#000000]" />
          <ul className="flex flex-col rounded-[3px] shadow-[0_15px_90px_-10px_rgba(0,0,0,0.2)]">
            {items.map((l, i) => (
              <li key={l.label} className={`relative ${i === 0 ? "rounded-t-[3px]" : ""} ${i === items.length - 1 ? "rounded-b-[3px]" : ""}`}>
                <Link
                  href={l.href}
                  style={glyph(icons[i] ?? "")}
                  className={`flex items-center bg-[#000000] px-[15px] py-[10px] text-[13px] leading-[24.7px] font-normal whitespace-nowrap text-white capitalize before:mr-[5px] before:flex before:h-[15px] before:w-[20px] before:font-[icomoon] before:text-[15px] before:leading-[15px] before:content-(--i) hover:text-[#01aef1] ${i === 0 ? "rounded-t-[3px]" : ""} ${i === items.length - 1 ? "rounded-b-[3px]" : ""}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

const linkIcons = ["", "", ""];

export default function DesktopHeader() {
  const { compare } = useShop();
  return (
    <div className="flex w-full flex-col items-center text-[15px] leading-[28.5px] font-medium text-[#000000] max-[1025px]:hidden">
      {/* top bar */}
      <div className="relative z-[1001] w-full bg-[#000000] shadow-[0_0_20px_rgba(0,0,0,0.28)]">
        <div className="relative mx-auto flex h-[35px] w-full max-w-[1280px] items-center justify-between max-[1301px]:px-[10px]">
          <ul className="flex h-[35px] w-1/2 items-center">
            <li className="relative">
              <Link
                href={home.topLeft[0].href}
                style={glyph("")}
                className="flex items-center p-[5px] text-left text-[13px] leading-[24.7px] text-white before:mr-[5px] before:block before:h-[14px] before:w-[14px] before:font-[icomoon] before:text-[14px] before:leading-[14px] before:content-(--i) hover:text-[#01aef1]"
              >
                <span className="block overflow-hidden whitespace-nowrap">{home.topLeft[0].label}</span>
              </Link>
            </li>
            <li className="relative ml-[20px]">
              <a
                href={home.topLeft[1].href}
                style={glyph("")}
                className="flex items-center p-[5px] text-left text-[13px] leading-[24.7px] tracking-[1px] text-white before:mr-[5px] before:block before:h-[14px] before:w-[15px] before:font-[icomoon] before:text-[14px] before:leading-[14px] before:content-(--i) hover:text-[#01aef1]"
              >
                <span className="block overflow-hidden whitespace-nowrap">{home.topLeft[1].label}</span>
              </a>
            </li>
          </ul>
          <ul className="flex items-center">
            {[
              { label: "Blog", href: "/blog" },
              { label: "Brands", href: "/brands" },
            ].map((l) => (
              <li key={l.href} className="relative">
                <Link
                  href={l.href}
                  className="block px-[10px] py-[5px] text-[13px] leading-[24.7px] whitespace-nowrap text-white transition-colors duration-200 hover:text-[#01aef1]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {[
              { label: "Corporate Deal", popup: 379 },
              { label: "Become A dealer", popup: 378 },
            ].map((l) => (
              <li key={l.popup} className="relative">
                <a
                  href="#"
                  data-popup={l.popup}
                  className="block px-[10px] py-[5px] text-[13px] leading-[24.7px] whitespace-nowrap text-white transition-colors duration-200 hover:text-[#01aef1]"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <Account />
          </ul>
        </div>
      </div>

      {/* logo, search, links, cart */}
      <div className="relative mx-auto flex h-[70px] w-full max-w-[1280px] items-center justify-between">
        <div className="flex h-[70px] w-[200px] items-center max-[1301px]:pl-[20px]">
          <Logo />
        </div>
        <div className="mr-[40px] ml-[25px] flex h-[70px] flex-1 items-center">
          <Search />
        </div>
        <div className="flex h-[70px] items-center justify-end max-[1301px]:pr-[20px]">
          <ul className="flex items-center justify-end">
            {/* Offer, PC Builder, then Compare next to the cart; only Compare keeps its white card */}
            {[1, 2, 0].map((i, pos) => {
              const l = home.headerLinks[i];
              return (
              <li key={l.href} className={`relative ${pos > 0 ? "ml-[15px]" : ""}`}>
                <Link
                  href={l.href}
                  style={glyph(linkIcons[i] ?? "")}
                  className={`group flex items-center rounded-[3px] px-[10px] pt-[5px] pb-[7px] text-left text-[13px] leading-[24.7px] before:mr-[10px] before:block before:h-[22px] before:w-[22px] before:font-[icomoon] before:text-[22px] before:leading-[22px] before:text-black before:content-(--i) hover:text-[#01aef1] hover:before:text-[#000000] text-[#000000]`}
                >
                  <span className="block overflow-hidden whitespace-nowrap">
                    {l.label}
                    <s className="block text-[9.1px] leading-[9.1px] font-normal text-[#000000] no-underline">{l.sub}</s>
                  </span>
                  {l.badge !== null && (
                    <span className="absolute -top-[7px] -right-[6px] z-[1] flex h-[18.14px] min-w-[18.14px] items-center justify-center rounded-[50px] bg-[#01aef1] px-[3px] text-[11px] leading-[0] font-normal text-white shadow-[0_5px_7px_-9px_#000000]">
                      {compare.length}
                    </span>
                  )}
                </Link>
              </li>
              );
            })}
          </ul>
          <div className="flex h-[45px] w-[70px] justify-end">
            <Cart />
          </div>
        </div>
      </div>

      {/* main menu */}
      <div className="w-full bg-[#000000]">
        <div className="mx-auto flex h-[40px] w-full max-w-[1280px]">
          <DesktopMenu menu={home.menu} />
        </div>
      </div>
    </div>
  );
}
