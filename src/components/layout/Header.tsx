"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { home } from "@/data/home";
import DesktopHeader from "./DesktopHeader";
import HeaderShell from "./HeaderShell";
import { CartDropdown, glyph } from "./HeaderParts";
import MobileHeader from "./MobileHeader";
import MobileMenu from "./MobileMenu";
import MobileBottomBar from "./MobileBottomBar";

// A slide-in panel of the mobile header: the menu from the left, the cart from the right.
function Drawer({ side, title, bg, open, onClose, children }: { side: "left" | "right"; title: string; bg: string; open: boolean; onClose: () => void; children: React.ReactNode }) {
  const left = side === "left";
  return (
    <div
      aria-hidden={!open}
      className={`fixed top-0 bottom-0 z-[50000] w-[40%] max-[761px]:w-[85%] ${left ? "left-0" : "right-0"} ${bg} text-[15px] leading-[28.5px] font-medium text-[#000000] shadow-[0_15px_90px_-10px_rgba(0,0,0,0.2)] transition-[transform,visibility] duration-[350ms] ${
        open ? "visible translate-x-0" : `invisible ${left ? "-translate-x-full" : "translate-x-full"}`
      }`}
    >
      <div className="relative z-[1] flex h-[45px] items-center justify-between border-b border-[#0000001f]">
        <span className="flex h-[44px] items-center px-[12px] text-[13px] leading-[24.7px] font-bold text-[#00000099] capitalize">{title}</span>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={glyph("") as CSSProperties}
          className="flex h-[44px] w-[45px] cursor-pointer items-center justify-center text-[25px] leading-[47.5px] before:mr-[3px] before:inline before:font-[icomoon] before:text-[#01aef1] before:content-(--i)"
        />
      </div>
      <div className="h-[calc(100%-45px)] overflow-x-hidden overflow-y-auto pb-[45px] text-[13px] leading-[24.7px]">{children}</div>
    </div>
  );
}

// The header of every page (desktop bar, mobile bar and its two drawers) followed by the page content.
export default function Header({ children }: { children?: React.ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  const [cartDrawer, setCartDrawer] = useState(false);
  const anyOpen = drawer || cartDrawer;

  // The panels belong to the mobile header: close them when the window grows to desktop width.
  useEffect(() => {
    if (!anyOpen) return;
    const mq = window.matchMedia("(min-width: 1025px)");
    const f = () => {
      if (mq.matches) {
        setDrawer(false);
        setCartDrawer(false);
      }
    };
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, [anyOpen]);

  const close = () => {
    setDrawer(false);
    setCartDrawer(false);
  };

  return (
    <>
      <div onClick={close} className={`fixed inset-0 z-[49999] bg-black/50 transition-opacity duration-[350ms] ${anyOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <Drawer side="left" title="Menu" bg="bg-[#f0fafe]" open={drawer} onClose={close}>
        <MobileMenu menu={home.menu} onNavigate={close} />
      </Drawer>
      <Drawer side="right" title="Your Cart" bg="bg-white" open={cartDrawer} onClose={close}>
        <CartDropdown flat onNavigate={close} />
      </Drawer>
      <div className="site-wrapper relative flex flex-col">
        <HeaderShell>
          <DesktopHeader />
          <MobileHeader onMenu={() => setDrawer(true)} onCart={() => setCartDrawer(true)} />
        </HeaderShell>
        {children}
        <div className="h-[58px] min-[762px]:hidden" />
        <MobileBottomBar />
      </div>
    </>
  );
}
