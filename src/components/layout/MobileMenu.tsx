"use client";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import type { MenuNode } from "@/types/home";
import { signOut, useCustomer } from "@/lib/customer";

// Accordion menu of the mobile drawer. Level 0 is bold-ish 13px text, deeper levels sit on a lighter background and are indented more.
function Item({ node, level, first, onNavigate }: { node: MenuNode; level: number; first: boolean; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const kids = node.children;
  const top = level === 0;
  const pad = top ? "py-[10px] pr-[10px] pl-0 text-[13px] leading-[24.7px]" : level === 1 ? "bg-[#f0fafe] py-[8px] pr-[8px] pl-[33px] text-[15px] leading-[28.5px]" : "bg-[#f0fafe] py-[8px] pr-[8px] pl-[40px] text-[15px] leading-[28.5px]";
  return (
    <li className="relative">
      <Link
        href={node.href}
        onClick={onNavigate}
        className={`relative flex items-center outline-none ${pad} ${top ? "font-medium" : "font-normal"} ${open ? "text-[#01aef1]" : top ? "text-[#000000]" : "text-[#00000099]"} ${first ? "" : "border-t border-[#0000001f]"}`}
      >
        <span className="block overflow-hidden">{node.label}</span>
        {kids && (
          <span
            role="button"
            aria-label={open ? "Collapse" : "Expand"}
            aria-expanded={open}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            className={`absolute top-1/2 right-[8px] z-[2] flex h-[25px] w-[25px] -translate-y-1/2 cursor-pointer items-center justify-center `}
          >
            <i
              style={{ "--i": `"${open ? "" : ""}"` } as CSSProperties}
              className="block h-[21px] w-[20px] before:inline before:font-[icomoon] before:text-[20px] before:leading-[21px] before:text-[#00000099] before:content-(--i)"
            />
          </span>
        )}
      </Link>
      {kids && open && (
        <div className="border-t border-[#0000001f]">
          <ul className="flex flex-col overflow-hidden">
            {kids.map((k, i) => (
              <Item key={k.href + i} node={k} level={level + 1} first={i === 0} onNavigate={onNavigate} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default function MobileMenu({ menu, onNavigate }: { menu: MenuNode[]; onNavigate: () => void }) {
  const me = useCustomer();
  const acc = me
    ? [{ label: "My Account", href: "/account" }, { label: "Wishlist", href: "/account#wishlist" }]
    : [{ label: "Log in", href: "/login" }, { label: "Register", href: "/register" }];
  return (
    <div className="h-[calc(100%-0px)] overflow-x-hidden overflow-y-auto p-[10px]">
      <ul className="flex flex-col overflow-hidden bg-[#f0fafe]">
        {menu.map((n, i) => (
          <Item key={n.href} node={n} level={0} first={i === 0} onNavigate={onNavigate} />
        ))}
        {acc.map((l) => (
          <li key={l.href} className="relative">
            <Link href={l.href} onClick={onNavigate} className="block border-t border-[#0000001f] py-[10px] pr-[10px] pl-0 text-[13px] leading-[24.7px] font-medium text-[#01aef1]">
              {l.label}
            </Link>
          </li>
        ))}
        {me && (
          <li className="relative">
            <button type="button" onClick={() => { onNavigate(); void signOut().then(() => { location.href = "/login"; }); }} className="block w-full cursor-pointer border-t border-[#0000001f] py-[10px] pr-[10px] pl-0 text-left text-[13px] leading-[24.7px] font-medium text-[#d92d20]">
              Logout
            </button>
          </li>
        )}
        {[
          { label: "Blog", href: "/blog" },
          { label: "Brands", href: "/brands" },
        ].map((l) => (
          <li key={l.href} className="relative">
            <Link
              href={l.href}
              onClick={onNavigate}
              className="block border-t border-[#0000001f] py-[10px] pr-[10px] pl-0 text-[13px] leading-[24.7px] font-medium text-[#01aef1]"
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
              onClick={onNavigate}
              className="block border-t border-[#0000001f] py-[10px] pr-[10px] pl-0 text-[13px] leading-[24.7px] font-medium text-[#01aef1]"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
