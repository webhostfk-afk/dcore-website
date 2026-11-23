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

// A list with many items turns into columns by itself (like munshiganjit-web): the columns are filled top to bottom, `base` items per
// column, and never more than 4 columns; the width follows the longest name in every column.
const rowsOf = (n: number, base: number) => Math.max(1, Math.max(Math.min(n, base), Math.ceil(n / 4)));
const grid = (n: number, base: number): CSSProperties => ({ gridTemplateRows: `repeat(${rowsOf(n, base)}, auto)` });
const PANEL =
  "grid w-max max-w-[calc(100vw-16px)] grid-flow-col auto-cols-[minmax(200px,max-content)] gap-x-[6px] bg-[#f0fafe] p-[6px] shadow-[0_0_20px_rgba(0,0,0,0.28)]";

const EDGE = 8;
// The first drop-down is moved to the left only as far as needed to stay in the window; if it is too high for the window it scrolls.
function placeTop(ul: HTMLUListElement | null) {
  if (!ul) return;
  const li = ul.closest("li");
  if (!li) return;
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  ul.style.transform = "";
  ul.style.maxHeight = "";
  ul.style.overflowY = "";
  const lr = li.getBoundingClientRect();
  const pr = ul.getBoundingClientRect();
  if (lr.left + pr.width > vw - EDGE) ul.style.transform = `translateX(${Math.max(vw - EDGE - (lr.left + pr.width), EDGE - lr.left)}px)`;
  const room = vh - lr.bottom - 10 - EDGE;
  if (pr.height > room) {
    ul.style.maxHeight = room + "px";
    ul.style.overflowY = "auto";
  }
}
// A side panel opens right beside the hovered item when it fits, else on its left side, else it is pushed back into the window; it slides
// up when it would cross the bottom edge.
function placeFly(ul: HTMLUListElement | null) {
  const li = ul?.parentElement;
  if (!ul || !li) return;
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  ul.style.left = "";
  ul.style.top = "";
  ul.style.transform = "";
  ul.style.maxHeight = "";
  ul.style.overflowY = "";
  const lr = li.getBoundingClientRect();
  let fr = ul.getBoundingClientRect();
  // only a panel that is taller than the window scrolls (a scrolling box would also clip the panels that open beside its items)
  if (fr.height > vh - 2 * EDGE) {
    ul.style.maxHeight = vh - 2 * EDGE + "px";
    ul.style.overflowY = "auto";
    fr = ul.getBoundingClientRect();
  }
  let x = lr.right;
  if (x + fr.width > vw - EDGE) x = lr.left - fr.width >= EDGE ? lr.left - fr.width : vw - EDGE - fr.width;
  ul.style.transform = `translateX(${x - lr.right}px)`;
  const over = lr.top + fr.height - (vh - EDGE);
  if (over > 0) ul.style.top = -Math.min(over, Math.max(lr.top - EDGE, 0)) + "px";
}

function Sub({ node, trail }: { node: MenuNode; trail: string[] }) {
  const m = useMenu();
  const kids = node.children;
  const mine = [...trail, node.href];
  const open = mine.every((h, i) => m.path[i] === h);
  return (
    <li className="relative" onMouseEnter={() => m.open(mine)}>
      <Link
        href={node.href}
        onClick={m.close}
        style={kids ? arrow : undefined}
        className={`group/s relative flex items-center gap-[22px] rounded-[3px] py-[2px] pr-[10px] pl-[15px] text-[14px] leading-[26.6px] font-normal whitespace-nowrap capitalize ${
          open ? "bg-[#01aef1] text-[#f0fafe]" : "bg-[#f0fafe] text-[#000000b3] hover:bg-[#01aef1] hover:text-[#f0fafe]"
        } ${kids ? "after:ml-auto after:block after:font-[icomoon] after:text-[11px] after:content-(--i)" : ""}`}
      >
        <span className="block">{node.label}</span>
      </Link>
      {kids && open && (
        <ul ref={placeFly} className={`${PANEL} absolute top-0 left-full z-[1000] text-left`} style={grid(kids.length, 10)}>
          {kids.map((k) => (
            <Sub key={k.href} node={k} trail={mine} />
          ))}
        </ul>
      )}
    </li>
  );
}

function Top({ node }: { node: MenuNode }) {
  const m = useMenu();
  const kids = node.children;
  const open = m.path[0] === node.href;
  return (
    <li className="relative flex h-[40px] flex-auto flex-col justify-center" onMouseEnter={() => m.open([node.href])}>
      <Link
        href={node.href}
        onClick={m.close}
        className={`relative flex h-[40px] items-center justify-center px-[6px] capitalize max-[1201px]:px-[4px] max-[1201px]:text-[13px] ${open ? "text-[#e3f5fd]" : "text-white"} hover:text-[#e3f5fd]`}
        aria-expanded={kids ? open : undefined}
      >
        <span className="block overflow-hidden text-center whitespace-nowrap">{node.label}</span>
      </Link>
      {kids && open && (
        <div className="absolute top-[40px] left-0 z-[1000] h-0 w-0 text-left">
          <span className="absolute top-0 left-[7px] h-0 w-0 border-x-[10px] border-b-[10px] border-x-transparent border-b-[#f0fafe]" />
          <ul ref={placeTop} className={`${PANEL} absolute top-[10px] left-0`} style={grid(kids.length, 9)}>
            {kids.map((k) => (
              <Sub key={k.href} node={k} trail={[node.href]} />
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
