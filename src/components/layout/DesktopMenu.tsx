"use client";
import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState, type CSSProperties } from "react";
import type { MenuNode } from "@/types/home";

const arrow = { "--i": "\"\"" } as CSSProperties;

// Desktop mega menu. One shared state keeps the chain of open drop-downs ("Networking" > "WiFi Router" ...): hovering another item
// replaces the chain at once, so two drop-downs are never open together; the chain closes 300ms after the mouse leaves the menu and
// immediately when a link is clicked.
type Ctl = { path: string[]; open: (p: string[]) => void; keep: () => void; leave: () => void; close: () => void };
const Menu = createContext<Ctl | null>(null);
const useMenu = () => useContext(Menu) as Ctl;

// a drop-down opens to the left when it would run out of the window on the right
const runsOut = (el: HTMLElement | null, extra: number) => !!el && el.getBoundingClientRect().left + extra > document.documentElement.clientWidth - 8;

function Sub({ node, trail, flipped }: { node: MenuNode; trail: string[]; flipped: boolean }) {
  const m = useMenu();
  const li = useRef<HTMLLIElement>(null);
  const [flip, setFlip] = useState(flipped);
  const kids = node.children;
  const mine = [...trail, node.href];
  const open = mine.every((h, i) => m.path[i] === h);
  return (
    <li
      ref={li}
      className="relative"
      onMouseEnter={() => {
        setFlip(flipped || runsOut(li.current, 400));
        m.open(mine);
      }}
    >
      <Link
        href={node.href}
        onClick={m.close}
        style={kids ? arrow : undefined}
        className={`group/s relative flex items-center py-[2px] pr-[10px] pl-[15px] text-[14px] leading-[26.6px] font-normal capitalize ${
          open ? "bg-[#e4212a] text-[#f2f3f7]" : "bg-[#f2f3f7] text-[#3a4754] hover:bg-[#e4212a] hover:text-[#f2f3f7]"
        } ${kids ? "after:ml-auto after:block after:font-[icomoon] after:text-[11px] after:content-(--i)" : ""}`}
      >
        <span className="block">{node.label}</span>
      </Link>
      {kids && open && (
        <div className={`absolute top-0 z-[1000] w-[200px] text-left ${flip ? "right-[200px]" : "left-[200px]"}`}>
          <ul className="flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.28)]">
            {kids.map((k) => (
              <Sub key={k.href} node={k} trail={mine} flipped={flip} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

function Top({ node }: { node: MenuNode }) {
  const m = useMenu();
  const li = useRef<HTMLLIElement>(null);
  const [flip, setFlip] = useState(false);
  const kids = node.children;
  const open = m.path[0] === node.href;
  return (
    <li
      ref={li}
      className="relative flex h-[40px] flex-auto flex-col justify-center"
      onMouseEnter={() => {
        setFlip(runsOut(li.current, 200));
        m.open([node.href]);
      }}
    >
      <Link
        href={node.href}
        onClick={m.close}
        className={`relative flex h-[40px] items-center justify-center px-[6px] capitalize ${open ? "text-[#eee]" : "text-white"} hover:text-[#eee]`}
        aria-expanded={kids ? open : undefined}
      >
        <span className="block overflow-hidden text-center whitespace-nowrap">{node.label}</span>
      </Link>
      {kids && open && (
        <div className={`absolute top-[40px] z-[1000] w-[200px] pt-[10px] text-left ${flip ? "right-0" : "left-0"}`}>
          <span className={`absolute top-0 h-0 w-0 border-x-[10px] border-b-[10px] border-x-transparent border-b-[#f2f3f7] ${flip ? "right-[7px]" : "left-[7px]"}`} />
          <ul className="flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.28)]">
            {kids.map((k) => (
              <Sub key={k.href} node={k} trail={[node.href]} flipped={flip} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default function DesktopMenu({ menu }: { menu: MenuNode[] }) {
  const [path, setPath] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(() => stop, []);
  const ctl: Ctl = {
    path,
    open: (p) => {
      stop();
      setPath(p);
    },
    keep: stop,
    leave: () => {
      stop();
      timer.current = setTimeout(() => setPath([]), 300);
    },
    close: () => {
      stop();
      setPath([]);
    },
  };
  return (
    <Menu.Provider value={ctl}>
      <ul className="flex h-[40px] w-full items-center" onMouseEnter={ctl.keep} onMouseLeave={ctl.leave}>
        {menu.map((n) => (
          <Top key={n.href} node={n} />
        ))}
      </ul>
    </Menu.Provider>
  );
}
