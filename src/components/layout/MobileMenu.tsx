"use client";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import type { MenuNode } from "@/types/home";

// Accordion menu of the mobile drawer. Level 0 is bold-ish 13px text, deeper levels sit on a lighter background and are indented more.
function Item({ node, level, first, onNavigate }: { node: MenuNode; level: number; first: boolean; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const kids = node.children;
  const top = level === 0;
  const pad = top ? "py-[10px] pr-[10px] pl-0 text-[13px] leading-[24.7px]" : level === 1 ? "bg-[#f8f8f8] py-[8px] pr-[8px] pl-[33px] text-[15px] leading-[28.5px]" : "bg-[#f8f8f8] py-[8px] pr-[8px] pl-[40px] text-[15px] leading-[28.5px]";
  return (
    <li className="relative">
      <Link
        href={node.href}
        onClick={onNavigate}
        className={`relative flex items-center outline-none ${pad} ${top ? "font-medium" : "font-normal"} ${open ? "text-[#db2427]" : top ? "text-[#333]" : "text-[#696973]"} ${first ? "" : "border-t border-[#e2e2e2]"}`}
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
              className="block h-[21px] w-[20px] before:inline before:font-[icomoon] before:text-[20px] before:leading-[21px] before:text-[#8b9198] before:content-(--i)"
            />
          </span>
        )}
      </Link>
      {kids && open && (
        <div className="border-t border-[#e2e2e2]">
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
  return (
    <div className="h-[calc(100%-0px)] overflow-x-hidden overflow-y-auto p-[10px]">
      <ul className="flex flex-col overflow-hidden bg-[#f2f3f7]">
        {menu.map((n, i) => (
          <Item key={n.href} node={n} level={0} first={i === 0} onNavigate={onNavigate} />
        ))}
      </ul>
    </div>
  );
}
